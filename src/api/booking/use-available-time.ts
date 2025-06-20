import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common'; // your axios client
import type { APIError } from '../types';

/**
 * Represents an hourly availability slot for a venue.
 */
export interface HourlySlot {
  /** ISO timestamp of the slot start in venue's timezone */
  start_time: string;
  /** ISO timestamp of the slot end in venue's timezone */
  end_time: string;
  /** Price per hour in the venue's currency */
  price_per_hour: number;
  /** Whether this slot is available for booking */
  available: boolean;
}

/**
 * Shape of the API response for available time slots.
 */
export interface AvailableTimesResponse {
  data: HourlySlot[];
}

/**
 * Variables required to fetch available time slots.
 */
export interface AvailableTimesVariables {
  /** ID of the venue */
  venueID: number | string;
  /** Date for which to list slots (YYYY-MM-DD) */
  date: string;
}

/**
 * Hook to fetch one-hour availability buckets for a specific venue and date.
 *
 * @example
 * const { data, error, isLoading } = useAvailableTimes({ venueID: 123, date: '2025-05-08' });
 */
export const useAvailableTimes = createQuery<
  AvailableTimesResponse,
  AvailableTimesVariables,
  AxiosError<APIError>
>({
  queryKey: ['venues', 'available-times'],
  fetcher: ({ venueID, date }) =>
    client
      .get<AvailableTimesResponse>(`/venues/${venueID}/available-times`, {
        params: { date },
      })
      .then((res) => res.data),
  /**
   * Cache the availability for 40 second to reduce refetching when user
   * switches between date or revisits the page shortly after.
   */
  staleTime: 40 * 1000,
  refetchInterval: 30 * 1000,
});
