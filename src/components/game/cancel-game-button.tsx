// components/CancelGameButton.tsx
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, Alert, Pressable, Text } from 'react-native';

import { useCancelGame } from '@/api/games/use-cancel-game';

type Props = {
  gameID: number;
  style?: object;
};

export const CancelGameButton: React.FC<Props> = ({ gameID, style }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useCancelGame({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['game-details', { gameID }],
      });
      Alert.alert('Success', 'Game cancelled successfully');
    },
    onError: (err) => {
      Alert.alert('Error', err.response?.data?.message ?? 'Failed to cancel');
    },
  });

  const confirmAndCancel = () => {
    Alert.alert(
      'Cancel Game?',
      'Are you sure you want to cancel this game? This action cannot be undone.',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, cancel it',
          style: 'destructive',
          onPress: () => mutate({ gameID }),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Pressable
      onPress={confirmAndCancel}
      disabled={isPending}
      style={[
        {
          backgroundColor: '#e1001e',
          marginTop: 10,
          marginBottom: 30,
          paddingHorizontal: 15,
          paddingVertical: 12,
          alignSelf: 'center',
          borderRadius: 6,
          opacity: isPending ? 0.6 : 1,
        },
        style,
      ]}
    >
      {isPending ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontSize: 14,
            fontWeight: '700',
          }}
        >
          Cancel Game
        </Text>
      )}
    </Pressable>
  );
};
