import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import { type APIError } from '../types';
import type { LoginResponse, RegisterResponse } from './types';

export type RegisterVariables = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
};

export const useRegister = createMutation<
  RegisterResponse,
  RegisterVariables,
  AxiosError<APIError>
>({
  mutationFn: async (variables) =>
    client({
      url: '/authentication/user',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});

export type LoginVariables = {
  email: string;
  password: string;
};

export const useLogin = createMutation<
  LoginResponse,
  LoginVariables,
  AxiosError
>({
  mutationFn: async (variables) =>
    client({
      url: '/authentication/token',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});

export type RequestResetPasswordPayload = {
  email: string;
};

export type RequestResetPasswordResponse = {
  data: {
    message: string;
  };
};

export const useRequestResetPassword = createMutation<
  RequestResetPasswordResponse,
  RequestResetPasswordPayload,
  AxiosError<APIError>
>({
  mutationFn: async (variables) =>
    client({
      url: '/authentication/reset-password',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

export type ResetPasswordResponse = {
  data: {
    message: string;
  };
};

export const useResetPassword = createMutation<
  ResetPasswordResponse,
  ResetPasswordPayload,
  AxiosError<APIError>
>({
  mutationFn: async (variables) =>
    client({
      url: '/authentication/reset-password',
      method: 'PATCH',
      data: variables,
    }).then((response) => response.data),
});
