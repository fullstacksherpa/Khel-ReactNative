import AntDesign from '@expo/vector-icons/AntDesign';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
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
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(4, 'Password must be at least 4 characters'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit: SubmitHandler<FormType>;
  isPending: boolean;
};

// eslint-disable-next-line max-lines-per-function
export const LoginForm = ({ onSubmit, isPending }: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 bg-green-500 p-1">
        <SafeAreaView className="flex">
          <View className="mb-8 flex-row justify-start">
            <TouchableOpacity
              className="ml-4 rounded-bl-2xl rounded-tr-2xl bg-white p-3"
              onPress={() => {
                router.push('/register');
              }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View className="flex-col bg-white p-8" style={{ borderRadius: 70 }}>
            <View className="items-center justify-center pb-5">
              <Text
                testID="form-title"
                className="pb-6 text-center text-4xl font-bold"
              >
                Sign In
              </Text>
            </View>

            <ControlledInput
              testID="email-input"
              control={control}
              name="email"
              label="Email"
            />

            <ControlledInput
              testID="password-input"
              control={control}
              name="password"
              label="Password"
              placeholder="***"
              secureTextEntry={true}
            />
            <TouchableOpacity
              className="mb-7 flex items-end"
              onPress={() => {
                router.push('/request-reset-password');
              }}
            >
              <Text className="text-gray-700 underline underline-offset-4">
                Forgot Password
              </Text>
            </TouchableOpacity>
            <Button
              testID="login-button"
              className="rounded-3xl bg-green-500"
              textClassName="text-2xl"
              label={isPending ? 'Logging in...' : 'Login'}
              trailingIcon={
                !isPending && (
                  <ArrowRight stroke="white" width={24} height={24} />
                )
              }
              loading={isPending}
              disabled={isPending}
              onPress={handleSubmit(onSubmit)}
            />
            <View className="mt-6 flex-row justify-center gap-2">
              <Text className="font-semibold text-gray-700">
                Don't have account ?
              </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text className="font-semibold text-green-800">Register</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="items-center pt-14">
            <Text className="text-6xl font-semibold italic text-white">
              Khel
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
};
