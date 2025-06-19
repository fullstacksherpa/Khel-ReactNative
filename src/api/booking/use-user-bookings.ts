import type { AxiosError } from 'axios';
import { createInfiniteQuery } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

export type BookingRaw = {
  booking_id: number;
  venue_id: number;
  venue_name: string;
  venue_address: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: string;
  created_at: string;
};

export type BookingsRawResponse = {
  data: BookingRaw[];
};

export type Booking = {
  bookingId: number;
  venueId: number;
  venueName: string;
  venueAddress: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  createdAt: string;
};

export type BookingsResponse = {
  data: Booking[];
  nextPage?: number; // if undefined → no more pages
};

export type InfiniteBookingsVariables = {
  limit?: number;
  status?: string;
};

export const useInfiniteUserBookings = createInfiniteQuery<
  BookingsResponse,
  InfiniteBookingsVariables,
  AxiosError<APIError>
>({
  queryKey: ['infinite-user-bookings'],
  fetcher: (variables, { pageParam = 1 }) => {
    const limit = variables.limit ?? 7;

    return client
      .get<BookingsRawResponse>('/users/bookings', {
        params: {
          page: pageParam,
          limit,
          ...(variables.status ? { status: variables.status } : {}),
        },
      })
      .then((res) => {
        const rawData = res.data.data ?? []; // if null, fallback to []
        const bookings: Booking[] = rawData.map((b) => ({
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

        const nextPage = bookings.length < limit ? undefined : pageParam + 1;

        return { data: bookings, nextPage };
      });
  },

  getNextPageParam: (lastPage) => {
    // TS-safe: lastPage.nextPage is typed as number|undefined
    return lastPage.nextPage;
  },
  initialPageParam: 1,
});
