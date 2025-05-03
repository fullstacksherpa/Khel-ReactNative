import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { ActivityIndicator, Alert, Pressable } from 'react-native';

import { queryClient } from '@/api/common/api-provider';
import { useShortlistGame } from '@/api/games/use-shortlist-game';

type ShortlistButtonProps = {
  gameID: number;
};

export function AddShortlistButton({ gameID }: ShortlistButtonProps) {
  const { mutate: shortlistGame, isPending } = useShortlistGame({
    onSuccess: (response) => {
      Alert.alert('Success', response.data.message);
      queryClient.invalidateQueries({ queryKey: ['infinite-games'] });
      queryClient.invalidateQueries({ queryKey: ['all-shortlisted-games'] });
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || 'Something went wrong.';
      Alert.alert('Error', errorMessage);
    },
  });

  const handlePress = () => {
    Alert.alert(
      'Add to Shortlist',
      'Do you want to add this game to your shortlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => shortlistGame({ gameID }) },
      ]
    );
  };

  return (
    <Pressable onPress={handlePress} disabled={isPending}>
      {isPending ? (
        <ActivityIndicator color="#000" />
      ) : (
        <Feather name="bookmark" size={24} color="black" />
      )}
    </Pressable>
  );
}
