import AntDesign from '@expo/vector-icons/AntDesign';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
  Linking,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Button } from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';

// eslint-disable-next-line max-lines-per-function
const EmailVerificationScreen = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(40);
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

  const handleOpenGmail = () => {
    // Try to open Gmail app, fallback to browser if app not installed
    Linking.openURL('googlegmail://').catch(() => {
      Linking.openURL('https://mail.google.com/');
    });
  };

  const handleResendEmail = () => {
    if (isResendDisabled) return;

    // Reset the timer
    setCountdown(40);
    setIsResendDisabled(true);

    // Implement your resend email logic here
    console.log('Resend email clicked');
    // Call your API to resend verification email

    // Show success message (you might want to use a toast instead)
    alert('Verification email has been resent!');
  };

  return (
    <View className="flex-1 bg-green-500 p-1">
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
          <TouchableOpacity
            className="ml-4 rounded-bl-2xl rounded-tr-2xl bg-white p-3"
            onPress={() => {
              router.push('/register');
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
            source={require('../../assets/animation/login.json')}
          />
        </View>
        <View
          className="flex-col bg-white px-8 pb-80 pt-12"
          style={{ borderTopLeftRadius: 70, borderTopRightRadius: 70 }}
        >
          <Text className="mb-6 text-center text-3xl font-bold">
            Verify Your Email
          </Text>

          <Text className="mb-4 text-center text-xl leading-6">
            We've sent a verification link to your email address. Please check
            your inbox and click the link to verify your account.
          </Text>

          <Button
            className="mt-7 rounded-3xl bg-green-500"
            textClassName="text-2xl"
            label={'Open Gmail App'}
            trailingIcon={<ArrowRight stroke="white" width={24} height={24} />}
            onPress={handleOpenGmail}
          />
          <View className="mt-6 flex-row justify-center gap-2">
            <Text className="text-lg font-semibold text-gray-700">
              Didn't receive the email?
            </Text>
            {isResendDisabled ? (
              <Text className="text-lg font-bold text-gray-700 ">
                Resend in {countdown}s
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResendEmail}>
                <Text className="text-lg font-bold text-gray-700 ">
                  Resend Email
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default EmailVerificationScreen;
