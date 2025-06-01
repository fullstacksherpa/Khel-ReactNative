import { Picker } from '@react-native-picker/picker';
import { XCircle } from 'lucide-react-native';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

type PricingSlotInput = {
  day_of_week: string;
  start_time: string;
  end_time: string;
  price: string; // keep price as string here, parse to number later
};

type Props = {
  index: number;
  slot: PricingSlotInput;
  onChange: (index: number, newSlot: PricingSlotInput) => void;
  onRemove: (index: number) => void;
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

export const PricingSlotItem: React.FC<Props> = ({
  index,
  slot,
  onChange,
  onRemove,
}) => {
  return (
    <View className="mb-4 rounded-lg border border-gray-300 bg-white p-4">
      {/* Header with index and remove button */}
      <View className="mb-2 flex-row items-center justify-between">
        <Text className="text-lg font-semibold">Slot #{index + 1}</Text>
        <TouchableOpacity onPress={() => onRemove(index)}>
          <XCircle size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Day of Week Picker */}
      <Text className="mb-1 text-sm font-medium">Day of Week</Text>
      <View className="mb-3 rounded-md border border-gray-300">
        <Picker
          selectedValue={slot.day_of_week}
          onValueChange={(val) =>
            onChange(index, { ...slot, day_of_week: val })
          }
          className="h-10"
        >
          <Picker.Item label="Select day" value="" />
          {weekdays.map((day) => (
            <Picker.Item
              key={day}
              label={day.charAt(0).toUpperCase() + day.slice(1)}
              value={day}
            />
          ))}
        </Picker>
      </View>

      {/* Start Time */}
      <Text className="mb-1 text-sm font-medium">Start Time (HH:MM:SS)</Text>
      <TextInput
        value={slot.start_time}
        placeholder="e.g. 06:00:00"
        onChangeText={(text) => onChange(index, { ...slot, start_time: text })}
        className="mb-3 rounded-md border border-gray-300 px-3 py-2"
      />

      {/* End Time */}
      <Text className="mb-1 text-sm font-medium">End Time (HH:MM:SS)</Text>
      <TextInput
        value={slot.end_time}
        placeholder="e.g. 12:00:00"
        onChangeText={(text) => onChange(index, { ...slot, end_time: text })}
        className="mb-3 rounded-md border border-gray-300 px-3 py-2"
      />

      {/* Price */}
      <Text className="mb-1 text-sm font-medium">Price (integer)</Text>
      <TextInput
        value={slot.price}
        placeholder="e.g. 1800"
        keyboardType="numeric"
        onChangeText={(text) => onChange(index, { ...slot, price: text })}
        className="mb-1 rounded-md border border-gray-300 px-3 py-2"
      />
      <Text className="text-xs text-gray-500">
        Price must be a positive integer.
      </Text>
    </View>
  );
};
