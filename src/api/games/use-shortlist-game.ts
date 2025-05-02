import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common'; // your axios instance
import type { APIError } from '../types';

type Variables = {
  gameID: number;
};

type ShortlistResponse = {
  data: {
    message: string;
  };
};

export const useShortlistGame = createMutation<
  ShortlistResponse,
  Variables,
  AxiosError<APIError>
>({
  mutationFn: async ({ gameID }) => {
    const res = await client.post(`/games/${gameID}/shortlist`);
    return res.data;
  },
});
