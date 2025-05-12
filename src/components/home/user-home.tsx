import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import Address from '@/components/address';
import AddressBottomSheet from '@/components/address-bottomsheet';
import CustomHeader from '@/components/custom-header';
import Map from '@/components/map';
import { UserAvatar } from '@/components/profile/user-avatar';

const UserHome = () => {
  const router = useRouter();

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
                <UserAvatar />
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

export default UserHome;
