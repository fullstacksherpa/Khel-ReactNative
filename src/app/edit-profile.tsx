import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native';
import * as z from 'zod';

import { useCurrentUser } from '@/api/auth/use-current-user';
import { useEditProfile } from '@/api/auth/use-edit-profile';
import CustomHeader from '@/components/custom-header';
import { ControlledInput } from '@/components/ui';

// Validation schema
const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  phone: z.string().min(7, { message: 'Phone number is required' }),
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced'], {
    required_error: 'Skill level is required',
  }),
});

type FormType = z.infer<typeof schema>;

// eslint-disable-next-line max-lines-per-function
export default function EditProfile() {
  const router = useRouter();
  const { data: user, isLoading: queryLoading, refetch } = useCurrentUser();
  const { mutate, isPending: mutationLoading } = useEditProfile();

  const [initialImageUri, setInitialImageUri] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const { control, handleSubmit, reset, getValues } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      skillLevel: 'beginner',
    },
  });

  // Populate form when user data arrives
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        skillLevel: user.skill_level,
      });
      setInitialImageUri(user.profile_picture_url);
      setImageUri(user.profile_picture_url);
    }
  }, [user, reset]);

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
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const submitEditProfile = () => {
    if (!user) return;
    const values = getValues();
    const payload: any = {};

    // Compare fields against fetched user
    if (values.firstName !== user.first_name)
      payload.first_name = values.firstName;
    if (values.lastName !== user.last_name) payload.last_name = values.lastName;
    if (values.phone !== user.phone) payload.phone = values.phone;
    if (values.skillLevel !== user.skill_level)
      payload.skill_level = values.skillLevel;

    if (imageUri && imageUri !== initialImageUri) {
      payload.imageUri = imageUri;
    }

    mutate(payload, {
      onSuccess: () => {
        refetch();
        router.back();
      },
    });
  };

  if (queryLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <CustomHeader>
        <View style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 80 }}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </Pressable>
            <Text className="text-2xl font-bold text-white">
              Edit Your Profile
            </Text>
          </View>
        </View>
      </CustomHeader>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}
      >
        <View className="flex-1 px-4">
          {/* Avatar */}
          <View className="my-6 items-center">
            <TouchableOpacity onPress={pickImage}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  className="size-24 rounded-full"
                />
              ) : (
                <View className="size-24 items-center justify-center rounded-full bg-gray-200">
                  <Text className="text-gray-500">Tap to add</Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage}>
              <Text className="mt-2 font-semibold text-yellow-600">
                Select profile image
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View className="space-y-4">
            <ControlledInput
              control={control}
              label="First Name"
              name="firstName"
            />
            <ControlledInput
              control={control}
              label="Last Name"
              name="lastName"
            />
            <ControlledInput
              control={control}
              label="Skill Level"
              name="skillLevel"
              placeholder="Select skill"
            />
            <View className="mt-6 bg-gray-100 py-2">
              <Text className="text-center font-semibold text-gray-700">
                Contact Details
              </Text>
            </View>

            <ControlledInput
              control={control}
              label="Phone Number"
              name="phone"
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSubmit(submitEditProfile)}
          disabled={mutationLoading}
          className="mx-9 mb-9 items-center rounded-lg bg-green-500 py-3"
        >
          {mutationLoading ? (
            <ActivityIndicator />
          ) : (
            <Text className="font-semibold text-white">SAVE</Text>
          )}
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </>
  );
}
