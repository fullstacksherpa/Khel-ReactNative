// /screens/HelpAndSupport.tsx

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, SafeAreaView, ScrollView, Text, View } from 'react-native';

// eslint-disable-next-line max-lines-per-function
export default function HelpAndSupport() {
  const router = useRouter();

  const items: { title: string; subtitle?: string; screen?: string }[] = [
    {
      title: 'Accounts & Settings',
      subtitle: 'Profile, Delete Account, Privacy Policy, Terms of Service…',
      screen: 'support/accounts',
    },
    {
      title: 'Meet Players',
      subtitle: 'Find players around you',
      screen: 'support/meet-player',
    },
    {
      title: 'Venues: Places to Play',
      subtitle: 'Discover, Book & List Venues',
      screen: 'support/venues',
    },
    {
      title: 'Rescheduling',
      subtitle: 'Rescheduling Game Slots, Rescheduling Policies, Charges…',
      screen: 'support/rescheduling',
    },
    {
      title: 'Cancellation & Refunds',
      subtitle: 'How to Cancel, Cancellation Policies, Refunds & more',
      screen: 'support/cancellation',
    },
    {
      title: 'Venue Registration',
      subtitle: 'Request to register your venue at our platform',
      screen: 'support/venue-register',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center border-b border-gray-200 px-4 py-3">
        <Pressable onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#333" />
        </Pressable>
        <Text className="ml-2 text-xl font-bold text-gray-800">
          Help And Support
        </Text>
      </View>

      {/* List */}
      <ScrollView className="flex-1">
        {items.map(({ title, subtitle, screen }, idx) => (
          <Pressable
            key={idx}
            className="flex-row items-start border-b border-gray-200 px-4 py-5"
            onPress={() => screen && router.push(`/${screen}`)}
          >
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-800">
                {title}
              </Text>
              {subtitle && (
                <Text className="mt-1 text-sm text-gray-500">{subtitle}</Text>
              )}
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="#999"
              className="ml-auto"
            />
          </Pressable>
        ))}
      </ScrollView>

      {/* Raise Ticket Button */}
      <View className="border-t border-gray-200 bg-white px-4 py-3">
        <Pressable
          className="flex-row items-center justify-center rounded-full bg-green-100 py-3"
          onPress={() => router.push('/feedback')}
        >
          <Ionicons name="create-outline" size={20} color="#2a9d8f" />
          <Text className="ml-2 text-base font-semibold text-green-800">
            Write to us
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
