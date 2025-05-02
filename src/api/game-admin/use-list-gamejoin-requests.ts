import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

export type GameJoinRequest = {
  [x: string]: any;
  id: number;
  game_id: number;
  user_id: number;
  status: string;
  request_time: string;
  updated_at: string;
  first_name: string;
  phone: string;
  profile_picture_url: { String: string; Valid: boolean };
  skill_level: { String: string; Valid: boolean };
};

export type ListGameJoinRequestsResponse = {
  data: GameJoinRequest[];
};

export type GameJoinRequestsVariables = {
  gameID: number;
};

export const useListGameJoinRequests = createQuery<
  ListGameJoinRequestsResponse,
  GameJoinRequestsVariables,
  AxiosError<APIError>
>({
  queryKey: ['game-join-requests'],
  fetcher: ({ gameID }: GameJoinRequestsVariables) =>
    client.get(`/games/${gameID}/requests`).then((response) => response.data),
});
