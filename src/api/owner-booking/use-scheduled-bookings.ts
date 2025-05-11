import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

/**
 * Represents a single pending booking request.
 */
export interface ScheduledBooking {
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
  accepted_at: string;
  /** Booking start time (ISO timestamp) */
  start_time: string;
  /** Booking end time (ISO timestamp) */
  end_time: string;
}

/**
 * Shape of the API response for pending bookings.
 */
export interface ScheduledBookingsResponse {
  data: ScheduledBooking[];
}

/**
 * Variables required to fetch pending bookings.
 */
export interface ScheduledBookingsVariables {
  /** ID of the venue to list pending requests for */
  venueID: number | string;
  /** Date for which to list pending bookings (YYYY-MM-DD) */
  date: string;
}

/**
 * Hook to fetch all pending booking requests for a specific venue and date.
 *
 * @example
 * const { data, error, isLoading } = useScheduledBookings({ venueID: 123, date: '2025-05-18' });
 */
export const useScheduledBookings = createQuery<
  ScheduledBookingsResponse,
  ScheduledBookingsVariables,
  AxiosError<APIError>
>({
  queryKey: ['scheduled-bookings'],
  fetcher: ({ venueID, date }) =>
    client
      .get<ScheduledBookingsResponse>(`/venues/${venueID}/scheduled-bookings`, {
        params: { date },
      })
      .then((res) => res.data),
  staleTime: 20 * 1000,
  refetchInterval: 40 * 1000,
});
