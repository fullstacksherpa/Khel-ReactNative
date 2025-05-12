import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

// Payload for editing profile: only changed fields + optional image
export type EditProfilePayload = Partial<{
  first_name: string;
  last_name: string;
  phone: string;
  skill_level: string;
}> & {
  imageUri?: string;
};

export const useEditProfile = createMutation<
  void,
  EditProfilePayload,
  AxiosError<APIError>
>({
  mutationKey: ['editProfile'],
  mutationFn: async (payload) => {
    // build FormData
    const form = new FormData();
    // map snake_case keys
    if (payload.first_name) form.append('first_name', payload.first_name);
    if (payload.last_name) form.append('last_name', payload.last_name);
    if (payload.phone) form.append('phone', payload.phone);
    if (payload.skill_level) form.append('skill_level', payload.skill_level);
    if (payload.imageUri) {
      const uri = payload.imageUri;
      const name = uri.split('/').pop()!;
      const type = `image/${name.split('.').pop()}`;
      form.append('profile_picture', {
        uri,
        name,
        type,
      } as any);
    }

    await client.patch('/users/update-profile', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  onError: (error) => {
    console.error('Edit profile failed:', error);
  },
});
