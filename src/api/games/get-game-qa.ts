import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

export type Reply = {
  id: number;
  question_id?: number;
  admin_id?: number;
  reply: string;
  created_at: string;
};

export type QuestionWithReplies = {
  id: number;
  question: string;
  created_at: string;
  replies?: Reply[];
};

type GetQAResponse = {
  data: QuestionWithReplies[];
};

type Variables = {
  gameID: string;
};

export const useGetGameQA = createQuery<
  GetQAResponse,
  Variables,
  AxiosError<APIError>
>({
  queryKey: ['game-question-answer'],
  fetcher: async ({ gameID }) => {
    const res = await client.get<GetQAResponse>(`/games/${gameID}/qa`);
    return res.data;
  },
  staleTime: 2 * 1000,
});
