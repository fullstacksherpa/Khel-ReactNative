import pin from '@assets/soccermarker.png'; // Consider using a different icon for games
import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { type OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';

import { useGameVenue } from '@/lib/games-venues-store';

export default function GameMarkers() {
  const { nearbyGames, setSelectedGame } = useGameVenue();
  const points = nearbyGames.map((game) =>
    point([game.long, game.lat], { gameData: game })
  );

  const onPointPress = async (event: OnPressEvent) => {
    if (event.features[0].properties?.gameData) {
      setSelectedGame(event.features[0].properties.gameData);
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
          iconImage: 'pin',
          iconSize: 0.09,
          iconAllowOverlap: true,
          iconAnchor: 'bottom',
        }}
      />
      <Images images={{ pin }} />
    </ShapeSource>
  );
}
