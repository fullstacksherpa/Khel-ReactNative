import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

// --------- TYPE DEFINITIONS ---------
/**
 * One slot’s payload shape.
 */
export type CreatePricingSlotInput = {
  day_of_week: string;
  start_time: string; // "HH:MM:SS"
  end_time: string; // "HH:MM:SS"
  price: number;
};

/**
 * Variables needed to call the API.
 * venueID → path param
 * slots   → JSON body
 */
export type CreateVenuePricingVariables = {
  venueID: number;
  slots: CreatePricingSlotInput[];
};

/**
 * The API returns an array of PricingSlot objects.
 */
export type PricingSlot = {
  id: number;
  venue_id: number;
  day_of_week: string;
  start_time: string;
  end_time: string;
  price: number;
};

// --------- MUTATION HOOK ---------
export const useCreateVenuePricing = createMutation<
  PricingSlot[], // response data type
  CreateVenuePricingVariables, // variables type
  AxiosError<APIError> // error type
>({
  mutationFn: async ({ venueID, slots }) => {
    // POST to /venues/{venueID}/pricing
    const response = await client.post(`/venues/${venueID}/pricing`, { slots });
    // Assuming your backend wraps data under `.data.data`:
    return response.data?.data as PricingSlot[];
  },
});
