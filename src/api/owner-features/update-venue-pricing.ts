import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

/**
 * Shape of the request body for updating one pricing slot.
 */
export interface UpdatePricingPayload {
  day_of_week: string; // e.g. "monday"
  start_time: string; // "HH:MM:SS"
  end_time: string; // "HH:MM:SS"
  price: number;
}

/**
 * Variables needed to call the “update pricing” endpoint:
 * - venueID:   path param {venueID}
 * - pricingID: path param {pricingID}
 * - payload:   JSON body
 */
export interface UpdateVenuePricingVariables {
  venueID: number | string;
  pricingID: number | string;
  payload: UpdatePricingPayload;
}

/**
 * Response type for the updated PricingSlot, matching your API:
 * {
 *   "ID": 1,
 *   "VenueID": 5,
 *   "DayOfWeek": "monday",
 *   "StartTime": "0000-01-01T07:00:00Z",
 *   "EndTime": "0000-01-01T12:00:00Z",
 *   "Price": 2000
 * }
 */
export interface PricingSlotResponse {
  ID: number;
  VenueID: number;
  DayOfWeek: string;
  StartTime: string; // ISO string
  EndTime: string; // ISO string
  Price: number;
}

/**
 * Hook: updates one pricing slot via PUT /venues/{venueID}/pricing/{pricingID}
 */
export const useUpdateVenuePricing = createMutation<
  PricingSlotResponse, // the API returns a single PricingSlotResponse object
  UpdateVenuePricingVariables, // variables for the mutation
  AxiosError<APIError> // error type
>({
  mutationFn: async ({ venueID, pricingID, payload }) => {
    const response = await client.put<PricingSlotResponse>(
      `/venues/${venueID}/pricing/${pricingID}`,
      payload
    );
    return response.data;
  },
});
