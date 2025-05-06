// VenueMarkers.tsx
/* eslint-disable import/no-unresolved */
import pin from '@assets/soccermarker.png';
import { CircleLayer, Images, ShapeSource, SymbolLayer } from '@rnmapbox/maps';
import type { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';
import React from 'react';

import type { Venue as ApiVenue } from '@/api/venues/types';
import type { Venue } from '@/api/venues/types';
import { useVenuesWithinBounds } from '@/api/venues/use-venues-within-bounds';

type VenueMarkersProps = {
  currentCenter: { lat: number; lng: number };
  currentRadius: number;
  onMarkerPress: (venue: Venue) => void;
};

// eslint-disable-next-line max-lines-per-function
export default function VenueMarkers({
  currentCenter,
  currentRadius,
  onMarkerPress,
}: VenueMarkersProps) {
  const { data, isLoading, error } = useVenuesWithinBounds({
    variables: {
      lat: currentCenter.lat,
      lng: currentCenter.lng,
      distance: currentRadius,
    },
  });

  if (isLoading) return null;
  if (error) {
    console.error('Error fetching venues:', error);
    return null;
  }

  // Transform the API data into an array of venues.
  const venues: ApiVenue[] = data?.data || [];
  // Convert venues to GeoJSON points.
  const points = venues.map((venue) =>
    point([venue.location[0], venue.location[1]], { venueData: venue })
  );

  // When a marker is tapped, extract the venue data from the feature and pass it upward.
  const onPointPress = (event: OnPressEvent) => {
    const feature = event.features?.[0];
    if (feature && feature.properties && feature.properties.venueData) {
      // Note: ensure that your API returns the venue data in a serializable form.
      const venueData = feature.properties.venueData as Venue;
      onMarkerPress(venueData);
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
