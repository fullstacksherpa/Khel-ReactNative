import Ionicons from '@expo/vector-icons/Ionicons';
import { formatInTimeZone } from 'date-fns-tz';
import React from 'react';
import { Text, View } from 'react-native';

import FormattedDateTimeRange from '../game/formatted-datetime-range';

export type Booking = {
  bookingId: number;
  venueName: string;
  venueAddress: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  createdAt: string;
};

type Props = {
  booking: Booking;
};

// eslint-disable-next-line max-lines-per-function
export function BookingCard({ booking }: Props) {
  const {
    venueName,
    venueAddress,
    startTime,
    endTime,
    totalPrice,
    status,
    createdAt,
  } = booking;

  return (
    <View className="border-1 mb-4 rounded-2xl border bg-white p-3">
      {/* Header */}
      <View className="mb-2 flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-semibold text-gray-900">
            {venueName}
          </Text>
          <Text className="text-md text-gray-500">{venueAddress}</Text>
        </View>
        <View className="rounded-full bg-gray-200 px-2 py-1">
          <Text className="text-xs font-semibold capitalize text-gray-700">
            {status}
          </Text>
        </View>
      </View>

      {/* Date / time row */}
      <View className="mb-2 flex-row items-center">
        <Ionicons
          name="calendar-outline"
          size={16}
          className="mr-1 text-gray-500"
        />
        <Text className="pl-1 text-sm text-gray-700">
          <FormattedDateTimeRange
            startUtc={startTime}
            endUtc={endTime}
            style={{ marginTop: 10, fontSize: 14, fontWeight: '500' }}
          />
        </Text>
      </View>

      {/* Price row */}
      <View className="mb-2 flex-row items-center">
        <Ionicons
          name="pricetag-outline"
          size={16}
          className="mr-1 text-gray-500"
        />
        <Text className="text-md pl-1 font-medium text-gray-700">
          Rs {totalPrice}
        </Text>
      </View>

      {/* Created at row */}
      <View className="flex-row items-center">
        <Ionicons
          name="time-outline"
          size={16}
          className="mr-1 text-gray-500"
        />
        <Text className="text-md pl-1 text-gray-500">
          Booked on{' '}
          {formatInTimeZone(createdAt, 'Asia/Kathmandu', 'EEEE,  d MMM')}
        </Text>
      </View>
    </View>
  );
}
