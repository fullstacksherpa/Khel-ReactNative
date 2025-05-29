import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common'; // your custom Axios instance
import type { APIError } from '../types';

export type VenueInfo = {
  id: number;
  name: string;
  address: string;
  location: [number, number];
  description: string;
  phone_number: string;
  amenities: string[];
  open_time: string;
  status: 'requested' | 'active' | 'rejected' | 'hold';
};

export type VenueInfoResponse = {
  data: VenueInfo;
};

type Variables = {
  venueID: number | string;
};

export const useVenueInfo = createQuery<
  VenueInfoResponse,
  Variables,
  AxiosError<APIError>
>({
  queryKey: ['venue-info'],
  fetcher: async ({ venueID }) => {
    const response = await client.get(`/venues/${venueID}/venue-info`);
    return response.data;
  },
});
