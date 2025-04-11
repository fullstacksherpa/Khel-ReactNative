import type { AxiosError } from 'axios';
import { createInfiniteQuery, createQuery } from 'react-query-kit';

import { client } from '../common'; // Your axios client
import type { APIError } from '../types';

// Define the game type based on the API response
export type Game = {
  game_id: number;
  venue_id: number;
  venue_name: string;
  sport_type: string;
  price: number;
  format: string;
  game_admin_name: string;
  game_level: string;
  start_time: string;
  end_time: string;
  max_players: number;
  current_player: number;
  player_images: string[];
  venue_lat: number;
  venue_lon: number;
};

// The API now returns a simple JSON object with a data array of games.
export type ListGamesResponse = {
  data: Game[];
};

export type ListGamesVariables = {
  sport_type?: string;
  game_level?: string;
  venue_id?: number;
  is_booked?: boolean;
  lat?: number;
  lon?: number;
  radius?: number;
  start_after?: string;
  end_before?: string;
  min_price?: number;
  max_price?: number;
  limit?: number;
  offset?: number;
  sort?: 'asc' | 'desc';
};

// useListGames hook
export const useListGames = createQuery<
  ListGamesResponse,
  ListGamesVariables,
  AxiosError<APIError>
>({
  queryKey: ['list-games'],
  fetcher: (variables: ListGamesVariables) =>
    client
      .get('/get-games', { params: variables })
      .then((response) => response.data),
});

// useInfiniteGames hook
export const useInfiniteGames = createInfiniteQuery<
  ListGamesResponse,
  ListGamesVariables,
  AxiosError<APIError>
>({
  queryKey: ['infinite-games'],
  fetcher: (variables: ListGamesVariables, { pageParam }) =>
    client
      .get('/get-games', {
        params: {
          ...variables,
          offset: pageParam, // pageParam represents the offset for each page request.
          limit: variables.limit ?? 20,
        },
      })
      .then((response) => response.data),
  // Without pagination metadata from the backend, you might need to
  // define an alternative way to determine if there are more pages.
  // For now, we'll assume that if the returned array length is less than the limit,
  // there are no further pages.
  getNextPageParam: (lastPage, pages) => {
    // You can adjust this logic depending on your backend's response.
    // For example, if your backend returns a total count or next page cursor instead.
    const limit = pages[0]?.data?.length || 10;
    // If the last page returned fewer items than the limit, then there are no more pages.
    if (lastPage.data.length < limit) return undefined;
    // Otherwise, return the next page number based on the count of pages.
    return pages.length + 1;
  },
  initialPageParam: 0,
});
