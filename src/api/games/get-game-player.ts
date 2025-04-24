// hooks/useGamePlayers.ts
import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common'; // your axios instance
import type { APIError } from '../types';

type NullString = {
  String: string;
  Valid: boolean;
};

type PlayerRaw = {
  id: number;
  first_name: string;
  profile_picture_url: NullString;
  skill_level: NullString;
  phone: string;
};

type GamePlayersRawResponse = {
  data: PlayerRaw[];
};

export type Player = {
  id: number;
  first_name: string;
  profile_picture_url: string | null;
  skill_level: string | null;
  phone: string;
};

export type GamePlayersResponse = {
  data: Player[];
};

export type GamePlayersVariables = {
  gameID: number;
};

export const useGamePlayers = createQuery<
  GamePlayersResponse,
  GamePlayersVariables,
  AxiosError<APIError>
>({
  queryKey: ['game-players'],
  fetcher: async ({ gameID }) => {
    const res = await client.get<GamePlayersRawResponse>(
      `/games/${gameID}/players`
    );

    const players: Player[] = res.data.data.map((player) => ({
      id: player.id,
      first_name: player.first_name,
      phone: player.phone,
      profile_picture_url: player.profile_picture_url.Valid
        ? player.profile_picture_url.String
        : null,
      skill_level: player.skill_level.Valid ? player.skill_level.String : null,
    }));

    return { data: players };
  },
  staleTime: 2 * 60 * 1000,
});
