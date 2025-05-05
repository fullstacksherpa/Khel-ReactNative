import venuepin from '@assets/venuepin.png'; // Consider using a different icon for games
import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { type OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';
import React, { useEffect } from 'react';

import { type Game, useListGames } from '@/api/games/games';
import { useGameVenue } from '@/lib/games-venues-store';

// eslint-disable-next-line max-lines-per-function
export default function GameMarkers() {
  const { nearbyGames, setSelectedGame, selectedGame, setNearbyGames } =
    useGameVenue();
  React.useEffect(() => {
    console.log('Selected Game Updated:🎯', selectedGame);
  }, [selectedGame]);

  const { data, isLoading, error, isSuccess } = useListGames({
    variables: {
      limit: 12,
      // e.g., sport: 'Futsal',
      // e.g., lat: 27.7251,
      // e.g., lng: 85.3701,
      // e.g., distance: 2000,
    },
  });

  const normalizedGames: Game[] | undefined = data?.data.map((game: Game) => ({
    ...game,
  }));
  useEffect(() => {
    if (isSuccess && data) {
      setNearbyGames(normalizedGames);
      console.log('Data fetched successfully:', data);
      console.log(`setting nearbyGames....🔥 ${JSON.stringify(nearbyGames)}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  if (isLoading) return null;
  if (error) {
    console.error('Error fetching Games:', error);
    return null;
  }

  const games = data?.data || [];

  const points = games.map((game) =>
    point([game.venue_lon, game.venue_lat], { gameData: game })
  );

  const onPointPress = async (event: OnPressEvent) => {
    console.log('game pressed');
    const gameData = event.features?.[0]?.properties?.gameData;
    if (gameData) {
      setSelectedGame(gameData);
    }
  };

  return (
    <ShapeSource
      id="games"
      cluster
      shape={featureCollection(points)}
      onPress={onPointPress}
    >
      <SymbolLayer
        id="game-clusters-count"
        style={{
          textField: ['get', 'point_count'],
          textSize: 18,
          textColor: '#ffffff',
          textPitchAlignment: 'map',
        }}
      />

      <CircleLayer
        id="game-clusters"
        belowLayerID="game-clusters-count"
        filter={['has', 'point_count']}
        style={{
          circlePitchAlignment: 'map',
          circleColor: '#FFA500', // Different color for games
          circleRadius: 20,
          circleOpacity: 1,
          circleStrokeWidth: 2,
          circleStrokeColor: 'white',
        }}
      />

      <SymbolLayer
        id="game-icons"
        filter={['!', ['has', 'point_count']]}
        style={{
          iconImage: 'venuepin',
          iconSize: 0.3,
          iconAllowOverlap: true,
          iconAnchor: 'bottom',
        }}
      />
      <Images images={{ venuepin }} />
    </ShapeSource>
  );
}
