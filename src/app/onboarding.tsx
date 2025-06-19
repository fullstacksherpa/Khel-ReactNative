import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import React, { useRef } from 'react';
import { SafeAreaView } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { Button, Text, View } from '@/components/ui';
import { ArrowRight } from '@/components/ui/icons';
import { useIsFirstTime } from '@/lib/hooks';

// eslint-disable-next-line max-lines-per-function
export default function Onboarding() {
  const animation = useRef<LottieView>(null);
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex  items-center justify-center gap-4 bg-white p-1">
        <StatusBar style="dark" />
        <SafeAreaView className="flex">
          <View className="w-full">
            <View>
              <LottieView
                autoPlay
                loop
                ref={animation}
                style={{
                  width: 300,
                  height: 300,
                }}
                source={require('../../assets/animation/sport.json')}
              />
            </View>
          </View>

          <View
            className="flex-col bg-green-500 px-8 pb-80 pt-10"
            style={{ borderTopLeftRadius: 70, borderTopRightRadius: 70 }}
          >
            <Animated.View
              className="mb-5 w-full"
              entering={FadeInDown.duration(300).delay(200).springify()}
            >
              <Text className="text-center text-6xl font-bold leading-[3.5rem] tracking-widest text-green-700">
                Khel
              </Text>
            </Animated.View>

            <Animated.View
              className="mb-5 mt-3 w-full"
              entering={FadeInDown.duration(300).delay(400).springify()}
            >
              <Text className="text-center text-3xl font-medium leading-9 tracking-wider text-gray-800">
                Book a venue, create or join a game, and connect with players
                who vibe like you — all in one spot.
              </Text>
            </Animated.View>
            <Animated.View
              className="mt-10 w-full items-center justify-center"
              entering={FadeInDown.duration(300).delay(600).springify()}
            >
              <Button
                label="Let's Get Started "
                className=" w-3/4 items-center justify-center rounded-3xl bg-green-900 py-3"
                textClassName="text-2xl"
                trailingIcon={
                  <ArrowRight stroke="white" width={24} height={24} />
                }
                onPress={() => {
                  setIsFirstTime(false);
                  router.push('/register');
                }}
              />
            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
}
