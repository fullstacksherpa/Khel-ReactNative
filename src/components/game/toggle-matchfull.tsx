import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native';

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
      setMatchFull((prev) => !prev);
      queryClient.invalidateQueries({
        queryKey: ['singleGame', { id: gameId }],
      });
      Alert.alert('Success', 'Match full status updated');
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update match full status.';
      Alert.alert('Error', errorMessage);
    },
  });

  const handleConfirmToggle = () => {
    Alert.alert(
      matchFull ? 'Mark as Open?' : 'Mark as Full?',
      `Are you sure you want to ${matchFull ? 'mark this game as open' : 'mark it as full'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => toggleMatchFullMutation({ gameId }),
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <TouchableOpacity
      onPress={handleConfirmToggle}
      disabled={isPending}
      className={`mt-4 flex-row items-center justify-center rounded-xl px-4 py-2 ${
        matchFull ? 'bg-green-600' : 'bg-red-500'
      } ${isPending ? 'opacity-50' : 'opacity-100'}`}
    >
      {isPending ? (
        <ActivityIndicator color="white" />
      ) : (
        <>
          <FontAwesome
            name={matchFull ? 'toggle-on' : 'toggle-off'}
            size={24}
            color="white"
          />
          <Text className="ml-2 font-medium text-white">
            {matchFull ? 'Set Open' : 'Set Full'}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
