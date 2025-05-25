import { Env } from '@env';
import { AntDesign } from '@expo/vector-icons';
import type BottomSheet from '@gorhom/bottom-sheet';
import Mapbox, { Camera, LocationPuck } from '@rnmapbox/maps';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import type { Venue } from '@/api/venues/types';
import VenueDetailsBottomSheet from '@/components/map/selected-venue-sheet';
import VenueMarkers from '@/components/map/venue-markers';
import { useLocation } from '@/lib/location';

Mapbox.setAccessToken(Env.MAPBOX_PUBLIC_TOKEN);

// eslint-disable-next-line max-lines-per-function
export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  // 2) pull from Zustand
  const storeLat = useLocation((s) => s.latitude);
  const storeLng = useLocation((s) => s.longitude);

  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);

  const mapRef = useRef<Mapbox.MapView>(null);
  const cameraRef = useRef<Camera>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Request user's current location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setUserLocation({ lat: loc.coords.latitude, lng: loc.coords.longitude });
    })();
  }, []);

  // When initial location is available, center the camera
  useEffect(() => {
    if (userLocation && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [userLocation.lng, userLocation.lat],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    }
  }, [userLocation]);

  // When a venue marker is pressed, update selected venue and open bottom sheet.
  const handleMarkerPress = useCallback((venue: Venue) => {
    setSelectedVenue(venue);
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  // recenter handler: prefer the store, then the local state
  const recenter = () => {
    const lat = storeLat ?? userLocation?.lat;
    const lng = storeLng ?? userLocation?.lng;
    if (lat != null && lng != null) {
      cameraRef.current?.setCamera({
        centerCoordinate: [lng, lat],
        zoomLevel: 14,
        animationDuration: 600,
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Mapbox.MapView
        ref={mapRef}
        style={{ flex: 1 }}
        styleURL="mapbox://styles/mapbox/streets-v12"
      >
        <Camera ref={cameraRef} />
        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: true }}
        />
        {userLocation ? (
          <VenueMarkers
            userLocation={userLocation}
            currentRadius={10000}
            onMarkerPress={handleMarkerPress}
          />
        ) : (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text>Fetching your location…</Text>
          </View>
        )}
      </Mapbox.MapView>
      <VenueDetailsBottomSheet
        bottomSheetRef={bottomSheetRef}
        venue={selectedVenue}
        onChange={(index: number) => setIsBottomSheetOpen(index > 0)}
      />
      {!isBottomSheetOpen && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={recenter}
          className="
      absolute 
      bottom-6 
      right-6 
      rounded-full 
      bg-white/40 
      p-3 
      shadow-lg
    "
        >
          {userLocation ? (
            <AntDesign name="enviroment" size={24} color="#023e8a" />
          ) : (
            <Text className="text-white">…</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}
