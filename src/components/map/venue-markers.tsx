/* eslint-disable import/no-unresolved */
import pin from '@assets/venuepin.png';
import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import { type OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';
import React from 'react';

// Import your react-query hook
import { useListVenues } from '@/api/venues/venues';
import { useGameVenue } from '@/lib/games-venues-store';

// eslint-disable-next-line max-lines-per-function
export default function VenueMarkers() {
  const { setSelectedVenue, selectedVenue } = useGameVenue();
  // Use react-query hook to fetch venues.
  // Adjust or add query variables (such as lat, lng, distance, or sport) if your endpoint requires them.
  const { data, isLoading, error } = useListVenues({
    variables: {
      page: 1,
      limit: 50,
      // e.g., sport: 'Futsal',
      // e.g., lat: 27.7251,
      // e.g., lng: 85.3701,
      // e.g., distance: 2000,
    },
  });

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
    const feature = event.features[0];
    if (feature?.properties?.venueData) {
      // For example, you could call a setter or navigate to a details screen:
      setSelectedVenue(feature.properties.venueData);
      console.log('Selected venue:🚨', feature.properties.venueData);
      console.log(`✅${selectedVenue}`);
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
        id="scooter-icons"
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
