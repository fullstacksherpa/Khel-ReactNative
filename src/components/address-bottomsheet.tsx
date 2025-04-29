import BottomSheet, {
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Text, View } from 'react-native';

import { Button } from '@/components/ui';
import { updateAddress, updateLocation } from '@/lib/location/index';
import { useAddressSheetStore } from '@/lib/location-bottomsheet';

// eslint-disable-next-line max-lines-per-function
const AddressBottomSheet: React.FC = () => {
  const { isSheetOpen, closeSheet } = useAddressSheetStore();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    if (isSheetOpen && bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    } else if (!isSheetOpen && bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  }, [isSheetOpen]);

  // Update the newAddress with the current location's reverse geocoded value.
  const handleUseCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission denied',
        'Allow the app to use location services'
      );
      return;
    }
    const { coords } = await Location.getCurrentPositionAsync();
    if (coords) {
      const { latitude, longitude } = coords;
      updateLocation(latitude, longitude);
      const response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (response && response.length > 0) {
        const { name } = response[0];
        const formattedAddress = `${name} `;
        setNewAddress(formattedAddress);
      }
    }
  };

  // Save the new address in the Zustand store.
  const handleUpdate = async () => {
    if (newAddress.trim()) {
      let latitude: number | null = null;
      let longitude: number | null = null;

      try {
        const geoResults = await Location.geocodeAsync(`${newAddress}, Nepal`);
        console.log(geoResults);
        if (geoResults.length > 0) {
          latitude = geoResults[0].latitude;
          longitude = geoResults[0].longitude;
        }
      } catch (error) {
        Alert.alert(
          'Geocoding Error',
          'Could not fetch location for this address'
        );
        return;
      }

      if (latitude !== null && longitude !== null) {
        updateLocation(latitude, longitude);
        console.log('updateLocation trigger');
      }
      console.log(
        `New longitude and latitude of ${newAddress} is ${longitude}:${latitude}`
      );

      updateAddress(newAddress);
      closeSheet();
    } else {
      Alert.alert('Validation Error', 'Please enter a valid address');
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={[250]}
      enablePanDownToClose
      onClose={closeSheet}
      backgroundStyle={{ backgroundColor: '#f7ffff' }}
    >
      <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '900',
            color: '#808080',
            alignSelf: 'center',
            letterSpacing: 2,
          }}
        >
          Update Your Address
        </Text>
        <View className="flex flex-row gap-2">
          <BottomSheetTextInput
            placeholder="Enter new address"
            placeholderTextColor="#808080"
            value={newAddress}
            onChangeText={setNewAddress}
            style={{
              width: 280,
              borderWidth: 1,
              borderColor: '#808080',
              padding: 12,
              marginVertical: 10,
              borderRadius: 5,
              color: '#0B1215',
              letterSpacing: 1,
            }}
          />
          <Button
            className="rounded-lg bg-highlightYellow p-2"
            textClassName="text-md font-bold"
            label={'Locate Me'}
            onPress={handleUseCurrentLocation}
          />
        </View>

        <Button
          className="my-2 rounded-3xl bg-green-500"
          textClassName="text-2xl"
          label={'Update'}
          onPress={handleUpdate}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default AddressBottomSheet;
