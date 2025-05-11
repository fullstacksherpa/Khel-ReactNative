// PendingTab.tsx
import React from 'react';
import { ActivityIndicator, FlatList, Text } from 'react-native';

import type { PendingBooking } from '@/api/owner-booking/use-pending-bookings';
import { usePendingBookings } from '@/api/owner-booking/use-pending-bookings';
import BookingCard from '@/components/venue-owner/booking-request-card';

interface Props {
  venueID: string | number;
  date: string;
}
export const PendingTab: React.FC<Props> = ({ venueID, date }) => {
  const { data, isLoading, error, refetch } = usePendingBookings({
    variables: { venueID, date },
  });
  const bookings = data?.data ?? [];

  if (isLoading) return <ActivityIndicator size="large" color="green" />;
  if (error)
    return <Text className="text-red-500">Failed to load requests.</Text>;
  if (bookings.length === 0)
    return (
      <Text className="mt-8 text-center text-gray-500">
        No pending requests for this date.
      </Text>
    );

  return (
    <FlatList<PendingBooking>
      data={bookings}
      keyExtractor={(item) => item.booking_id.toString()}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <BookingCard booking={item} venueID={+venueID} refetch={refetch} />
      )}
    />
  );
};
