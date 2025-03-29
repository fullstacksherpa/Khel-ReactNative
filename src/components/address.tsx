import * as Location from 'expo-location';
import React, { useEffect } from 'react';
import { Alert, Pressable, Text } from 'react-native';

import {
  updateAddress,
  updateLocation,
  useLocation,
} from '@/lib/location/index';
import { useAddressSheetStore } from '@/lib/location-bottomsheet';

const Address: React.FC = () => {
  // Subscribe to the address slice of state.
  const address = useLocation((state) => state.address);
  const { toggleSheet } = useAddressSheetStore();

  useEffect(() => {
    // If the address hasn't been set, fetch it.
    if (!address || address === 'Loading...') {
      (async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert(
            'Permission denied',
            'Allow the app to use the location services'
          );
          return;
        }

        // Get the current coordinates.
        const { coords } = await Location.getCurrentPositionAsync();
        if (coords) {
          const { latitude, longitude } = coords;
          updateLocation(latitude, longitude);

          // Reverse geocode to fetch the address.
          const response = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
          });
          if (response && response.length > 0) {
            const { name } = response[0];
            const formattedAddress = `${name}`;
            updateAddress(formattedAddress);
          }
        }
      })();
    }
  }, [address]);

  return (
    <>
      {/* When pressed, open the bottom sheet */}
      <Pressable onPress={toggleSheet}>
        <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>
          {address && address !== 'Loading...'
            ? address
            : 'Fetching location...'}
        </Text>
      </Pressable>
    </>
  );
};

export default Address;
