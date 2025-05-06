// hooks/useVenueReviews.ts
import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common'; // your Axios instance
import type { APIError } from '../types';

export type SingleReview = {
  id: number;
  user_id: number;
  venue_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  avatar_url?: string | null;
};

export type VenueReviewResponse = {
  data: {
    reviews: SingleReview[];
    total_reviews: number;
    average: number;
  };
};

type Variables = {
  venueID: string | number;
};

export const useVenueReviews = createQuery<
  VenueReviewResponse,
  Variables,
  AxiosError<APIError>
>({
  queryKey: ['venue-reviews'],
  fetcher: async ({ venueID }) => {
    const response = await client.get(`/venues/${venueID}/reviews`);
    return response.data;
  },
});
