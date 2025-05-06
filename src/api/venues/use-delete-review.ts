// hooks/useDeleteVenueReview.ts
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

export type DeleteReviewResponse = {
  data: {
    message: string;
  };
};

type Variables = {
  venueID: string | number;
  reviewID: string | number;
};

export const useDeleteVenueReview = createMutation<
  DeleteReviewResponse,
  Variables,
  AxiosError<APIError>
>({
  mutationFn: async ({ venueID, reviewID }) => {
    const response = await client.delete(
      `/venues/${venueID}/reviews/${reviewID}`
    );
    return response.data;
  },
});
