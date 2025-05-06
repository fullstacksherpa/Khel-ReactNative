import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import Address from '@/components/address';
import AddressBottomSheet from '@/components/address-bottomsheet';
import CustomHeader from '@/components/custom-header';
import Map from '@/components/map';
import { getAccessToken } from '@/lib/auth/utils';

// eslint-disable-next-line max-lines-per-function
const MyScreen = () => {
  const router = useRouter();

  //TODO: delete later
  const access_token = getAccessToken();
  console.log(`COPY ACCESS_TOKEN${access_token}`);

  return (
    <>
      <Stack.Screen options={{ title: 'Home', headerShown: false }} />
      <CustomHeader>
        <View style={{ paddingHorizontal: 15, paddingVertical: 20 }}>
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

              <Pressable onPress={() => router.push('/view-profile')}>
                <Image
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                  source={{
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJqcSD_2qz834cW2RuNWmvAbOMwcZdWSf81Q&s',
                  }}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </CustomHeader>
      <Map />

      <AddressBottomSheet />
    </>
  );
};

export default MyScreen;
