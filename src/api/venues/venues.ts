import type { AxiosError } from 'axios';
import { createInfiniteQuery, createQuery } from 'react-query-kit';

import { client } from '../common'; // your axios client
import type { APIError } from '../types';
import type {
  ListVenuesResponse,
  ListVenuesVariables,
  VenueDetails,
} from './types';

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

// /list-venues?sport=Futsal&lat=27.7251&lng=85.3701&page=1&limit=20)
export const useListVenues = createQuery<
  ListVenuesResponse,
  ListVenuesVariables,
  AxiosError
>({
  // Provide a static query key; react-query-kit will append the variables
  queryKey: ['list-venues'],
  // The fetcher receives the variables and passes them as query parameters.
  // Our backend returns a response shaped as { data: Venue[] }.
  fetcher: (variables: ListVenuesVariables) =>
    client
      .get('/venues/list-venues', { params: variables })
      .then((response) => response.data),
  staleTime: 5 * 60 * 1000,
});

export const useInfiniteVenues = createInfiniteQuery<
  ListVenuesResponse,
  ListVenuesVariables,
  AxiosError
>({
  // The static query key; react-query-kit will append variables when you use the hook.
  queryKey: ['infinite-venues'],
  // The fetcher gets the current variables and a context object containing the pageParam
  fetcher: (
    variables: ListVenuesVariables,
    { pageParam }
  ): Promise<ListVenuesResponse> =>
    // Default limit if not provided; page is managed by the infinite query
    client
      .get('/venues/list-venues', {
        params: { ...variables, page: pageParam, limit: variables.limit ?? 10 },
      })
      .then((response) => response.data),
  getNextPageParam: (lastPage, pages) => {
    const limit = pages[0]?.data?.length || 10;
    if (lastPage.data.length < limit) return undefined;
    return pages.length * limit;
  },
  // Start with the first page
  initialPageParam: 1,
});

type VenueDetailsVariables = { id: string };
type VenueDetailsResponse = VenueDetails;

export const useVenue = createQuery<
  VenueDetailsResponse,
  VenueDetailsVariables,
  AxiosError
>({
  queryKey: ['venues', 'detail'],
  fetcher: (variables) =>
    client.get(`venue/${variables.id}`).then((response) => response.data.data),
  staleTime: 10 * 60 * 1000,
});
