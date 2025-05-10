import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

/**
 * Represents a single pending booking request.
 */
export interface PendingBooking {
  /** Booking ID */
  booking_id: number;
  /** User ID who made the request */
  user_id: number;
  /** Full name of the user */
  user_name: string;
  /** URL to the user's profile picture (nullable) */
  user_image?: string | null;
  /** User's phone number */
  user_number: string;
  /** Total price quoted for the booking */
  price: number;
  /** When the booking was requested (ISO timestamp) */
  requested_at: string;
  /** Booking start time (ISO timestamp) */
  start_time: string;
  /** Booking end time (ISO timestamp) */
  end_time: string;
}

/**
 * Shape of the API response for pending bookings.
 */
export interface PendingBookingsResponse {
  data: PendingBooking[];
}

/**
 * Variables required to fetch pending bookings.
 */
export interface PendingBookingsVariables {
  /** ID of the venue to list pending requests for */
  venueID: number | string;
  /** Date for which to list pending bookings (YYYY-MM-DD) */
  date: string;
}

/**
 * Hook to fetch all pending booking requests for a specific venue and date.
 *
 * @example
 * const { data, error, isLoading } = usePendingBookings({ venueID: 123, date: '2025-05-18' });
 */
export const usePendingBookings = createQuery<
  PendingBookingsResponse,
  PendingBookingsVariables,
  AxiosError<APIError>
>({
  queryKey: ['pending-bookings'],
  fetcher: ({ venueID, date }) =>
    client
      .get<PendingBookingsResponse>(`/venues/${venueID}/pending-bookings`, {
        params: { date },
      })
      .then((res) => res.data),
  /**
   * Since pending requests may update if someone approves/rejects,
   * consider refetching periodically.
   */
  staleTime: 20 * 1000, // treat data fresh for 30 seconds
  refetchInterval: 60 * 1000, // refetch every 60 seconds
});
