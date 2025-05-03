// hooks/useCancelGame.ts
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

type Variables = {
  gameID: number;
};

type Response = {
  message: string;
};

export const useCancelGame = createMutation<
  Response,
  Variables,
  AxiosError<APIError>
>({
  mutationFn: async ({ gameID }) => {
    const res = await client.patch(`/games/${gameID}/cancel-game`);
    return res.data;
  },
});
