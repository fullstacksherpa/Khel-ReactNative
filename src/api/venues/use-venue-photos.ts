import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

export type VenuePhotosResponse = {
  data: string[]; // array of Cloudinary image URLs
};

type Variables = {
  venueID: string | number;
};

export const useVenuePhotos = createQuery<
  VenuePhotosResponse,
  Variables,
  AxiosError<APIError>
>({
  queryKey: ['get-venue-photos'],
  fetcher: async ({ venueID }) => {
    const response = await client.get(`/venues/${venueID}/photos`);
    return response.data;
  },
  staleTime: 10 * 60 * 1000,
});
