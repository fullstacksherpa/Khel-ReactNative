import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

import { useRegister } from '@/api/auth/auth';
import {
  RegisterForm,
  type RegisterFormProps,
} from '@/components/register-form';
import { showErrorMessage } from '@/components/ui';

export default function Register() {
  const { mutate: registerUser, isPending } = useRegister();
  const router = useRouter();
  // const signIn = useAuth.use.signIn();

  const onSubmit: RegisterFormProps['onSubmit'] = (data) => {
    registerUser(data, {
      onSuccess: (response) => {
        showMessage({
          message: 'Check Gmail for Verification Link',
          type: 'success',
        });
        console.log(response);
        // const { token, user } = response.data;
        // signIn(token, user.userId);
        // const mmkvToken = getToken();
        // const mmkvUserId = getUserId();
        // setItem('USERNAME', user.username);
        // setItem('USERIMAGE', user.image);
        // console.log(
        //   `this is mmkvToken:🔐 ${mmkvToken} this is userId ${mmkvUserId}`
        // );

        const timeoutId = setTimeout(() => router.push('/'), 1000);

        return () => clearTimeout(timeoutId);
      },
      onError: () => {
        showErrorMessage('Error registering user');
      },
    });
    // signIn({ access: 'access-token', refresh: 'refresh-token' });
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />
      <RegisterForm onSubmit={onSubmit} isPending={isPending} />
    </>
  );
}
