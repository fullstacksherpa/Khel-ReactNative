// hooks/useCreateReply.ts
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

type Variables = {
  gameID: string;
  questionID: string;
  reply: string;
};

type ReplyResponse = {
  data: {
    id: number;
    question_id: number;
    admin_id: number;
    reply: string;
    created_at: string;
    updated_at: string;
  };
};

export const useCreateReply = createMutation<
  ReplyResponse,
  Variables,
  AxiosError<APIError>
>({
  mutationFn: async ({ gameID, questionID, reply }) => {
    const res = await client.post(
      `/games/${gameID}/questions/${questionID}/replies`,
      {
        reply,
      }
    );
    return res.data;
  },
});
