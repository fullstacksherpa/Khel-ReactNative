// hooks/useUpcomingGamesByVenue.ts

import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common'; // Your axios client instance
import type { APIError } from '../types';

export type UpcomingGamesVariables = {
  venueID: number;
};

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
  status: string;
};

export type ListGamesResponse = {
  data: Game[];
};

export const useUpcomingGamesByVenue = createQuery<
  ListGamesResponse,
  UpcomingGamesVariables,
  AxiosError<APIError>
>({
  queryKey: ['upcoming-games-at-venue'],

  fetcher: (variables: UpcomingGamesVariables) =>
    client
      .get(`/games/${variables.venueID}/upcoming`)
      .then((response) => response.data),
});
