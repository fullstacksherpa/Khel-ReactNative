// hooks/useGetAllAppReviews.ts
import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

// Shape of a single review
export type AppReview = {
  id: number;
  user_id: number;
  rating: number;
  feedback: string;
  created_at: string;
};

// Response for getAllAppReviews
type GetAllReviewsResponse = {
  data: AppReview[];
};

export const useGetAllAppReviews = createQuery<
  GetAllReviewsResponse,
  AxiosError<APIError>
>({
  queryKey: ['getAllAppReviews'],
  fetcher: async () => {
    const res = await client.get<GetAllReviewsResponse>('/app-reviews');
    return res.data;
  },
  staleTime: 3 * 1000,
});
