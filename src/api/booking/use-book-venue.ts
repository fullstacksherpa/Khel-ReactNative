// hooks/useBookVenue.ts
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common'; // your axios instance
import type { APIError } from '../types';

// Payload shape Go expects
export interface BookVenuePayload {
  start_time: string; // e.g. "2025-05-09T08:00:00+05:45" or UTC ISO
  end_time: string;
}

// Response: your Go handler writes back the full Booking record
export interface BookingResponse {
  id: number;
  venue_id: number;
  user_id: number;
  start_time: string;
  end_time: string;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export type BookVenueResult = { data: BookingResponse };

export const useBookVenue = createMutation<
  BookVenueResult,
  BookVenuePayload & { venueID: number | string },
  AxiosError<APIError>
>({
  mutationFn: async ({ venueID, start_time, end_time }) => {
    const res = await client.post<BookVenueResult>(
      `/venues/${venueID}/bookings`,
      { start_time, end_time }
    );
    return res.data;
  },
  mutationKey: ['bookVenue'],
  onError: (error) => {
    console.error('Booking failed:', error);
  },
});
