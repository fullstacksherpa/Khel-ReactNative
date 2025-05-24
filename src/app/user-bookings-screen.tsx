import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

import {
  type Booking,
  useInfiniteUserBookings,
} from '@/api/booking/use-user-bookings';
import { BookingCard } from '@/components/booking/booking-card';

const STATUS_OPTIONS = [
  'all',
  'confirmed',
  'pending',
  'rejected',
  'done',
] as const;

// eslint-disable-next-line max-lines-per-function
export default function BookingsScreen() {
  const [momentumLock, setMomentumLock] = useState(false);
  const [statusFilter, setStatusFilter] =
    useState<(typeof STATUS_OPTIONS)[number]>('all');

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteUserBookings({
      variables: {
        limit: 4,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      },
    });

  // Combine pages
  const bookings = data?.pages.flatMap((page) => page.data) ?? [];

  // When filter changes, reset to first page
  const onStatusChange = useCallback(
    (newStatus: (typeof STATUS_OPTIONS)[number]) => {
      setStatusFilter(newStatus);
    },
    []
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" />
        <Text className="mt-2 text-gray-500">Loading bookings…</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{ headerTitle: 'My Bookings', headerBackTitle: 'Settings' }}
      />

      {/* Status filter buttons */}
      <View className="flex-row justify-around bg-white p-2">
        {STATUS_OPTIONS.map((s) => (
          <Pressable
            key={s}
            onPress={() => onStatusChange(s)}
            className={[
              'px-3 py-1 rounded-full',
              statusFilter === s ? 'bg-green-600' : 'border border-gray-300',
            ].join(' ')}
          >
            <Text
              className={statusFilter === s ? 'text-white' : 'text-gray-700'}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Empty state */}
      {bookings.length === 0 && (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-gray-500">No bookings found.</Text>
        </View>
      )}

      {/* Infinite scroll list */}
      <FlatList<Booking>
        data={bookings}
        keyExtractor={(b) => b.bookingId.toString()}
        renderItem={({ item }) => <BookingCard booking={item} />}
        showsVerticalScrollIndicator={false}
        onMomentumScrollBegin={() => setMomentumLock(false)}
        onEndReached={() => {
          if (!momentumLock && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
            setMomentumLock(true);
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator style={{ padding: 10 }} />
          ) : null
        }
        contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 10 }}
      />
    </View>
  );
}
