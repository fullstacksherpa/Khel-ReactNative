import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

const ToggleGameVenue = () => {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center">
      <Pressable onPress={() => router.push('/login')}>
        <Text>Login</Text>
      </Pressable>
    </View>
  );
};

export default ToggleGameVenue;
