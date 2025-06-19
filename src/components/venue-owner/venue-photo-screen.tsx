import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { PlusIcon, Trash2Icon } from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useDeleteVenuePhoto } from '@/api/venues/use-delete-venue-photo';
import { useUploadVenuePhoto } from '@/api/venues/use-upload-venue-photo';
import { useVenuePhotos } from '@/api/venues/use-venue-photos';

type Props = {
  venueID: number | string;
};

// eslint-disable-next-line max-lines-per-function
export default function VenuePhotosScreen({ venueID }: Props) {
  const [deletingPhotoURL, setDeletingPhotoURL] = React.useState<string | null>(
    null
  );

  const queryClient = useQueryClient();

  const {
    data: photosData,
    isLoading: loadingPhotos,
    refetch,
  } = useVenuePhotos({ variables: { venueID } });

  const { mutateAsync: uploadPhoto, isPending: uploading } =
    useUploadVenuePhoto();
  const { mutateAsync: deletePhoto } = useDeleteVenuePhoto();

  const handlePickImage = async () => {
    if ((photosData?.data.length ?? 0) >= 7) {
      Alert.alert(
        'Maximum limit reached',
        'You can upload a maximum of 7 photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const photo = result.assets[0];
      const formData = new FormData();
      formData.append('photo', {
        uri: photo.uri,
        name: 'venue-photo.jpg',
        type: 'image/jpeg',
      } as any);

      await uploadPhoto(
        {
          venueID,
          photo: {
            uri: photo.uri,
            name: 'venue-photo.jpg',
            type: 'image/jpeg',
          },
        },
        {
          onSuccess: () => {
            refetch();
          },
          onError: () => {
            Alert.alert('Upload Failed', 'Failed to upload photo');
          },
        }
      );
    }
  };

  const handleDelete = (photoURL: string) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDeletingPhotoURL(photoURL);
          await deletePhoto(
            { venueID, photoURL },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: ['get-venue-photos', { venueID }],
                });
              },
              onError: () => {
                Alert.alert('Delete Failed', 'Failed to delete photo');
              },
              onSettled: () => {
                setDeletingPhotoURL(null);
              },
            }
          );
        },
      },
    ]);
  };

  return (
    <>
      <ScrollView className="flex-1 bg-white p-4">
        <View className="flex-row flex-wrap gap-2">
          {loadingPhotos ? (
            <ActivityIndicator />
          ) : (
            photosData?.data?.map((url, index) => (
              <View key={index} className="relative">
                <Image source={{ uri: url }} className="size-32 rounded-lg" />
                {deletingPhotoURL === url ? (
                  <View className="absolute inset-0 items-center justify-center rounded-lg bg-black/40">
                    <ActivityIndicator color="red" size={'large'} />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => handleDelete(url)}
                    className="absolute right-1 top-1 rounded-full bg-black/60 p-1"
                  >
                    <Trash2Icon size={18} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
          {(photosData?.data?.length ?? 0) < 7 && (
            <TouchableOpacity
              onPress={handlePickImage}
              className="size-32 items-center justify-center rounded-lg border border-dashed border-gray-400"
            >
              {uploading ? (
                <ActivityIndicator color={'green'} size={'large'} />
              ) : (
                <>
                  <PlusIcon size={24} color="gray" />
                  <Text className="mt-1 text-sm text-gray-500">Add</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </>
  );
}
