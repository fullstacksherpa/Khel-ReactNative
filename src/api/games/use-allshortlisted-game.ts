import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

export type ShortlistedGame = {
  id: number;
  sport_type: string;
  price: number;
  format: string;
  venue_id: number;
  admin_id: number;
  max_players: number;
  game_level: string;
  start_time: string;
  end_time: string;
  visibility: string;
  instruction?: string;
  status: string;
  is_booked: boolean;
  match_full: boolean;
  created_at: string;
  updated_at: string;
  venue_name: string;
  venue_address: string;
};

export type ShortlistedGamesResponse = {
  data: ShortlistedGame[];
};

export const useShortlistedGames = createQuery<
  ShortlistedGamesResponse,
  void,
  AxiosError<APIError>
>({
  queryKey: ['all-shortlisted-games'],
  fetcher: () => client.get('/games/shortlist').then((res) => res.data),
});
