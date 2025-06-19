import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { useUpdateVenuePricing } from '@/api/owner-features/update-venue-pricing';
import { useVenuePricing } from '@/api/owner-features/use-venue-pricing';

type EditableSlot = {
  id: number;
  start_time: string;
  end_time: string;
  price: string;
};

const weekdays = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];

type Props = {
  venueID: string | number;
};

//This screen is for venue owner to modify their venue pricing

// eslint-disable-next-line max-lines-per-function
export default function VenuePricingScreen({ venueID }: Props) {
  // 1) Initialize selectedDay immediately so hook can fire on first render
  const getTodaysDay = () =>
    new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const [selectedDay, setSelectedDay] = useState<string>(getTodaysDay());

  // 2) Local state for editable slots
  const [editableSlots, setEditableSlots] = useState<EditableSlot[]>([]);

  // 3) Fetch the pricing for this venue & day
  const {
    data: pricingResponse,
    isLoading,
    error,
    refetch,
  } = useVenuePricing({ variables: { venueID, day: selectedDay } });

  // 4) Map from Pascal-case + ISO → lower-case + "HH:MM:SS"
  useEffect(() => {
    if (pricingResponse?.data && Array.isArray(pricingResponse.data)) {
      const mapped: EditableSlot[] = pricingResponse.data.map((slot: any) => {
        const startISO: string = slot.StartTime || '';
        const endISO: string = slot.EndTime || '';

        const startTimeOnly =
          startISO.length >= 19 ? startISO.slice(11, 19) : '';
        const endTimeOnly = endISO.length >= 19 ? endISO.slice(11, 19) : '';

        const priceNum = typeof slot.Price === 'number' ? slot.Price : 0;

        return {
          id: slot.ID,
          start_time: startTimeOnly,
          end_time: endTimeOnly,
          price: priceNum.toString(),
        };
      });
      setEditableSlots(mapped);
    } else {
      setEditableSlots([]);
    }
  }, [pricingResponse]);

  // 5) Slot editing handler
  const onChangeSlot = (
    idx: number,
    field: keyof EditableSlot,
    value: string
  ) => {
    setEditableSlots((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  // 6) Import the update hook
  const { mutateAsync: updateSlot, isPending: isUpdating } =
    useUpdateVenuePricing();

  // 7) Save Changes: loop through editableSlots and send PUTs
  // eslint-disable-next-line max-lines-per-function
  const handleSaveChanges = async () => {
    if (editableSlots.length === 0) {
      Alert.alert('No slots to save.');
      return;
    }

    // Basic validation before submitting:
    for (let i = 0; i < editableSlots.length; i++) {
      const { start_time, end_time, price } = editableSlots[i];
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
      if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
        showMessage({
          message: `Invalid time format at slot #${i + 1}`,
          description: 'Time must be in HH:MM:SS format.',
          type: 'danger',
          duration: 3000,
        });
        return;
      }
      if (start_time >= end_time) {
        showMessage({
          message: `Invalid time range at slot #${i + 1}`,
          description: 'Start time must be before end time.',
          type: 'danger',
          duration: 3000,
        });
        return;
      }
      const numPrice = parseInt(price, 10);
      if (isNaN(numPrice) || numPrice <= 0) {
        showMessage({
          message: `Invalid price at slot #${i + 1}`,
          description: 'Price must be a positive number.',
          type: 'danger',
          duration: 3000,
        });
        return;
      }
    }

    // Build an array of update promises
    try {
      await Promise.all(
        editableSlots.map((slot) => {
          // Prepare payload shape { day_of_week, start_time, end_time, price }
          const payload = {
            day_of_week: selectedDay,
            start_time: slot.start_time,
            end_time: slot.end_time,
            price: parseInt(slot.price, 10),
          };
          return updateSlot({
            venueID,
            pricingID: slot.id,
            payload,
          });
        })
      );
      showMessage({
        message: 'Success',
        description: 'Pricing slots updated successfully.',
        type: 'success',
        duration: 3000,
      });
      refetch();
    } catch (err: any) {
      showMessage({
        message: 'Error',
        description: err.message || 'Failed to Update pricing slots.',
        type: 'danger',
        duration: 3000,
      });
    }
  };

  // 8) Error / Loading UI
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100 px-4">
        <Text className="mb-2 text-red-600">Error fetching pricing:</Text>
        <Text className="text-gray-700">{error.message}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Day Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: 'row', flexWrap: 'nowrap' }}
        className="flex-none border-b border-gray-300 bg-white py-2"
      >
        {weekdays.map((day) => {
          const isSelected = day === selectedDay;
          return (
            <TouchableOpacity
              key={day}
              onPress={() => {
                if (isUpdating) return; // lock while updates are in flight
                setSelectedDay(day);
                refetch();
              }}
              disabled={isUpdating}
              className={`
                mx-2 
                flex-none 
                rounded-full 
                px-4 
                py-1 
                ${isSelected ? 'bg-blue-600' : 'bg-gray-200'} 
                ${isUpdating ? 'opacity-50' : 'opacity-100'}
              `}
            >
              <Text
                className={`${isSelected ? 'text-white' : 'text-gray-700'} font-semibold`}
              >
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Slot List or Loading */}
      {isLoading ? (
        <View className="flex-1 items-center justify-center gap-2">
          <ActivityIndicator size="large" color="#22c55e" />
          <Text className="tracking-widest">Fetching fresh data…</Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {editableSlots.length === 0 ? (
            <Text className="mt-8 text-center text-gray-500">
              No pricing slots found for{' '}
              {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}.
            </Text>
          ) : (
            editableSlots.map((slot, idx) => (
              <View
                key={slot.id}
                className="mb-4 rounded-lg bg-white p-4 shadow-sm"
              >
                <Text className="mb-2 font-semibold">Slot #{idx + 1}</Text>

                {/* Start Time */}
                <Text className="mb-1 text-sm text-gray-700">
                  Start Time (HH:MM:SS)
                </Text>
                <TextInput
                  value={slot.start_time}
                  onChangeText={(txt) => onChangeSlot(idx, 'start_time', txt)}
                  placeholder="06:00:00"
                  className="mb-3 rounded-md border border-gray-300 px-3 py-2"
                />

                {/* End Time */}
                <Text className="mb-1 text-sm text-gray-700">
                  End Time (HH:MM:SS)
                </Text>
                <TextInput
                  value={slot.end_time}
                  onChangeText={(txt) => onChangeSlot(idx, 'end_time', txt)}
                  placeholder="12:00:00"
                  className="mb-3 rounded-md border border-gray-300 px-3 py-2"
                />

                {/* Price */}
                <Text className="mb-1 text-sm text-gray-700">Price</Text>
                <TextInput
                  value={slot.price}
                  onChangeText={(txt) => onChangeSlot(idx, 'price', txt)}
                  placeholder="1800"
                  keyboardType="numeric"
                  className="mb-1 rounded-md border border-gray-300 px-3 py-2"
                />
                <Text className="text-xs text-gray-500">
                  Enter a number only (e.g. 1800)
                </Text>
              </View>
            ))
          )}

          {/* Save Changes Button */}
          <TouchableOpacity
            onPress={handleSaveChanges}
            disabled={isUpdating}
            className={`
              mb-6 
              mt-8 
              items-center 
              rounded-md 
              ${isUpdating ? 'bg-gray-400' : 'bg-green-600'} 
              py-4
            `}
          >
            {isUpdating ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className="text-lg font-semibold text-white">
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}
