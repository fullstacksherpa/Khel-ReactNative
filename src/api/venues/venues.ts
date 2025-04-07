import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common'; // your axios client
import type { APIError } from '../types';

export type IsVenueOwnerResponse = {
  data: {
    is_owner: boolean;
  };
};

type Variables = void;

export const useIsVenueOwner = createQuery<
  IsVenueOwnerResponse,
  Variables,
  AxiosError<APIError>
>({
  queryKey: ['isVenueOwner'],
  fetcher: () => {
    console.log('Checking if user is venue owner 👨🏽‍💻');
    return client
      .get('/venues/is-venue-owner')
      .then((response) => response.data);
  },
});
