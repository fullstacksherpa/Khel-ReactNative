import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

/**
 * Represents one row from venue_pricing.
 */
export interface PricingSlot {
  id: number;
  venue_id: number;
  day_of_week: string;
  start_time: string; // "HH:MM:SS"
  end_time: string; // "HH:MM:SS"
  price: number;
}

/**
 * Shape of the API response.
 * We assume the backend returns JSON like { data: PricingSlot[] }.
 */
export interface VenuePricingResponse {
  data: PricingSlot[];
}

/**
 * Variables needed to fetch pricing for a given venue & day.
 */
export interface VenuePricingVariables {
  venueID: number | string;
  day: string; // e.g. "monday", "tuesday", etc.
}

/**
 * Fetch all pricing slots for a given venue, optionally filtering by `day`.
 *
 * Example usage:
 *   const { data, error, isLoading, refetch } = useVenuePricing({ venueID: 42, day: 'monday' });
 */
export const useVenuePricing = createQuery<
  VenuePricingResponse,
  VenuePricingVariables,
  AxiosError<APIError>
>({
  // We include both `venueID` and `day` in the key so React Query can cache separately.
  queryKey: ['venue-pricing'],
  fetcher: ({ venueID, day }) => {
    return client
      .get<VenuePricingResponse>(`/venues/${venueID}/pricing`, {
        params: { day },
      })
      .then((res) => res.data);
  },
  // Data for one day of pricing is unlikely to change every second.
  staleTime: 30 * 1000, // 30 seconds fresh
  refetchOnWindowFocus: false,
});
