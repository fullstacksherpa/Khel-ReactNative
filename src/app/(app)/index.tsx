import { Stack } from 'expo-router';
import React from 'react';

import Map from '@/components/map';
import SelectedVenueSheet from '@/components/map/selected-venue-sheet';

// Adjust path to where the CustomHeader component is located

const MyScreen = () => {
  return (
    <>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      <Map />
      <SelectedVenueSheet />
    </>
  );
};

export default MyScreen;
