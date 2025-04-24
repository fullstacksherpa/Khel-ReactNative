// hooks/useJoinGame.ts
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common'; // your axios instance
import type { APIError } from '../types';

type Variables = {
  gameID: string;
};

type Response = {
  message: string;
};

export const useJoinGame = createMutation<
  Response,
  Variables,
  AxiosError<APIError>
>({
  mutationFn: async ({ gameID }) => {
    const res = await client.post(`/games/${gameID}/request`);
    return res.data;
  },
});
