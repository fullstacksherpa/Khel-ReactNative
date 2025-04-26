// hooks/useCreateGame.ts
import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common'; // your axios instance
import type { APIError } from '../types';

// This matches your CreateGamePayload struct from the Go backend
type CreateGamePayload = {
  sport_type: string;
  price?: number;
  format?: string;
  venue_id: number;
  max_players: number;
  game_level?: string;
  start_time: string;
  end_time: string;
  visibility: string;
  instruction?: string;
};

// Response from your Game struct in backend
type GameResponse = {
  data: {
    id: number;
    sport_type: string;
    price: number | null;
    format: string | null;
    venue_id: number;
    admin_id: number;
    max_players: number;
    game_level: string | null;
    start_time: string;
    end_time: string;
    visibility: string;
    instruction: string | null;
    status: string;
    is_booked: boolean;
    match_full: boolean;
    created_at: string;
    updated_at: string;
  };
};

export const useCreateGame = createMutation<
  GameResponse,
  CreateGamePayload,
  AxiosError<APIError>
>({
  mutationFn: async (payload) => {
    const res = await client.post('/games/create', payload);
    return res.data;
  },
  // Optional configurations
  mutationKey: ['createGame'],
  onError: (error) => {
    console.error('Error creating game:', error);
  },
});
