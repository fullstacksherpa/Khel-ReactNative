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
  is_booked: boolean;
  match_full: boolean;
  venue_lat: number;
  venue_lon: number;
  shortlisted: boolean;
};

export type GameDetails = {
  game_id: number;
  venue_id: number;
  venue_name: string;
  sport_type: string;
  price: number;
  format: string;
  game_level: string;
  admin_id: number;
  game_admin_name: string;
  is_booked: boolean;
  start_time: string;
  end_time: string;
  max_players: number;
  current_player: number;
  player_images: string[];
  player_ids: number[];
  requested_player_ids: number[];
  venue_lat: number;
  venue_lon: number;
};

// The API now returns a simple JSON object with a data array of games.
export type ListGamesResponse = {
  data: Game[];
};

export type GameDetailsResponse = {
  data: GameDetails;
};

export type GameDetailsVariables = {
  gameID: number;
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
      .get('/games/get-games', { params: variables })
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
      .get('/games/get-games', {
        params: {
          ...variables,
          offset: pageParam, // pageParam represents the offset for each page request.
          limit: variables.limit ?? 20,
        },
      })
      .then((response) => response.data),
  getNextPageParam: (lastPage, pages) => {
    const limit = pages[0]?.data?.length || 10;
    if (lastPage.data.length < limit) return undefined;
    return pages.length * limit;
  },
  initialPageParam: 0,
});

export const useGameDetails = createQuery<
  GameDetailsResponse,
  GameDetailsVariables,
  AxiosError<APIError>
>({
  queryKey: ['game-details'], // base key; queryKey will also include the variables
  fetcher: (GameDetailsVariables) =>
    client
      .get<GameDetailsResponse>(`/games/${GameDetailsVariables.gameID}`)
      .then((res) => res.data),
  staleTime: 5 * 60 * 1000,
});
