import { Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { getAccessToken } from '@/lib/auth/utils';

export default function ComingSoonScreen() {
  const access = getAccessToken();
  console.log(access);
  return (
    <View className="flex-1 items-center bg-white px-5 pt-32">
      <Stack.Screen
        options={{
          headerBackTitle: 'Back',
          title: 'Playpals',
        }}
      />
      <Text className="text-md  text-center font-semibold leading-relaxed tracking-wider text-gray-800">
        We will introduce friends following features on v2. You will get notify
        when your friends create a game.
      </Text>
    </View>
  );
}
