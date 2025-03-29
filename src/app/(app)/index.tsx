import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from 'expo-router';
import React from 'react';
import { Image, Text, View } from 'react-native';

import Address from '@/components/address';
import AddressBottomSheet from '@/components/address-bottomsheet';
import CustomHeader from '@/components/custom-header';
import Map from '@/components/map';
import SelectedVenueSheet from '@/components/map/selected-venue-sheet';
import TabScreen from '@/components/map/tabscreen';

// Adjust path to where the CustomHeader component is located

// eslint-disable-next-line max-lines-per-function
const MyScreen = () => {
  return (
    <>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      <CustomHeader>
        <View style={{ padding: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>
                <Address />
              </Text>
              <MaterialIcons name="location-pin" size={20} color="#f94449" />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <Ionicons name="chatbox-outline" size={24} color="white" />
              <Ionicons name="notifications-outline" size={24} color="white" />

              <View>
                <Image
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                  source={{
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJqcSD_2qz834cW2RuNWmvAbOMwcZdWSf81Q&s',
                  }}
                />
              </View>
            </View>
          </View>
          <View className="mt-2">
            <TabScreen />
          </View>
        </View>
      </CustomHeader>
      <Map />
      <SelectedVenueSheet />
      <AddressBottomSheet />
    </>
  );
};

export default MyScreen;
