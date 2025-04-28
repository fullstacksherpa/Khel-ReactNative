import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import CustomHeader from '@/components/custom-header';
import ActiveLevel from '@/components/profile/active-level';
import ProfileHeader from '@/components/profile/profile-header';
import ReputationBadges from '@/components/profile/reputation-badges';

const ViewProfile = () => {
  const router = useRouter();
  return (
    <>
      <CustomHeader>
        <View style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </Pressable>
            <Pressable onPress={() => router.push('/edit-profile')}>
              <FontAwesome5 name="user-edit" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </CustomHeader>
      <ScrollView className="flex-1 bg-white p-4">
        <ProfileHeader
          username="Ongchen Sherpa"
          games={2}
          playpals={2}
          karma={95}
          lastPlayed="27th April"
          uri="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJqcSD_2qz834cW2RuNWmvAbOMwcZdWSf81Q&s"
        />
        <ActiveLevel level="Warming Up" />
        <ReputationBadges punctual={5} paymentOnTime={30} />
      </ScrollView>
    </>
  );
};

export default ViewProfile;
