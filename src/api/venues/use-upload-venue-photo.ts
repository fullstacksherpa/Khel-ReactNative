import type { AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';
import type { APIError } from '../types';

export type UploadVenuePhotoResponse = {
  photo_url: string;
};

type Variables = {
  venueID: number | string;
  photo: {
    uri: string;
    name: string;
    type: string;
  };
};

export const useUploadVenuePhoto = createMutation<
  UploadVenuePhotoResponse,
  Variables,
  AxiosError<APIError>
>({
  mutationFn: async ({ venueID, photo }) => {
    const formData = new FormData();

    formData.append('photo', {
      uri: photo.uri,
      name: photo.name,
      type: photo.type,
    } as any); // React Native FormData requires this casting workaround

    const response = await client.post(`/venues/${venueID}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
});
