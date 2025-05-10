import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

import { useAvailableTimes } from '@/api/booking/use-available-time';
import { useBookVenue } from '@/api/booking/use-book-venue';
import { DateSelector } from '@/components/booking/date-selector';
import { TimeSlotCard } from '@/components/booking/time-slot-card';
import CustomHeader from '@/components/custom-header';
import { generateDatesArray } from '@/lib/date-utils';

// eslint-disable-next-line max-lines-per-function
export default function AvailableTimesScreen() {
  const router = useRouter();
  const { venueId } = useLocalSearchParams();
  const venueIDNumber = Number(venueId);

  const dates = useMemo(() => generateDatesArray(10), []);
  const [selectedDate, setSelectedDate] = useState(dates[0].fullDate);

  const isoDate = selectedDate.slice(0, 10);
  const { data, isLoading, error } = useAvailableTimes({
    variables: { venueID: venueId.toString(), date: isoDate },
  });
  const slots = data?.data ?? [];

  // booking mutation hook
  const {
    mutate: bookVenue,
    isPending: isBooking,
    error: bookingError,
  } = useBookVenue();

  const handleBook = (slot: (typeof slots)[number]) => {
    const start = new Date(slot.start_time);
    const end = new Date(slot.end_time);
    const timeRange = `${start.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })} - ${end.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}`;

    Alert.alert(
      'Confirm Booking',
      `Do you want to book the slot ${timeRange}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            bookVenue(
              {
                venueID: venueIDNumber,
                start_time: slot.start_time,
                end_time: slot.end_time,
              },
              {
                onSuccess: () => {
                  // Navigate to review/confirmation screen
                  router.push({ pathname: '/' });
                },
                onError: (err) => {
                  const status = err.response?.status;
                  console.log(bookingError);
                  if (status === 409) {
                    Alert.alert(
                      'Conflict',
                      'This time slot is already booked.'
                    );
                  } else {
                    Alert.alert(
                      'Error',
                      'Failed to create booking. Please try again.'
                    );
                  }
                },
              }
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <CustomHeader>
        <View style={{ paddingHorizontal: 12, paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 30 }}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </Pressable>

            <View className="items-center self-center rounded-2xl pl-9">
              <Text className="text-xl font-bold text-white">
                Check Availability
              </Text>
            </View>
          </View>
        </View>
      </CustomHeader>

      <View className="mb-20 flex bg-white pb-64">
        <DateSelector
          dates={dates}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />

        <View className="px-4 py-2">
          <Text className="text-xl font-bold">Available Time Slots</Text>
        </View>

        {isLoading || isBooking ? (
          <ActivityIndicator size="large" className="mt-8" color="#22C55E" />
        ) : error ? (
          <View className="mt-8 items-center">
            <Text className="text-red-500">{`Failed to load slots. ${error}`}</Text>
          </View>
        ) : (
          <FlatList
            data={slots}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, i) => `${item}_${i}`}
            renderItem={({ item }) => (
              <TimeSlotCard slot={item} onPress={handleBook} />
            )}
            contentContainerStyle={{
              paddingBottom: 32,
              marginBottom: 50,
              flexGrow: 1,
            }}
          />
        )}
      </View>
    </>
  );
}
