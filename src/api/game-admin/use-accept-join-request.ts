import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common'; // your axios instance
import type { APIError } from '../types';

export type AcceptJoinRequestVariables = {
  gameID: number;
  user_id: number;
};

export type AcceptJoinRequestResponse = {
  data: {
    message: string;
  };
};

export const useAcceptJoinRequest = createMutation<
  AcceptJoinRequestResponse,
  AcceptJoinRequestVariables,
  AxiosError<APIError>
>({
  mutationFn: async (variables) => {
    const { gameID, user_id } = variables;
    const res = await client.post(`/games/${gameID}/accept`, { user_id });
    return res.data;
  },
  mutationKey: ['acceptJoinRequest'],
  onError: (error) => {
    console.error('Error accepting join request:', error);
  },
});
