import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';
import { ActivityIndicator, Alert, Pressable } from 'react-native';

import { queryClient } from '@/api/common/api-provider';
import { useRemoveShortlistGame } from '@/api/games/use-remove-shortlist';

type RemoveShortlistButtonProps = {
  gameID: number;
};

export function RemoveShortlistButton({ gameID }: RemoveShortlistButtonProps) {
  const { mutate: removeShortlistGame, isPending } = useRemoveShortlistGame({
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
      'Remove from Shortlist',
      'Are you sure you want to remove this game from your shortlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => removeShortlistGame({ gameID }) },
      ]
    );
  };

  return (
    <Pressable onPress={handlePress} disabled={isPending}>
      {isPending ? (
        <ActivityIndicator color="#000" />
      ) : (
        <FontAwesome name="bookmark" size={24} color="black" />
      )}
    </Pressable>
  );
}
