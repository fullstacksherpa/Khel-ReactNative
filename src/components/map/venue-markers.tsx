/* eslint-disable import/no-unresolved */
import pin from '@assets/soccermarker.png';
import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { type OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';
import React, { useEffect } from 'react';

import type { Venue as apiVenue } from '@/api/venues/types';
// Import your react-query hook
import { useListVenues } from '@/api/venues/venues';
import { useGameVenue, type Venue } from '@/lib/games-venues-store';

// eslint-disable-next-line max-lines-per-function
export default function VenueMarkers() {
  const { setSelectedVenue, selectedVenue, setNearbyVenues, nearbyVenues } =
    useGameVenue();
  React.useEffect(() => {
    console.log('Selected Venue Updated:', selectedVenue);
  }, [selectedVenue]);
  // Use react-query hook to fetch venues.
  // Adjust or add query variables (such as lat, lng, distance, or sport) if your endpoint requires them.
  const { data, isLoading, error, isSuccess } = useListVenues({
    variables: {
      page: 1,
      limit: 50,
      // e.g., sport: 'Futsal',
      // e.g., lat: 27.7251,
      // e.g., lng: 85.3701,
      // e.g., distance: 2000,
    },
  });

  const normalizedVenues: Venue[] | undefined = data?.data.map(
    (venue: apiVenue) => ({
      ...venue,
      location: [venue.location[0], venue.location[1]] as [number, number],
    })
  );

  useEffect(() => {
    if (isSuccess && data) {
      setNearbyVenues(normalizedVenues);
      console.log('Data fetched successfully:', data);
      console.log(`setting nearbyVenues....🔥 ${JSON.stringify(nearbyVenues)}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, data]);

  // Optionally handle loading and error states
  if (isLoading) return null;
  if (error) {
    console.error('Error fetching venues:', error);
    return null;
  }

  // If your endpoint responds with { data: Venue[] }
  // where Venue has longitude and latitude fields,
  // then map over the data to create GeoJSON points.
  const venues = data?.data || [];
  const points = venues.map((venue) =>
    point([venue.location[0], venue.location[1]], { venueData: venue })
  );

  // When a user presses a marker, you may want to handle it (e.g., select the venue)
  const onPointPress = (event: OnPressEvent) => {
    console.log('venue pressed');
    const venueData = event.features?.[0]?.properties?.venueData;
    if (venueData) {
      setSelectedVenue(venueData);
    }
  };

  return (
    <ShapeSource
      id="venues"
      cluster
      shape={featureCollection(points)}
      onPress={onPointPress}
    >
      <SymbolLayer
        id="clusters-count"
        style={{
          textField: ['get', 'point_count'],
          textSize: 18,
          textColor: '#ffffff',
          textPitchAlignment: 'map',
        }}
      />
      <CircleLayer
        id="clusters"
        belowLayerID="clusters-count"
        filter={['has', 'point_count']}
        style={{
          circlePitchAlignment: 'map',
          circleColor: '#42E100',
          circleRadius: 20,
          circleOpacity: 1,
          circleStrokeWidth: 2,
          circleStrokeColor: 'white',
        }}
      />
      <SymbolLayer
        id="venue-icon"
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
