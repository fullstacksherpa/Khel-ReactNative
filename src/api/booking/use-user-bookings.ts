import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

type BookingRaw = {
  booking_id: number;
  venue_id: number;
  venue_name: string;
  venue_address: string;
  start_time: string; // ISO timestamp
  end_time: string; // ISO timestamp
  total_price: number;
  status: string;
  created_at: string; // ISO timestamp
};

type BookingsRawResponse = {
  data: BookingRaw[];
};

// --- Shape you expose to your components ---
export type Booking = {
  bookingId: number;
  venueId: number;
  venueName: string;
  venueAddress: string;
  startTime: string; // still ISO; parse to Date in your UI if needed
  endTime: string;
  totalPrice: number;
  status: string;
  createdAt: string;
};

export type BookingsResponse = {
  data: Booking[];
};

// no variables needed since we infer user from token
export type BookingsVariables = void;

export const useUserBookings = createQuery<
  BookingsResponse,
  BookingsVariables,
  AxiosError<APIError>
>({
  queryKey: ['user-bookings'],
  // no variables, so fetcher signature is empty
  fetcher: async () => {
    const res = await client.get<BookingsRawResponse>('/users/bookings');

    const bookings: Booking[] = res.data.data.map((b) => ({
      bookingId: b.booking_id,
      venueId: b.venue_id,
      venueName: b.venue_name,
      venueAddress: b.venue_address,
      startTime: b.start_time,
      endTime: b.end_time,
      totalPrice: b.total_price,
      status: b.status,
      createdAt: b.created_at,
    }));

    return { data: bookings };
  },
  staleTime: 2 * 60 * 1000, // cache for 2 minutes
});
