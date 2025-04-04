import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import {
  Button,
  ControlledInput,
  Text,
  TouchableOpacity,
  View,
} from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';

// Define the validation schema with two password fields.
const schema = z
  .object({
    password: z
      .string({ required_error: 'Password is required' })
      .min(4, 'Password must be at least 4 characters'),
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'], // attach error to confirmPassword field
  });

export type ResetPasswordFormType = z.infer<typeof schema>;

export type ResetPasswordFormProps = {
  onSubmit: SubmitHandler<ResetPasswordFormType>;
  isPending: boolean;
};

// eslint-disable-next-line max-lines-per-function
export const ResetPasswordForm = ({
  onSubmit,
  isPending,
}: ResetPasswordFormProps) => {
  const { handleSubmit, control } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(schema),
  });
  const animation = useRef<LottieView>(null);
  const router = useRouter();

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1  bg-green-500 p-1">
        <View className="flex pt-32">
          <View className="flex-row justify-center">
            <LottieView
              autoPlay
              loop
              ref={animation}
              style={{ width: '100%', height: 200 }}
              source={require('../../assets/animation/football.json')}
            />
          </View>
          <View
            className="flex-col bg-white px-8 pb-20 pt-12"
            style={{
              borderTopLeftRadius: 70,
              borderTopRightRadius: 70,
              borderBottomLeftRadius: 70,
              borderBottomRightRadius: 70,
            }}
          >
            <View className="mb-6">
              <Text
                testID="form-title"
                className="text-center text-4xl font-bold"
              >
                Reset Password
              </Text>
            </View>
            <ControlledInput
              testID="password-input"
              control={control}
              name="password"
              placeholder="Enter new password"
              secureTextEntry={true}
            />
            <ControlledInput
              testID="confirm-password-input"
              control={control}
              name="confirmPassword"
              placeholder="Confirm new password"
              secureTextEntry={true}
            />
            <Button
              testID="reset-password-button"
              className="mt-7 rounded-3xl bg-green-500"
              textClassName="text-2xl"
              label={isPending ? 'Resetting...' : 'Reset Password'}
              trailingIcon={
                !isPending && (
                  <ArrowRight stroke="white" width={24} height={24} />
                )
              }
              onPress={handleSubmit(onSubmit)}
              loading={isPending}
              // Button is not disabled, even if isPending is true.
            />
            <View className="mt-6 flex-row justify-center gap-2">
              <Text className="font-semibold text-gray-700">
                remember your password ?
              </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text className="font-semibold text-green-800">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
