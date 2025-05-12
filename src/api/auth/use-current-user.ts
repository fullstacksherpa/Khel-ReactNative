import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

// Match the actual API response shape
export type UserProfile = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  profile_picture_url: string;
  no_of_games: number;
  created_at: string;
  updated_at: string;
};

export const useCurrentUser = createQuery<
  UserProfile,
  unknown,
  AxiosError<APIError>
>({
  queryKey: ['currentUser'],
  fetcher: async () => {
    const res = await client.get<{ data: UserProfile }>('/users/me');
    return res.data.data;
  },
  staleTime: 1000 * 60 * 5,
});
