import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

// eslint-disable-next-line max-lines-per-function
const ToggleGameVenue = () => {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center gap-4 border-red-400 font-bold">
      <Pressable onPress={() => router.push('/email-verification')}>
        <Text className="bold text-3xl font-bold text-red-500 underline">
          email-verification
        </Text>
      </Pressable>
      <Pressable onPress={() => router.push('/confirm/{token}')}>
        <Text className="bold text-3xl font-bold text-red-500 underline">
          confirm/token
        </Text>
      </Pressable>
      <Pressable onPress={() => router.push('/request-reset-password')}>
        <Text className="bold text-3xl font-bold text-red-500 underline">
          request reset password
        </Text>
      </Pressable>
      <Pressable onPress={() => router.push('/reset-password-screen')}>
        <Text className="bold text-3xl font-bold text-red-500 underline">
          update password
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push('/owner-dashboard')}>
        <Text className="bold text-3xl font-bold text-red-500 underline">
          Venue Owner Dashboard
        </Text>
      </Pressable>
      <Pressable onPress={() => router.push('/gamesetup')}>
        <Text className="bold text-3xl font-bold text-red-500 underline">
          GameSetup
        </Text>
      </Pressable>
    </View>
  );
};

export default ToggleGameVenue;
