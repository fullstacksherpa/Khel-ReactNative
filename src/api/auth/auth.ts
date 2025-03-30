import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
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
  AxiosError
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
