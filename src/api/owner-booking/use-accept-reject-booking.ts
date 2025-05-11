// src/api/owner-booking/use-booking-actions.ts
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

/**
 * Variables for accepting or rejecting a booking
 */
export type BookingActionVariables = {
  /** ID of the venue */
  venueID: number | string;
  /** ID of the booking to act on */
  bookingID: number;
};

/**
 * A no-content response (204) has an empty body,
 * so we type it as void here.
 */
export type BookingActionResponse = void;

/**
 * Hook to accept a pending booking.
 *
 * Invalidates the pending-bookings query so your list refreshes.
 */
export const useAcceptBooking = createMutation<
  BookingActionResponse,
  BookingActionVariables,
  AxiosError<APIError>
>({
  mutationKey: ['venues', 'pending-bookings', 'accept'],
  mutationFn: async ({ venueID, bookingID }) => {
    await client.post(
      `/venues/${venueID}/pending-bookings/${bookingID}/accept`
    );
  },
  onError: (error) => {
    console.error('Error accepting booking:', error);
  },
});

/**
 * Hook to reject a pending booking.
 *
 * Invalidates the pending-bookings query so your list refreshes.
 */
export const useRejectBooking = createMutation<
  BookingActionResponse,
  BookingActionVariables,
  AxiosError<APIError>
>({
  mutationKey: ['venues', 'pending-bookings', 'reject'],
  mutationFn: async ({ venueID, bookingID }) => {
    await client.post(
      `/venues/${venueID}/pending-bookings/${bookingID}/reject`
    );
  },
  onError: (error) => {
    console.error('Error rejecting booking:', error);
  },
});
