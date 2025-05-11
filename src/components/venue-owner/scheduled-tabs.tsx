// ScheduledTab.tsx
import React from 'react';
import { ActivityIndicator, FlatList, Text } from 'react-native';

import type { ScheduledBooking } from '@/api/owner-booking/use-scheduled-bookings';
import { useScheduledBookings } from '@/api/owner-booking/use-scheduled-bookings';
import ScheduledCard from '@/components/venue-owner/booking-scheduled-card';

interface Props {
  venueID: string | number;
  date: string;
}
export const ScheduledTab: React.FC<Props> = ({ venueID, date }) => {
  const { data, isLoading, error } = useScheduledBookings({
    variables: { venueID, date },
  });
  const bookings = data?.data ?? [];

  if (isLoading) return <ActivityIndicator size="large" color="green" />;
  if (error)
    return <Text className="text-red-500">Failed to load scheduled.</Text>;
  if (bookings.length === 0)
    return (
      <Text className="mt-8 text-center text-gray-500">
        No scheduled bookings for this date.
      </Text>
    );

  return (
    <FlatList<ScheduledBooking>
      data={bookings}
      keyExtractor={(item) => item.booking_id.toString()}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <ScheduledCard booking={item} />}
    />
  );
};
