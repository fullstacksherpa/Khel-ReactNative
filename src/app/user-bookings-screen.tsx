import { Stack } from 'expo-router';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

import { useUserBookings } from '@/api/booking/use-user-bookings';
import { type Booking, BookingCard } from '@/components/booking/booking-card';

export default function BookingsScreen() {
  const { data, isLoading, error } = useUserBookings();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-500">Loading bookings…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-red-500">Failed to load bookings.</Text>
        <Text className="text-gray-500">{error.message}</Text>
      </View>
    );
  }

  const bookings = data?.data ?? [];

  if (bookings.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-4">
        <Text className="text-gray-500">You have no bookings yet.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <Stack.Screen
        options={{ headerBackTitle: 'back', title: 'All Bookings' }}
      />
      <FlatList<Booking>
        data={bookings}
        keyExtractor={(item) => item.bookingId.toString()}
        renderItem={({ item }) => <BookingCard booking={item} />}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}
