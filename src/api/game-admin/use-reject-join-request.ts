import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common'; // your axios instance
import type { APIError } from '../types';

export type RejectJoinRequestVariables = {
  gameID: number;
  user_id: number;
};

export type RejectJoinRequestResponse = {
  data: {
    message: string;
  };
};

export const useRejectJoinRequest = createMutation<
  RejectJoinRequestResponse,
  RejectJoinRequestVariables,
  AxiosError<APIError>
>({
  mutationFn: async (variables) => {
    const { gameID, user_id } = variables;
    const res = await client.post(`/games/${gameID}/reject`, { user_id });
    return res.data;
  },
  mutationKey: ['rejectJoinRequest'],
  onError: (error) => {
    console.error('Error rejecting join request:', error);
  },
});
