import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common'; // your Axios instance
import type { APIError } from '../types';

// Define payload structure
export type CreateReviewPayload = {
  rating: number;
  comment: string;
};

// What the server returns (you can adjust based on your actual model)
export type ReviewResponse = {
  id: number;
  user_id: number;
  venue_id: number;
  rating: number;
  comment: string;
  created_at: string;
};

// Variables for the mutation: venueID + payload
type Variables = {
  venueID: string | number;
  data: CreateReviewPayload;
};

// Hook
export const useCreateReview = createMutation<
  ReviewResponse, // What we expect in response
  Variables, // The variables we send
  AxiosError<APIError>
>({
  mutationFn: async ({ venueID, data }) => {
    const response = await client.post(`/venues/${venueID}/reviews`, data);
    return response.data;
  },
});
