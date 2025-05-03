import { createMutation } from 'react-query-kit';

import { getToken, type TokenType } from '@/lib/auth/utils';

import { client } from '../common';

type Variables = {
  gameId: number;
};

type Response = {
  data?: {
    message?: string;
  };
};

export const useToggleMatchFull = createMutation<Response, Variables>({
  mutationFn: async ({ gameId }) => {
    const token: TokenType | null = getToken();
    if (!token?.access) {
      throw new Error('Authorization token is missing or invalid');
    }

    const { data } = await client.patch(
      `/games/${gameId}/toggle-match-full`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token.access}`,
        },
      }
    );

    return data;
  },
});
