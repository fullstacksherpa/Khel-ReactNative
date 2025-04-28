import Ionicons from '@expo/vector-icons/Ionicons';
import { zodResolver } from '@hookform/resolvers/zod';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Image,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import CustomHeader from '@/components/custom-header';
import { ControlledInput } from '@/components/ui'; // your ControlledInput component

// Validation schema
const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(7, { message: 'Phone number is required' }),
});

type FormType = z.infer<typeof schema>;

// eslint-disable-next-line max-lines-per-function
export default function EditProfile() {
  const router = useRouter();

  const initialValues: FormType = {
    firstName: 'Ongcheb',
    lastName: 'Dccff',
    email: 'ongchen10sherpa@gmail.com',
    phone: '7788834225',
  };

  const [initialImageUri] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const { control, handleSubmit, getValues } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
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
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const submitEditProfile = () => {
    const data = getValues();
    const payload: Partial<FormType & { imageUri: string }> = {};

    // Compare form fields
    for (const key in initialValues) {
      const typedKey = key as keyof FormType;
      if (data[typedKey] !== initialValues[typedKey]) {
        payload[typedKey] = data[typedKey];
      }
    }

    // Compare image
    if (imageUri && imageUri !== initialImageUri) {
      payload.imageUri = imageUri;
    }

    console.log('submitEditProfile: Payload with changes only:', payload);

    router.back();
  };

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
        behavior="padding"
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
            <View>
              <ControlledInput
                control={control}
                label="First Name"
                name="firstName"
              />
            </View>

            <View className="py-3">
              <ControlledInput
                label="Last Name"
                control={control}
                name="lastName"
              />
            </View>

            <View className="mt-6 bg-gray-100 py-2">
              <Text className="text-center font-semibold text-gray-700">
                Contact Details
              </Text>
            </View>

            <View className="py-3">
              <ControlledInput
                control={control}
                name="email"
                label="Email"
                keyboardType="email-address"
              />
            </View>

            <View className="py-3">
              <ControlledInput
                label="Phone Number"
                control={control}
                name="phone"
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSubmit(submitEditProfile)}
          className="mx-9 mb-9 items-center rounded-lg bg-green-500 py-3"
        >
          <Text className="font-semibold text-white">SAVE</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </>
  );
}
