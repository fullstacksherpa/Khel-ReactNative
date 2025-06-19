import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';

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
  // eslint-disable-next-line max-lines-per-function
  const handleSubmit = async () => {
    // 1) Basic client‐side validation
    if (!venueID) {
      showMessage({
        message: 'Missing venue ID in route.',
        type: 'danger',
        duration: 3000,
      });
      return;
    }

    // 2) Ensure all fields are filled, parse price → number
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      if (!s.day_of_week || !s.start_time || !s.end_time || !s.price) {
        showMessage({
          message: `Slot #${i + 1} is incomplete.`,
          description: 'Please fill all fields before submitting.',
          type: 'danger',
          icon: 'auto',
          duration: 3000,
        });
        return;
      }
      // Check price is a positive integer
      const numPrice = parseInt(s.price, 10);
      if (isNaN(numPrice) || numPrice <= 0) {
        showMessage({
          message: `Invalid price at slot #${i + 1}`,
          description: 'Price must be a positive number.',
          type: 'danger',
          duration: 3000,
        });
        return;
      }
      // Optional: validate time format matches HH:MM:SS
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
      if (!timeRegex.test(s.start_time) || !timeRegex.test(s.end_time)) {
        showMessage({
          message: `Invalid time format at slot #${i + 1}`,
          description: 'Time must be in HH:MM:SS format.',
          type: 'danger',
          duration: 3000,
        });
        return;
      }
      // Ensure start < end
      if (s.start_time >= s.end_time) {
        showMessage({
          message: `Invalid time range at slot #${i + 1}`,
          description: 'Start time must be before end time.',
          type: 'danger',
          duration: 3000,
        });
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
      showMessage({
        message: 'Success',
        description: 'Pricing slots created successfully.',
        type: 'success',
        duration: 3000,
      });

      router.push('/');
    } catch (e: any) {
      console.error(e);
      showMessage({
        message: 'Error',
        description: e.message || 'Failed to create pricing slots.',
        type: 'danger',
        duration: 3000,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={10}
    >
      <ScrollView className="flex-1 bg-gray-100 p-4">
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
          className="mb-28 items-center rounded-md bg-blue-600 py-4"
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
    </KeyboardAvoidingView>
  );
}
