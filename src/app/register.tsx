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

  const onSubmit: RegisterFormProps['onSubmit'] = (data) => {
    registerUser(data, {
      onSuccess: (response) => {
        showMessage({
          message: 'Check Gmail for Verification Link',
          type: 'success',
        });
        console.log(response);

        const timeoutId = setTimeout(
          () => router.push('/email-verification'),
          1000
        );

        return () => clearTimeout(timeoutId);
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data.message || 'Error registering user';
        showErrorMessage(errorMessage);
      },
    });
  };
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />
      <RegisterForm onSubmit={onSubmit} isPending={isPending} />
    </>
  );
}
