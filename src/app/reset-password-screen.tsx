import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';

import { useResetPassword } from '@/api/auth/auth';
import {
  ResetPasswordForm,
  type ResetPasswordFormType,
} from '@/components/reset-password-form';

const ResetPasswordScreen = () => {
  const router = useRouter();
  const { token } = useLocalSearchParams(); // Extract token from URL query params

  const { mutate: resetPassword, isPending } = useResetPassword();

  const onSubmit: SubmitHandler<ResetPasswordFormType> = (data) => {
    if (!token || typeof token !== 'string') {
      showMessage({ message: 'Invalid reset token', type: 'danger' });
      return;
    }
    resetPassword(
      { token, password: data.password },
      {
        onSuccess: (response) => {
          showMessage({
            message: response.data.message,
            type: 'success',
          });
          // Redirect to login after successful reset
          router.push('/login');
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.message || 'Error resetting password';
          showMessage({
            message: errorMessage,
            type: 'danger',
          });
        },
      }
    );
  };

  return <ResetPasswordForm onSubmit={onSubmit} isPending={isPending} />;
};

export default ResetPasswordScreen;
