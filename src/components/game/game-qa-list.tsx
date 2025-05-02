import React from 'react';
import { ActivityIndicator, Button, Text, View } from 'react-native';

import { useGetGameQA } from '@/api/games/get-game-qa';

type Props = {
  gameID: string;
};

export const GameQAList: React.FC<Props> = ({ gameID }) => {
  const { data, isLoading, error, refetch } = useGetGameQA({
    variables: { gameID },
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Failed to load Q&A</Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  return (
    <View className="flex-1 p-2">
      {data?.data.length === 0 ? (
        <View className="my-3">
          <Text className="text-center text-base text-gray-500">
            There are no queries yet! Queries sent by players will be shown here
          </Text>
        </View>
      ) : (
        data?.data.map((qa) => (
          <View key={qa.id} className="mb-4 rounded-lg bg-gray-100 p-4">
            <Text className="mb-1 font-bold"> {qa.question}</Text>
            {(qa.replies || []).map((reply) => (
              <View key={reply.id} className="mt-1 pl-3">
                <Text className="italic"> Admin: {reply.reply}</Text>
              </View>
            ))}
          </View>
        ))
      )}
    </View>
  );
};
