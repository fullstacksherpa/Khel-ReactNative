import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { useUpdateVenue } from '@/api/owner-features/use-update-venue';

type Props = {
  venueID: number | string;
  setOption: React.Dispatch<
    React.SetStateAction<
      'Home' | 'Update Venue' | 'Update Images' | 'Pricing' | 'Set Offer'
    >
  >;
};

// eslint-disable-next-line max-lines-per-function
export default function UpdateVenueScreen({ venueID, setOption }: Props) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [description, setDescription] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('');
  const [lon, setLon] = useState('');
  const [lat, setLat] = useState('');

  const { mutateAsync, isPending } = useUpdateVenue({
    onSuccess: () => {
      Alert.alert('Success', 'Venue updated successfully');
      setOption('Home');
    },
    onError: (error) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update');
    },
  });

  const handleSubmit = async () => {
    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (phoneNumber) updateData.phone_number = phoneNumber;
    if (openTime) updateData.open_time = openTime;
    if (description) updateData.description = description;
    if (amenitiesInput) {
      const amenitiesArr = amenitiesInput
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      updateData.amenities = amenitiesArr;
    }
    if (lon && lat) {
      const lng = parseFloat(lon);
      const latNum = parseFloat(lat);
      if (!isNaN(lng) && !isNaN(latNum)) {
        updateData.location = [lng, latNum];
      }
    }

    if (Object.keys(updateData).length === 0) {
      Alert.alert('No changes', 'Please enter at least one field.');
      return;
    }

    await mutateAsync({ venueID, updateData });
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <ScrollView
        className="flex-1 bg-white p-4"
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-4 self-center text-2xl font-bold tracking-widest text-gray-700">
          Update Venue
        </Text>

        {/* Name */}
        <Text className="mb-1 text-lg font-semibold tracking-widest text-gray-700">
          Name
        </Text>
        <TextInput
          className="mb-3 rounded border border-gray-300 p-2"
          value={name}
          onChangeText={setName}
          placeholder="Venue Name"
        />

        {/* Address */}
        <Text className="mb-1 text-lg font-semibold tracking-widest text-gray-700">
          Address
        </Text>
        <TextInput
          className="mb-3 rounded border border-gray-300 p-2"
          value={address}
          onChangeText={setAddress}
          placeholder="Venue Address"
        />

        {/* Phone Number */}
        <Text className="mb-1 text-lg font-semibold tracking-widest text-gray-700">
          Phone Number
        </Text>
        <TextInput
          className="mb-3 rounded border border-gray-300 p-2"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />

        {/* Open Time */}
        <Text className="mb-1 text-lg font-semibold tracking-widest text-gray-700">
          Open Time
        </Text>
        <TextInput
          className="mb-3 rounded border border-gray-300 p-2"
          value={openTime}
          onChangeText={setOpenTime}
          placeholder="Operating Hours (e.g. 9am - 9pm)"
        />

        {/* Description */}
        <Text className="mb-1 text-lg font-semibold tracking-widest text-gray-700">
          Description
        </Text>
        <TextInput
          className="mb-3 rounded border border-gray-300 p-2"
          value={description}
          onChangeText={setDescription}
          placeholder="Venue Description"
          multiline
        />

        {/* Amenities */}
        <Text className="mb-1 text-lg font-semibold tracking-widest text-gray-700">
          Amenities
        </Text>
        <TextInput
          className="mb-3 rounded border border-gray-300 p-2"
          value={amenitiesInput}
          onChangeText={setAmenitiesInput}
          placeholder="Comma-separated amenities"
        />

        {/* Location */}
        <Text className="mb-1 text-lg font-semibold tracking-widest text-gray-700">
          Location
        </Text>
        <View className="mb-6 flex-row space-x-2">
          <TextInput
            className="flex-1 rounded border border-gray-300 p-2"
            value={lon}
            onChangeText={setLon}
            placeholder="Longitude"
            keyboardType="numeric"
          />
          <TextInput
            className="flex-1 rounded border border-gray-300 p-2"
            value={lat}
            onChangeText={setLat}
            placeholder="Latitude"
            keyboardType="numeric"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className=" mb-4 items-center rounded-3xl bg-['#1dbf22'] p-2"
          onPress={handleSubmit}
          disabled={isPending}
        >
          <Text className="text-lg font-semibold tracking-widest text-white">
            {isPending ? 'Updating...' : 'Update Venue'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
