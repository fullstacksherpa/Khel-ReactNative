import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as z from 'zod';

import {
  type CreateVenueVariables,
  useCreateVenue,
} from '@/api/owner-features/use-create-venue';
import CustomHeader from '@/components/custom-header';
import { ControlledInput } from '@/components/ui';

// ---------------------
// Zod Schema for Form
// ---------------------
const venueSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  address: z.string().min(1, 'Address is required').max(255),
  latitude: z.string().min(1, 'Latitude required'),
  longitude: z.string().min(1, 'Longitude required'),
  description: z.string().max(500).optional(),
  amenities: z.string().optional(), // comma-separated
  phone_number: z.string().min(10, 'Phone required').max(13),
  open_time: z.string().max(50).optional(),
  sport: z.string().min(1, 'Sport required').max(50),
});

type VenueFormType = z.infer<typeof venueSchema>;

// ---------------------
// Create Venue Screen
// ---------------------
// eslint-disable-next-line max-lines-per-function
export default function CreateVenueScreen() {
  const router = useRouter();
  const { mutate, isPending } = useCreateVenue();
  const [images, setImages] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<VenueFormType>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: '',
      address: '',
      latitude: '',
      longitude: '',
      description: '',
      amenities: '',
      phone_number: '',
      open_time: '',
      sport: '',
    },
  });

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Permission to access photos is required!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    if (images.length >= 7) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const onSubmit = () => {
    const values = getValues();
    const payload: any = {
      name: values.name,
      address: values.address,
      location: [parseFloat(values.longitude), parseFloat(values.latitude)],
      description: values.description || undefined,
      amenities: values.amenities
        ? values.amenities.split(',').map((a) => a.trim())
        : [],
      phone_number: values.phone_number,
      open_time: values.open_time || undefined,
      sport: values.sport,
    };

    const formData = new FormData() as CreateVenueVariables;
    formData.append('venue', JSON.stringify(payload));
    images.forEach((uri, idx) => {
      const name = uri.split('/').pop() || `image_${idx}.jpg`;
      formData.append('images', {
        uri,
        name,
        type: 'image/jpeg',
      } as any);
    });

    // DEBUG: log all FormData entries to console
    for (const [key, value] of formData.entries()) {
      console.log('FormData entry:', key, value);
    }

    mutate(formData, {
      onSuccess: () => {
        router.back();
      },
      onError: () => {
        alert('Failed to create venue.');
      },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader>
        <View className="flex-row items-center justify-between px-4 py-3">
          <Pressable onPress={() => router.back()}>
            <Text className="text-xl text-white">Back</Text>
          </Pressable>
          <Text className="text-xl font-bold text-white">Create Venue</Text>
          <View style={{ width: 50 }} />
        </View>
      </CustomHeader>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}
      >
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Image Picker */}
          <View className="flex-row flex-wrap">
            {images.map((uri, idx) => (
              <Image
                key={idx}
                source={{ uri }}
                className="m-1 size-24 rounded"
              />
            ))}
            {images.length < 7 && (
              <TouchableOpacity
                onPress={pickImage}
                className="m-1 size-24 items-center justify-center rounded bg-gray-200"
              >
                {isPending ? (
                  <ActivityIndicator />
                ) : (
                  <Text className="text-gray-500">Add</Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {/* Form Fields */}
          <View className="mt-4 space-y-4">
            <ControlledInput
              control={control}
              label="Name"
              name="name"
              error={errors.name?.message}
            />
            <ControlledInput
              control={control}
              label="Address"
              name="address"
              error={errors.address?.message}
            />
            <View className="flex-row gap-2 space-x-2">
              <ControlledInput
                control={control}
                label="Latitude"
                name="latitude"
                error={errors.latitude?.message}
                className="flex-1"
              />
              <ControlledInput
                control={control}
                label="Longitude"
                name="longitude"
                error={errors.longitude?.message}
                className="flex-1"
              />
            </View>
            <ControlledInput
              control={control}
              label="Description"
              name="description"
              error={errors.description?.message}
              multiline
            />
            <ControlledInput
              control={control}
              label="Amenities (comma separated)"
              name="amenities"
            />
            <ControlledInput
              control={control}
              label="Phone Number"
              name="phone_number"
              keyboardType="phone-pad"
              error={errors.phone_number?.message}
            />
            <ControlledInput
              control={control}
              label="Open Time"
              name="open_time"
            />
            <ControlledInput
              control={control}
              label="Sport"
              name="sport"
              error={errors.sport?.message}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            disabled={isPending}
            className="mt-6 items-center rounded-lg bg-blue-500 py-3"
          >
            {isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-semibold text-white">Create Venue</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}
