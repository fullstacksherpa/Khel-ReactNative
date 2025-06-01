import React, { useEffect, useState } from 'react';
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

  // Dirty flag
  const [isDirty, setIsDirty] = useState(false);

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
      setIsDirty(false); // reset dirty after load
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
    if (!isDirty) {
      Alert.alert(
        'No changes',
        'Please modify at least one field before updating.'
      );
      return;
    }

    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (address) updateData.address = address;
    if (phoneNumber) updateData.phone_number = phoneNumber;
    if (openTime) updateData.open_time = openTime;
    if (description) updateData.description = description;
    if (amenitiesInput) {
      updateData.amenities = amenitiesInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (lon && lat) {
      const lngNum = parseFloat(lon);
      const latNum = parseFloat(lat);
      if (!isNaN(lngNum) && !isNaN(latNum)) {
        updateData.location = [lngNum, latNum];
      }
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
            setIsDirty(true);
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
            setIsDirty(true);
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
            setIsDirty(true);
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
            setIsDirty(true);
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
            setIsDirty(true);
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
            setIsDirty(true);
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
              setIsDirty(true);
            }}
            placeholder="Longitude"
            keyboardType="numeric"
          />
          <TextInput
            className="flex-1 rounded border border-gray-300 p-2"
            value={lat}
            onChangeText={(v) => {
              setLat(v);
              setIsDirty(true);
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
