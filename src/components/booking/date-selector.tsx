import React from 'react';
import { FlatList, Pressable, Text } from 'react-native';

import type { DateItem } from '@/lib/date-utils';

interface DateSelectorProps {
  dates: DateItem[];
  selectedDate: string;
  onSelect: (fullDate: string) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  dates,
  selectedDate,
  onSelect,
}) => {
  return (
    <FlatList
      data={dates}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => `${item.fullDate}-${index}`}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 13 }}
      renderItem={({ item }) => {
        const isSelected = item.fullDate === selectedDate;
        return (
          <Pressable
            onPress={() => onSelect(item.fullDate)}
            className={`mx-1 items-center justify-center rounded-lg p-3 ${isSelected ? 'bg-mainGreen' : 'bg-gray-200'}`}
          >
            <Text
              className={`${isSelected ? 'text-white' : 'text-red-800'} text-lg font-semibold`}
            >
              {item.dayLabel}
            </Text>
            <Text
              className={`${isSelected ? 'font-bold text-white' : 'font-semibold text-gray-900'} text-xl`}
            >
              {item.dayNum}
            </Text>
          </Pressable>
        );
      }}
    />
  );
};
