// Map.tsx
import { Env } from '@env';
import type BottomSheet from '@gorhom/bottom-sheet';
import Mapbox, { Camera, LocationPuck } from '@rnmapbox/maps';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import type { Venue } from '@/api/venues/types'; // assume Venue type is defined here
import VenueDetailsBottomSheet from '@/components/map/selected-venue-sheet';
import VenueMarkers from '@/components/map/venue-markers';

Mapbox.setAccessToken(Env.MAPBOX_PUBLIC_TOKEN);

// eslint-disable-next-line max-lines-per-function
export default function MapScreen() {
  const [initialLocation, setInitialLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [currentCenter, setCurrentCenter] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: 27.7172,
    lng: 85.324,
  });
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const mapRef = useRef<Mapbox.MapView>(null);
  const cameraRef = useRef<Camera>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Radius in meters for the bounds query
  const currentRadius = 10000;

  // Request user's current location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setInitialLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  // When initial location is available, center the camera
  useEffect(() => {
    if (initialLocation && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [initialLocation.longitude, initialLocation.latitude],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  }, [initialLocation]);

  // When map region changes, recalc the center from visible bounds
  const handleRegionDidChange = async () => {
    if (mapRef.current) {
      try {
        const bounds = await mapRef.current.getVisibleBounds();
        // bounds returns [[minLng, minLat], [maxLng, maxLat]]
        if (bounds && bounds.length === 2) {
          const [min, max] = bounds;
          const centerLat = (min[1] + max[1]) / 2;
          const centerLng = (min[0] + max[0]) / 2;
          setCurrentCenter({ lat: centerLat, lng: centerLng });
        }
      } catch (error) {
        console.error('Error fetching bounds:', error);
      }
    }
  };

  // When a venue marker is pressed, update selected venue and open bottom sheet.
  const handleMarkerPress = useCallback(
    (venue: Venue) => {
      if (venue.id === selectedVenue?.id) return;
      setSelectedVenue(venue);
      bottomSheetRef.current?.snapToIndex(1);
    },
    [selectedVenue]
  );

  return (
    <View style={{ flex: 1 }}>
      <Mapbox.MapView
        ref={mapRef}
        style={{ flex: 1 }}
        styleURL="mapbox://styles/mapbox/streets-v12"
        onRegionDidChange={handleRegionDidChange}
      >
        <Camera ref={cameraRef} />
        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: true }}
        />
        <VenueMarkers
          currentCenter={currentCenter}
          currentRadius={currentRadius}
          onMarkerPress={handleMarkerPress}
        />
      </Mapbox.MapView>
      <VenueDetailsBottomSheet
        bottomSheetRef={bottomSheetRef}
        venue={selectedVenue}
      />
    </View>
  );
}
