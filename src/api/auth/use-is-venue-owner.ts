// hooks/useIsVenueOwner.ts
import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

export type IsVenueOwnerResponse = {
  isOwner: boolean;
  venueIDs: number[];
};

export const useIsVenueOwner = createQuery<
  IsVenueOwnerResponse,
  void,
  AxiosError<APIError>
>({
  queryKey: ['is-venue-owner'],
  fetcher: async () => {
    const res = await client.get('/venues/is-venue-owner');
    const { is_owner, venue_ids } = res.data.data; // handle wrapped "data"
    return {
      isOwner: is_owner,
      venueIDs: venue_ids,
    };
  },
});
