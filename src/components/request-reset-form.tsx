import AntDesign from '@expo/vector-icons/AntDesign';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, ControlledInput, Text } from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';

//
// Define a Zod schema for your form
//
const schema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email format'),
});

export type RequestResetFormType = z.infer<typeof schema>;

export type RequestResetFormProps = {
  onSubmit: SubmitHandler<RequestResetFormType>;
  isPending: boolean;
};

// eslint-disable-next-line max-lines-per-function
export const RequestResetForm = ({
  onSubmit,
  isPending,
}: RequestResetFormProps) => {
  const { control, handleSubmit } = useForm<RequestResetFormType>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();
  const [countdown, setCountdown] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendEmail = () => {
    if (isResendDisabled) return;

    // Reset the timer
    setCountdown(40);
    setIsResendDisabled(true);
  };

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
                router.push('/login');
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
                height: 200,
              }}
              source={require('../../assets/animation/football.json')}
            />
          </View>
          <View
            className="flex-col bg-white px-8 pb-80 pt-8"
            style={{ borderTopLeftRadius: 70, borderTopRightRadius: 70 }}
          >
            <View className="items-center justify-center pb-5">
              <Text
                testID="form-title"
                className="pb-6 text-center text-4xl font-bold"
              >
                Reset Password
              </Text>
            </View>

            <ControlledInput
              testID="email-input"
              control={control}
              name="email"
              placeholder="Enter your email"
              keyboardType="email-address"
            />

            <Button
              testID="request-reset-button"
              className="mt-6 rounded-3xl bg-green-500"
              textClassName="text-2xl"
              label={
                isPending
                  ? 'Requesting...'
                  : isResendDisabled
                    ? `Let's wait ${countdown}s`
                    : 'Request reset'
              }
              trailingIcon={
                !isPending && (
                  <ArrowRight stroke="white" width={24} height={24} />
                )
              }
              loading={isPending} // Pass the isPending value to show the loading spinner
              disabled={isPending || isResendDisabled} // Disable the button to prevent duplicate requests
              onPress={() => {
                handleResendEmail(); // Your custom logic
                handleSubmit(onSubmit)(); // Important: call it as a function!
              }}
            />
            <View className="mt-6 flex-row justify-center gap-2">
              <Text className="text-lg font-semibold text-gray-700">
                Didn't receive the email?
              </Text>
              {isResendDisabled ? (
                <Text className="text-lg  text-gray-700 ">
                  Retry after timer
                </Text>
              ) : (
                <TouchableOpacity>
                  <Text className="text-lg font-bold text-gray-700 ">
                    Request again
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
};
