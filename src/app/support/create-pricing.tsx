import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';

import { useCreateVenuePricing } from '@/api/owner-features/use-create-pricing';
import { PricingSlotItem } from '@/components/venue-owner/pricing-slot-item';
import { useVenueStore } from '@/lib/store/venue';

type PricingSlotInput = {
  day_of_week: string;
  start_time: string;
  end_time: string;
  price: string;
};

// eslint-disable-next-line max-lines-per-function
export default function CreateVenuePricingScreen() {
  const venueID = useVenueStore((state) => state.lastCreatedVenueID);
  const router = useRouter();

  // Local state: array of slots (all fields as strings for user input)
  const [slots, setSlots] = useState<PricingSlotInput[]>([
    { day_of_week: '', start_time: '', end_time: '', price: '' },
  ]);

  // React Query mutation
  const { mutateAsync, isPending } = useCreateVenuePricing();

  // Handler: update one slot
  const handleSlotChange = (idx: number, newSlot: PricingSlotInput) => {
    setSlots((prev) => {
      const copy = [...prev];
      copy[idx] = newSlot;
      return copy;
    });
  };

  // Handler: remove one slot
  const handleSlotRemove = (idx: number) => {
    setSlots((prev) => prev.filter((_, i) => i !== idx));
  };

  // Handler: add new blank slot
  const handleAddSlot = () => {
    setSlots((prev) => [
      ...prev,
      { day_of_week: '', start_time: '', end_time: '', price: '' },
    ]);
  };

  // Handler: submit all slots
  const handleSubmit = async () => {
    // 1) Basic client‐side validation
    if (!venueID) {
      Alert.alert('Error', 'Missing venue ID in route.');
      return;
    }

    // 2) Ensure all fields are filled, parse price → number
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      if (!s.day_of_week || !s.start_time || !s.end_time || !s.price) {
        Alert.alert(
          'Validation',
          `All fields are required for slot #${i + 1}.`
        );
        return;
      }
      // Check price is a positive integer
      const numPrice = parseInt(s.price, 10);
      if (isNaN(numPrice) || numPrice <= 0) {
        Alert.alert(
          'Validation',
          `Price must be a positive number at slot #${i + 1}.`
        );
        return;
      }
      // Optional: validate time format matches HH:MM:SS
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
      if (!timeRegex.test(s.start_time) || !timeRegex.test(s.end_time)) {
        Alert.alert(
          'Validation',
          `Time format must be HH:MM:SS at slot #${i + 1}.`
        );
        return;
      }
      // Ensure start < end
      if (s.start_time >= s.end_time) {
        Alert.alert(
          'Validation',
          `Start time must be before end time at slot #${i + 1}.`
        );
        return;
      }
    }

    // 3) Build payload: convert price to number
    const payloadSlots = slots.map((s) => ({
      day_of_week: s.day_of_week.trim().toLowerCase(),
      start_time: s.start_time,
      end_time: s.end_time,
      price: parseInt(s.price, 10),
    }));

    try {
      await mutateAsync({
        venueID: typeof venueID === 'string' ? parseInt(venueID, 10) : venueID,
        slots: payloadSlots,
      });
      Alert.alert('Success', 'Pricing slots created successfully.');
      // Optionally navigate back or to a “details” screen:
      router.back();
    } catch (e: any) {
      console.error(e);
      Alert.alert('Error', e.message || 'Failed to create pricing slots.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="mb-4 text-center text-2xl font-bold">
        Create Venue Pricing
      </Text>

      {slots.map((slot, idx) => (
        <PricingSlotItem
          key={idx}
          index={idx}
          slot={slot}
          onChange={handleSlotChange}
          onRemove={handleSlotRemove}
        />
      ))}

      {/* Add‐slot button */}
      <TouchableOpacity
        onPress={handleAddSlot}
        className="mb-6 flex-row items-center justify-center rounded-md bg-green-500 py-3"
      >
        <Text className="text-lg font-semibold text-white">
          + Add Another Slot
        </Text>
      </TouchableOpacity>

      {/* Submit button */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="items-center rounded-md bg-blue-600 py-4"
        disabled={isPending}
      >
        {isPending ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text className="text-lg font-semibold text-white">
            Submit All Slots
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
