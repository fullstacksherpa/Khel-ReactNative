import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

// Payload for submitting a review
type SubmitReviewPayload = {
  rating: number;
  feedback?: string;
};

// Response shape for submitReview
type SubmitReviewResponse = {
  data: {
    message: string;
  };
};

export const useSubmitReview = createMutation<
  SubmitReviewResponse,
  SubmitReviewPayload,
  AxiosError<APIError>
>({
  mutationFn: async (payload) => {
    const res = await client.post<SubmitReviewResponse>(
      '/app-reviews',
      payload
    );
    return res.data;
  },
  mutationKey: ['submitReview'],
  onError: (error) => {
    console.error('Error submitting review:', error);
  },
});
