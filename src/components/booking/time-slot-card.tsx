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
  const period = format(start, 'aaaa');

  return (
    <View
      className={`m-2 flex-row items-center justify-between rounded-lg border-2 p-4 ${
        slot.available
          ? 'border-gray-800 bg-successGreen'
          : 'border-gray-200 bg-danger-200'
      }`}
    >
      <View>
        <Text className="text-lg font-semibold text-gray-900">{timeRange}</Text>
        <Text className="text-sm text-gray-900">{period}</Text>
      </View>
      <Pressable
        onPress={() => onPress(slot)}
        disabled={!slot.available}
        className={`rounded-full px-4 py-2 ${
          slot.available ? 'bg-gray-800' : 'bg-gray-600'
        }`}
      >
        <Text
          className={`text-sm font-medium ${slot.available ? 'text-white' : 'text-white'}`}
        >
          {slot.available ? 'Book' : 'Booked'}
        </Text>
      </Pressable>
    </View>
  );
};
