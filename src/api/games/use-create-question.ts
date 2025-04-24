// hooks/useCreateQuestion.ts
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common'; // your axios instance
import type { APIError } from '../types';

type Variables = {
  gameID: string;
  question: string;
};

type QuestionResponse = {
  data: {
    id: number;
    game_id: number;
    user_id: number;
    question: string;
    created_at: string;
    updated_at: string;
  };
};

export const useCreateQuestion = createMutation<
  QuestionResponse,
  Variables,
  AxiosError<APIError>
>({
  mutationFn: async ({ gameID, question }) => {
    const res = await client.post(`/games/${gameID}/questions`, {
      question,
    });

    return res.data;
  },
});
