import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import CustomHeader from '@/components/custom-header';

export default function VenueRegistration() {
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader>
        <View style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 25 }}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </Pressable>
            <Text className="text-xl font-bold text-white">Rating</Text>
          </View>
        </View>
      </CustomHeader>
      <View className="flex-1 bg-white p-4">
        <Text>register</Text>
      </View>
    </>
  );
}
