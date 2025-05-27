import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

export type CreateVenueResponse = {
  id: number;
  owner_id: number;
  name: string;
  address: string;
  location: number[];
  description?: string;
  amenities?: string[];
  phone_number: string;
  open_time?: string;
  sport: string;
  image_urls: string[];
  created_at: string;
  updated_at: string;
};

// We send FormData directly
export type CreateVenueVariables = FormData;

export const useCreateVenue = createMutation<
  CreateVenueResponse,
  CreateVenueVariables,
  AxiosError<APIError>
>({
  mutationFn: async (formData) => {
    const response = await client.post('/venues', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data;
  },
});
