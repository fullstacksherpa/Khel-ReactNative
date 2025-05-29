import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

export type DeleteVenuePhotoResponse = {
  message: string; // "photo deleted successfully"
};

type Variables = {
  venueID: number | string;
  photoURL: string;
};

export const useDeleteVenuePhoto = createMutation<
  DeleteVenuePhotoResponse,
  Variables,
  AxiosError<APIError>
>({
  mutationFn: async ({ venueID, photoURL }) => {
    const response = await client.delete(`/venues/${venueID}/photos`, {
      params: {
        photo_url: photoURL,
      },
    });

    return response.data;
  },
});
