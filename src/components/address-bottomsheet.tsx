import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Text, TextInput } from 'react-native';

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
      backgroundStyle={{ backgroundColor: '#19892C' }}
    >
      <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#fff' }}>
          Update Address
        </Text>
        <TextInput
          placeholder="Enter new address"
          placeholderTextColor="#fff"
          value={newAddress}
          onChangeText={setNewAddress}
          style={{
            borderWidth: 1,
            borderColor: '#fff',
            padding: 10,
            marginVertical: 10,
            borderRadius: 5,
            color: 'white',
          }}
        />
        <Button
          title="Use Current Location"
          onPress={handleUseCurrentLocation}
          color="#fff"
        />
        <Button title="Update" onPress={handleUpdate} color="#fff" />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default AddressBottomSheet;
