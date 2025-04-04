import AntDesign from '@expo/vector-icons/AntDesign';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { SafeAreaView, TouchableOpacity } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, ControlledInput, Text, View } from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  first_name: z.string({
    required_error: 'first name is required',
  }),
  last_name: z.string({
    required_error: 'last name is required',
  }),
  phone: z.string({
    required_error: 'phone number is required',
  }),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(4, 'Password must be at least 4 characters'),
});

export type FormType = z.infer<typeof schema>;

export type RegisterFormProps = {
  onSubmit: SubmitHandler<FormType>;
  isPending: boolean;
};
// eslint-disable-next-line max-lines-per-function
export const RegisterForm = ({ onSubmit, isPending }: RegisterFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();
  const animation = useRef<LottieView>(null);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 bg-green-500 p-1">
        <SafeAreaView className="flex">
          <View className="flex-row justify-start">
            <TouchableOpacity
              className="ml-4 rounded-bl-2xl rounded-tr-2xl bg-white p-3"
              onPress={() => {
                router.push('/onboarding');
              }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center">
            <LottieView
              autoPlay
              loop
              ref={animation}
              style={{
                width: '100%',
                height: 160,
              }}
              source={require('../../assets/animation/football.json')}
            />
          </View>
          <View
            className="flex-col bg-white px-8 pb-80 pt-12"
            style={{ borderTopLeftRadius: 70, borderTopRightRadius: 70 }}
          >
            <View className="mb-4">
              <ControlledInput
                testID="email-input"
                control={control}
                name="email"
                placeholder="Email"
              />
            </View>
            <View className="mb-4">
              <ControlledInput
                control={control}
                name="first_name"
                placeholder="First Name"
              />
            </View>
            <View className="mb-4">
              <ControlledInput
                control={control}
                name="last_name"
                placeholder="Last Name"
              />
            </View>
            <View className="mb-4">
              <ControlledInput
                control={control}
                name="phone"
                placeholder="Phone Number"
              />
            </View>
            <ControlledInput
              testID="password-input"
              control={control}
              name="password"
              placeholder="Enter you password"
            />
            <Button
              testID="login-button"
              className="mt-7 rounded-3xl bg-green-500"
              textClassName="text-2xl"
              label={isPending ? 'Registering...' : 'Register'}
              trailingIcon={
                !isPending && (
                  <ArrowRight stroke="white" width={24} height={24} />
                )
              }
              onPress={handleSubmit(onSubmit)}
              loading={isPending} // Pass the isPending value to show the loading spinner
              disabled={isPending} // Disable the button to prevent duplicate requests
            />
            <View className="mt-6 flex-row justify-center gap-2">
              <Text className="font-semibold text-gray-700">
                Already have an account ?
              </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="font-semibold text-green-800">Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
};
