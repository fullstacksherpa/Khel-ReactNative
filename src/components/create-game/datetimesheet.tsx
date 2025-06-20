import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { generateDatesArray, generateTimeSlots } from '@/lib/date-utils';

import { Button } from '../ui';

type DateTimeSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedTime: string;
  setSelectedTime: (time: string) => void;
  selectedDuration: number;
  setSelectedDuration: (minutes: number) => void;
  handleConfirm: () => void;
  openTime?: string;
  closeTime?: string;
};

const durations = [
  { label: '1 hour', minutes: 60 },
  { label: '1 hour 30 minutes', minutes: 90 },
  { label: '2 hours', minutes: 120 },
  { label: '2 hours 30 minutes', minutes: 150 },
];

// eslint-disable-next-line max-lines-per-function
export default function DateTimeSheet({
  bottomSheetRef,
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  selectedDuration,
  setSelectedDuration,
  handleConfirm,
  openTime = '06:00',
  closeTime = '21:00',
}: DateTimeSheetProps) {
  const datesArray = useMemo(() => generateDatesArray(10), []);
  const timeArray = useMemo(
    () => generateTimeSlots(openTime, closeTime),
    [openTime, closeTime]
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['80%']}
      enablePanDownToClose
    >
      <TouchableOpacity
        className="mr-4 self-end"
        onPress={() => bottomSheetRef.current?.close()}
      >
        <Text className=" text-4xl">✕</Text>
      </TouchableOpacity>
      <View className="mb-3 mt-1">
        <Text className="ml-5 text-2xl font-bold tracking-widest text-gray-500">
          Pick a Date
        </Text>
      </View>
      {/* Date Picker */}
      <BottomSheetFlatList
        data={datesArray}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.fullDate}
        contentContainerStyle={{ paddingHorizontal: 12 }}
        renderItem={({ item }) => {
          const isSelected = item.fullDate === selectedDate;
          return (
            <TouchableOpacity
              onPress={() => setSelectedDate(item.fullDate)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: 10,
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected ? '#22c55e' : '#F0F0F0',
                width: 60,
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  marginBottom: 4,
                  fontSize: 27,
                  lineHeight: 30,
                }}
              >
                {item.dayNum}
              </Text>
              <Text style={{ letterSpacing: 2 }}>{item.dayLabel}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <View className="my-5">
        <Text className="ml-5 text-2xl font-bold tracking-widest text-gray-500">
          Game Start Time
        </Text>
      </View>
      {/* Time Picker */}
      <BottomSheetFlatList
        data={timeArray}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, idx) => `${item}-${idx}`}
        contentContainerStyle={{ paddingHorizontal: 18 }}
        renderItem={({ item }) => {
          const isSelected = item === selectedTime;
          return (
            <TouchableOpacity
              onPress={() => setSelectedTime(item)}
              style={{
                paddingVertical: 1,
                paddingHorizontal: 5,
                borderRadius: 10,
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected ? '#22c55e' : '#F0F0F0',
                minWidth: 70,
              }}
            >
              <Text style={{ fontWeight: 'bold', padding: 4, fontSize: 16 }}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <View className="my-5">
        <Text className="ml-5 text-2xl font-bold tracking-widest text-gray-500">
          Game Duration
        </Text>
      </View>
      {/* Duration Picker */}
      <BottomSheetFlatList
        data={durations}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.label}
        contentContainerStyle={{ paddingHorizontal: 6 }}
        renderItem={({ item }) => {
          const isSelected = item.minutes === selectedDuration;
          return (
            <TouchableOpacity
              onPress={() => setSelectedDuration(item.minutes)}
              style={{
                paddingVertical: 1,
                paddingHorizontal: 12,
                borderRadius: 10,
                marginRight: 8,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: isSelected ? '#22c55e' : '#F0F0F0',
              }}
            >
              <Text
                style={{
                  fontWeight: 'bold',
                  paddingVertical: 4,
                  fontSize: 17,
                }}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
      <View className="mb-8 mt-4 items-center">
        <Button
          onPress={handleConfirm}
          label="Confirm"
          className="rounded-2xl bg-green-700 px-8"
        />
      </View>
    </BottomSheet>
  );
}
