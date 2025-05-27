import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

export type UpdateVenueResponse = {
  message: string;
};

export type UpdateVenueVariables = {
  venueID: string | number;
  updateData: Record<string, any>;
};

export const useUpdateVenue = createMutation<
  UpdateVenueResponse,
  UpdateVenueVariables,
  AxiosError<APIError>
>({
  mutationFn: async ({ venueID, updateData }) => {
    const response = await client.patch(`/venues/${venueID}`, updateData);
    return response.data;
  },
});
