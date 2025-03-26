import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function EventCard({ event }: { event: any }) {
  return (
    <View className="size-full justify-end overflow-hidden rounded-3xl">
      <Image source={event.image} className="absolute size-full " />
      <BlurView intensity={20} className="h-24 w-full justify-center ">
        <LinearGradient
          // Background Linear Gradient
          colors={['transparent', 'rgba(0, 0, 0, 0.6)', 'rgba(0,0,0,0.8)']}
          style={StyleSheet.absoluteFill}
        />

        <Text className="text-center text-xl text-white">{event.text}</Text>
      </BlurView>
    </View>
  );
}
