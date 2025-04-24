import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { Alert } from 'react-native';

import { useToggleMatchFull } from '@/api/games/use-toggle-matchfull';

type ToggleMatchFullButtonProps = {
  gameId: string;
  matchFull: boolean;
  setMatchFull: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ToggleMatchFullButton({
  gameId,
  matchFull,
  setMatchFull,
}: ToggleMatchFullButtonProps) {
  const queryClient = useQueryClient();

  const { mutate: toggleMatchFullMutation, isPending } = useToggleMatchFull({
    onSuccess: () => {
      // Flip matchFull state
      setMatchFull((prev) => !prev);

      // Optionally re-fetch or invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['singleGame', { id: gameId }],
      });

      Alert.alert('Success', 'Match full status updated');
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || 'Failed to update match full status.';
      Alert.alert('Error', errorMessage);
    },
  });

  const handleToggle = () => {
    // Fire the mutation
    toggleMatchFullMutation({ gameId });
  };

  return (
    <FontAwesome
      onPress={handleToggle}
      name={matchFull ? 'toggle-on' : 'toggle-off'}
      size={24}
      color="white"
      style={{ opacity: isPending ? 0.5 : 1 }}
    />
  );
}
