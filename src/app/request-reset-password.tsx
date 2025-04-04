import { useRouter } from 'expo-router';
import React from 'react';
import { showMessage } from 'react-native-flash-message';

import { useRequestResetPassword } from '@/api/auth/auth';
import {
  RequestResetForm,
  type RequestResetFormProps,
} from '@/components/request-reset-form';

const RequestResetPasswordScreen = () => {
  const router = useRouter();
  const { mutate: requestReset, isPending } = useRequestResetPassword();

  const onSubmit: RequestResetFormProps['onSubmit'] = (data) => {
    requestReset(data, {
      onSuccess: (response) => {
        const message = response.data.message;
        router.push('/');
        showMessage({
          message,
          type: 'success',
        });
        // Optionally, navigate or reset the form
      },
      onError: (error) => {
        const errorMessage =
          error.response?.data?.message ||
          'An error occurred, please try again.';
        showMessage({
          message: errorMessage,
          type: 'danger',
        });
      },
    });
  };

  return <RequestResetForm onSubmit={onSubmit} isPending={isPending} />;
};

export default RequestResetPasswordScreen;
