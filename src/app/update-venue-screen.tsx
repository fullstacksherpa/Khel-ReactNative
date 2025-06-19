import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { useUpdateVenue } from '@/api/owner-features/use-update-venue';
import { useVenueInfo } from '@/api/owner-features/use-venue-info';

type Props = {
  venueID: number | string;
  setOption: React.Dispatch<
    React.SetStateAction<'Home' | 'Update Venue' | 'Update Images' | 'Pricing'>
  >;
};

// eslint-disable-next-line max-lines-per-function
export default function UpdateVenueScreen({ venueID, setOption }: Props) {
  // Fetch current venue data
  const {
    data: venueInfoResp,
    isLoading: loadingInfo,
    error: infoError,
  } = useVenueInfo({ variables: { venueID } });

  // Form state
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [description, setDescription] = useState('');
  const [amenitiesInput, setAmenitiesInput] = useState('');
  const [lon, setLon] = useState('');
  const [lat, setLat] = useState('');

  // Keep a ref to the original values so we can diff against them
  const original = useRef<{
    name: string;
    address: string;
    phone_number: string;
    open_time: string;
    description: string;
    amenities: string[];
    location: [number, number];
  } | null>(null);

  // Populate form with fetched data
  useEffect(() => {
    if (venueInfoResp?.data) {
      const v = venueInfoResp.data;
      setName(v.name);
      setAddress(v.address);
      setPhoneNumber(v.phone_number);
      setOpenTime(v.open_time);
      setDescription(v.description);
      setAmenitiesInput(v.amenities.join(', '));
      setLon(String(v.location[0]));
      setLat(String(v.location[1]));

      // Store originals
      original.current = {
        name: v.name,
        address: v.address,
        phone_number: v.phone_number,
        open_time: v.open_time,
        description: v.description,
        amenities: v.amenities,
        location: [v.location[0], v.location[1]],
      };
    }
  }, [venueInfoResp]);

  // Mutation hook
  const { mutateAsync, isPending } = useUpdateVenue({
    onSuccess: () => {
      Alert.alert('Success', 'Venue updated successfully');
      setOption('Home');
    },
    onError: (error) => {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update');
    },
  });

  // Submit handler
  const handleSubmit = async () => {
    if (!original.current) return;

    const updateData: Record<string, any> = {};
    // Compare each field to the original; only include if different:
    if (name !== original.current.name) updateData.name = name;
    if (address !== original.current.address) updateData.address = address;
    if (phoneNumber !== original.current.phone_number)
      updateData.phone_number = phoneNumber;
    if (openTime !== original.current.open_time)
      updateData.open_time = openTime;
    if (description !== original.current.description)
      updateData.description = description;

    // Amenities: compare comma‑joined strings
    const originalAmenitiesString = original.current.amenities.join(', ');
    if (amenitiesInput !== originalAmenitiesString) {
      // transform back to array
      updateData.amenities = amenitiesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Location: parse and compare numbers
    const lngNum = parseFloat(lon);
    const latNum = parseFloat(lat);
    if (
      !isNaN(lngNum) &&
      !isNaN(latNum) &&
      (lngNum !== original.current.location[0] ||
        latNum !== original.current.location[1])
    ) {
      updateData.location = [lngNum, latNum];
    }

    if (Object.keys(updateData).length === 0) {
      Alert.alert(
        'No changes',
        'Please modify at least one field before updating.'
      );
      return;
    }
    await mutateAsync({ venueID, updateData });
  };

  // Show loader / error for initial fetch
  if (loadingInfo) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }
  if (infoError) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <Text className="text-red-500">
          Failed to load venue info: {infoError.message}
        </Text>
      </View>
    );
  }

  // Render form
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
        <Text className="mb-4 self-center text-2xl font-bold text-gray-700">
          Update Venue
        </Text>

        {/** Name **/}
        <Text className="mb-1 text-lg font-semibold text-gray-700">Name</Text>
        <TextInput
          className="mb-3 rounded border border-gray-300 p-2"
          value={name}
          onChangeText={(v) => {
            setName(v);
          }}
          placeholder="Venue Name"
        />

        {/** Address **/}
        <Text className="mb-1 text-lg font-semibold text-gray-700">
          Address
        </Text>
        <TextInput
          className="mb-3 rounded border border-gray-300 p-2"
          value={address}
          onChangeText={(v) => {
            setAddress(v);
          }}
          placeholder="Venue Address"
        />

        {/** Phone Number **/}
        <Text className="mb-1 text-lg font-semibold text-gray-700">
          Phone Number
        </Text>
        <TextInput
          className="mb-3 rounded border border-gray-300 p-2"
          value={phoneNumber}
          onChangeText={(v) => {
            setPhoneNumber(v);
          }}
          placeholder="Phone Number"
          keyboardType="phone-pad"
        />

        {/** Open Time **/}
        <Text className="mb-1 text-lg font-semibold text-gray-700">
          Open Time
        </Text>
        <TextInput
          className="mb-3 rounded border border-gray-300 p-2"
          value={openTime}
          onChangeText={(v) => {
            setOpenTime(v);
          }}
          placeholder="Operating Hours (e.g. 9am - 9pm)"
        />

        {/** Description **/}
        <Text className="mb-1 text-lg font-semibold text-gray-700">
          Description
        </Text>
        <TextInput
          className="mb-3 rounded border border-gray-300 p-2"
          value={description}
          onChangeText={(v) => {
            setDescription(v);
          }}
          placeholder="Venue Description"
          multiline
        />

        {/** Amenities **/}
        <Text className="mb-1 text-lg font-semibold text-gray-700">
          Amenities
        </Text>
        <TextInput
          className="mb-3 rounded border border-gray-300 p-2"
          value={amenitiesInput}
          onChangeText={(v) => {
            setAmenitiesInput(v);
          }}
          placeholder="Comma-separated amenities"
        />

        {/** Location **/}
        <Text className="mb-1 text-lg font-semibold text-gray-700">
          Location
        </Text>
        <View className="mb-6 flex-row space-x-2">
          <TextInput
            className="flex-1 rounded border border-gray-300 p-2"
            value={lon}
            onChangeText={(v) => {
              setLon(v);
            }}
            placeholder="Longitude"
            keyboardType="numeric"
          />
          <TextInput
            className="flex-1 rounded border border-gray-300 p-2"
            value={lat}
            onChangeText={(v) => {
              setLat(v);
            }}
            placeholder="Latitude"
            keyboardType="numeric"
          />
        </View>

        {/** Submit Button **/}
        <TouchableOpacity
          className="mb-4 items-center rounded-3xl bg-[#1dbf22] p-2"
          onPress={handleSubmit}
          disabled={isPending}
        >
          <Text className="text-lg font-semibold text-white">
            {isPending ? 'Updating...' : 'Update Venue'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
