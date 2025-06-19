import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { Button } from '@/components/ui';

export default function ComingSoonScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-white px-5">
      <Stack.Screen
        options={{
          headerBackTitle: 'Back',
          title: 'Offers',
        }}
      />
      <Text className="text-md text-center font-semibold leading-relaxed tracking-wider text-gray-800">
        We couldn’t find any offers yet. Hold tight while we negotiate with
        venue owners.
      </Text>
      <Button
        label="onboarding"
        className="bg-green-600"
        onPress={() => {
          router.push('/onboarding');
        }}
      />
      <Button
        label="email-verification"
        className="bg-green-600"
        onPress={() => {
          router.push('/email-verification');
        }}
      />
      <Button
        label="create-Pricing"
        className="bg-green-600"
        onPress={() => {
          router.push('/support/create-pricing');
        }}
      />
    </View>
  );
}
