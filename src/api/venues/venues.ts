import type { AxiosError } from 'axios';
import { createInfiniteQuery, createQuery } from 'react-query-kit';

import { client } from '../common'; // your axios client
import type { APIError } from '../types';
import type { ListVenuesResponse, ListVenuesVariables } from './types';

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
      .get('/list-venues', { params: variables })
      .then((response) => response.data),
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
      .get('/list-venues', {
        params: { ...variables, page: pageParam, limit: variables.limit ?? 10 },
      })
      .then((response) => response.data),
  // The function used to determine the next page parameter.
  // In this example, if the number of items returned is less than the limit, we assume there are no more pages.
  getNextPageParam: (lastPage, pages) => {
    // You can adjust this logic depending on your backend's response.
    // For example, if your backend returns a total count or next page cursor instead.
    const limit = pages[0]?.data?.length || 10;
    // If the last page returned fewer items than the limit, then there are no more pages.
    if (lastPage.data.length < limit) return undefined;
    // Otherwise, return the next page number based on the count of pages.
    return pages.length + 1;
  },
  // Start with the first page
  initialPageParam: 1,
});
