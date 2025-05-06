// hooks/useVenuesWithinBounds.ts
import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common'; // your Axios instance
import type { APIError } from '../types';

// Define the Venue type as returned by your API.
export type Venue = {
  id: number;
  name: string;
  address: string;
  image_urls: string[];
  location: number[]; // [longitude, latitude]
  open_time: string;
  phone_number: string;
  sport: string;
  total_reviews: number;
  average_rating: number;
  is_favorite: boolean;
};

export type ListVenuesResponse = {
  data: Venue[];
};

type Variables = {
  lat: number;
  lng: number;
  distance: number;
  sport?: string;
};

export const useVenuesWithinBounds = createQuery<
  ListVenuesResponse,
  Variables,
  AxiosError<APIError>
>({
  queryKey: ['venues-within-bounds'],
  fetcher: async ({ lat, lng, distance, sport }) => {
    const params: any = { lat, lng, distance };
    if (sport) params.sport = sport;
    const response = await client.get('/venues/list-venues', { params });
    return response.data;
  },
});
