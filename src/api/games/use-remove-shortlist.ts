import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common'; // your axios instance
import type { APIError } from '../types';

type Variables = {
  gameID: number;
};

type RemoveShortlistResponse = {
  data: {
    message: string;
  };
};

export const useRemoveShortlistGame = createMutation<
  RemoveShortlistResponse,
  Variables,
  AxiosError<APIError>
>({
  mutationFn: async ({ gameID }) => {
    const res = await client.delete(`/games/${gameID}/shortlist`);
    return res.data;
  },
});
