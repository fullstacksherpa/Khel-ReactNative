import { Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function ComingSoonScreen() {
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
    </View>
  );
}
