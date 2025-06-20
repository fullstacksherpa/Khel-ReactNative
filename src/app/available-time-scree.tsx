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
import { showMessage } from 'react-native-flash-message';

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
  const { mutate: bookVenue, isPending: isBooking } = useBookVenue();

  const handleBook = (slot: (typeof slots)[number]) => {
    const start = new Date(slot.start_time);
    const end = new Date(slot.end_time);
    const timeRange = `${start.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })} - ${end.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' })}`;

    Alert.alert(
      'Confirm Booking Request',
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
                  // Show flash message
                  showMessage({
                    message: 'Booking Request Send!',
                    description:
                      'Your booking Request has been successfully send. Final booking decision is made by the venue owner',
                    type: 'success',
                    duration: 3000, // 3 seconds
                  });

                  // Delay navigation until after message is shown
                  setTimeout(() => {
                    router.back();
                  }, 3000);
                },
                onError: (err) => {
                  const status = err.response?.status;

                  if (status === 409) {
                    showMessage({
                      message: 'Conflict',
                      description: 'This time slot is already booked.',
                      type: 'danger',
                      icon: 'auto',
                      duration: 3000,
                    });
                  } else {
                    showMessage({
                      message: 'Error',
                      description:
                        'Failed to create booking. Please try again.',
                      type: 'danger',
                      icon: 'auto',
                      duration: 3000,
                    });
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
    <View className="flex-1 bg-white">
      <CustomHeader>
        <View style={{ paddingHorizontal: 12, paddingVertical: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 30 }}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </Pressable>

            <View className="flex-row items-center gap-2 self-center rounded-2xl pl-9">
              <Text className="text-xl font-bold text-white">
                Check Availability
              </Text>
              {isBooking && <ActivityIndicator size="large" color="white" />}
            </View>
          </View>
        </View>
      </CustomHeader>

      <View className="mb-20 flex bg-white pb-48">
        <View>
          <DateSelector
            dates={dates}
            selectedDate={selectedDate}
            onSelect={setSelectedDate}
          />
        </View>

        <View className="mx-6 mb-3 h-px bg-gray-300" />

        {isLoading ? (
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
    </View>
  );
}
