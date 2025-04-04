import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { client } from '@/api';

export default function ConfirmActivation() {
  const { token } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (!token) return;
    console.log('running confirmActivation');

    client
      //TODO: change to ${token} dynamically
      .put(`/users/activate/197243fe-8fd2-418d-be55-92a9c4fdbca2`)
      .then(() => {
        showMessage({ message: 'Account activated!', type: 'success' });
        setTimeout(() => router.push('/login'), 2000);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data.message || 'Activation failed!';
        showMessage({ message: errorMessage, type: 'danger' });
        setTimeout(() => router.push('/register'), 2000);
      });
  }, [router, token]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Activating your account...</Text>
    </View>
  );
}
