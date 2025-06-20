import { format } from 'date-fns';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { HourlySlot } from '@/api/booking/use-available-time';
import { utcToKathmandu } from '@/lib/date-utils';

interface TimeSlotCardProps {
  slot: HourlySlot;
  onPress: (slot: HourlySlot) => void;
}

export const TimeSlotCard: React.FC<TimeSlotCardProps> = ({
  slot,
  onPress,
}) => {
  const start = utcToKathmandu(slot.start_time);
  const end = utcToKathmandu(slot.end_time);
  const timeRange = `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;

  return (
    <View
      className={`m-2 flex-row items-center justify-between rounded-lg border-2 p-4 ${
        slot.available
          ? 'border-gray-500 bg-successGreen'
          : 'border-gray-500 bg-danger-400'
      }`}
    >
      <View>
        <Text className="text-xl font-semibold tracking-widest text-gray-800">
          {timeRange}
        </Text>
      </View>
      <Pressable
        onPress={() => onPress(slot)}
        disabled={!slot.available}
        className={`rounded-xl px-4 py-2 ${
          slot.available ? 'bg-gray-700' : 'bg-gray-500'
        }`}
      >
        <Text
          className={`text-md font-medium ${slot.available ? 'text-white' : 'text-white'}`}
        >
          {slot.available ? 'Available' : 'Booked'}
        </Text>
      </Pressable>
    </View>
  );
};
