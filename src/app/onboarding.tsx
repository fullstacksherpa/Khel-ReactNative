import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOut,
  SlideInUp,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import EventCard from '@/components/welcome/event-card';
import Marquee from '@/components/welcome/marquee';
import { useIsFirstTime } from '@/lib/hooks';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const events = [
  {
    id: 1,
    image: require('./../../assets/images/1.jpg'),
    text: 'Join any available game instantly',
  },
  {
    id: 2,
    image: require('./../../assets/images/2.jpg'),
    text: 'Host your own game and invite players',
  },
  {
    id: 3,
    image: require('./../../assets/images/3.jpg'),
    text: 'Book sports venues with ease',
  },
  {
    id: 4,
    image: require('./../../assets/images/4.jpg'),
    text: 'Explore and join upcoming games',
  },
  {
    id: 5,
    image: require('./../../assets/images/5.jpg'),
    text: 'Chat directly with venue staff',
  },
  {
    id: 6,
    image: require('./../../assets/images/6.jpg'),
    text: 'Rate and review venues for others',
  },
  {
    id: 7,
    image: require('./../../assets/images/7.jpg'),
    text: 'Find venues easily with map view',
  },
  {
    id: 8,
    image: require('./../../assets/images/8.jpg'),
    text: 'See who’s playing in your game',
  },
];

// eslint-disable-next-line max-lines-per-function
export default function WelcomeScreen() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);

  const onButtonPress = () => {
    setIsFirstTime(false);
    router.replace('/login');
  };

  return (
    <View className="flex-1 bg-yellow-950 ">
      <Animated.Image
        key={events[activeIndex].image}
        source={events[activeIndex].image}
        className="absolute left-0 top-0 size-full"
        resizeMode="cover"
        entering={FadeIn.duration(1000)}
        exiting={FadeOut.duration(1000)}
      />

      <View className="absolute left-0 top-0 size-full bg-black/70" />

      <BlurView intensity={70} className="flex-1">
        {/* This is a quick fix of the SlideInUp bug not taking safe area padding in consideration */}
        <SafeAreaView edges={['bottom']} className="flex-1">
          {/* Top part of the screen */}
          <Animated.View
            className="mt-20 h-1/2 w-full"
            entering={SlideInUp.springify().mass(1).damping(30)}
          >
            <Marquee
              items={events}
              renderItem={({ item }) => <EventCard event={item} />}
              onIndexChange={setActiveIndex}
            />
          </Animated.View>

          <View className="flex-1 justify-center gap-4  p-4">
            <Animated.Text
              className="text-center text-2xl font-bold text-white/60"
              entering={FadeInUp.springify().mass(1).damping(30).delay(500)}
            >
              Welcome to
            </Animated.Text>
            <Animated.Text
              className="text-center text-5xl font-bold tracking-widest text-green-700"
              entering={FadeIn.duration(500).delay(500)}
            >
              Khel
            </Animated.Text>
            <Animated.Text
              className="mb-5 text-center text-lg text-white/60"
              entering={FadeInUp.springify().mass(1).damping(30).delay(500)}
            >
              Find and join games, book venues, and connect with players—all in
              one place.{' '}
            </Animated.Text>

            <AnimatedPressable
              onPress={onButtonPress}
              className="items-center self-center rounded-full bg-white px-10 py-4"
              entering={FadeInUp.springify().mass(1).damping(30).delay(500)}
            >
              <Text className="text-lg">Start Playing</Text>
            </AnimatedPressable>
          </View>
        </SafeAreaView>
      </BlurView>
    </View>
  );
}
