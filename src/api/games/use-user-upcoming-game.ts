import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common'; // Your configured Axios instance
import type { APIError } from '../types';

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

export const useUpcomingGamesByUser = createQuery<
  ListGamesResponse,
  void,
  AxiosError<APIError>
>({
  queryKey: ['upcoming-games-by-user'],
  fetcher: () =>
    client.get('/games/get-upcoming').then((response) => response.data),
});
