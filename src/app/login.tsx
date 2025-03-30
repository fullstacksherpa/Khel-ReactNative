import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

// import { useAuth } from '@/lib';
import { useLogin } from '@/api/auth/auth';
import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { showErrorMessage } from '@/components/ui';
import { signIn } from '@/lib/auth';

export default function Login() {
  const { mutate: loginUser, isPending } = useLogin();
  const router = useRouter();
  // const signIn = useAuth.use.signIn();

  const onSubmit: LoginFormProps['onSubmit'] = (data) => {
    console.log(data);
    loginUser(data, {
      onSuccess: (response) => {
        showMessage({
          message: 'Login Successfully 🔥',
          type: 'success',
        });
        const { accessToken, refreshToken } = response.data;
        const token = { access: accessToken, refresh: refreshToken };
        // Call the Zustand store signIn function with the token.
        signIn(token);
        // setItem('USERNAME', user.username);
        // setItem('USERIMAGE', user.image);

        const timeoutId = setTimeout(() => router.push('/'), 1000);

        return () => clearTimeout(timeoutId);
      },
      onError: () => {
        showErrorMessage('Error registering user');
      },
    });
  };
  return (
    <>
      <StatusBar style="light" />
      <LoginForm onSubmit={onSubmit} isPending={isPending} />
    </>
  );
}
