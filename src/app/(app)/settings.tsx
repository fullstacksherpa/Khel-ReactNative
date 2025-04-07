import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { client } from '@/api';
import { useAuth } from '@/lib/auth/index';

const ToggleGameVenue = () => {
  const signOut = useAuth.use.signOut();
  const signOutHandler = async () => {
    try {
      const { access } = useAuth.getState().token || {};
      if (!access) throw new Error('No access token found');

      await client('/users/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${access}`,
          'Content-Type': 'application/json',
        },
      });

      signOut(); // ✅ Call signOut from Zustand
      router.push('/login'); // Redirect after sign-out
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center gap-4 border-red-400 font-bold">
      <Pressable onPress={() => router.push('/login')}>
        <Text className="bold text-3xl font-bold text-red-500 underline">
          Login
        </Text>
      </Pressable>
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
      <Pressable onPress={signOutHandler}>
        <Text className="bold text-3xl font-bold text-red-500 underline">
          Sign out
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
      <Pressable onPress={() => router.push('/venue-details')}>
        <Text className="bold text-3xl font-bold text-red-500 underline">
          venue details
        </Text>
      </Pressable>
      <Pressable onPress={() => router.push('/owner-dashboard')}>
        <Text className="bold text-3xl font-bold text-red-500 underline">
          Venue Owner Dashboard
        </Text>
      </Pressable>
    </View>
  );
};

export default ToggleGameVenue;
