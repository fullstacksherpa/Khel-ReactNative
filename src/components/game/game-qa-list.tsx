import React from 'react';
import { ActivityIndicator, Button, Text, TextInput, View } from 'react-native';

import { useGetGameQA } from '@/api/games/get-game-qa';
import { useCreateQuestion } from '@/api/games/use-create-question';

type Props = {
  gameID: string;
};

export const GameQAList: React.FC<Props> = ({ gameID }) => {
  const { data, isLoading, error, refetch } = useGetGameQA({
    variables: { gameID },
  });
  const createQuestion = useCreateQuestion();

  const [newQuestion, setNewQuestion] = React.useState('');

  const onSubmit = () => {
    if (!newQuestion.trim()) return;
    createQuestion.mutate(
      { gameID, question: newQuestion },
      {
        onSuccess: () => {
          setNewQuestion('');
          refetch();
        },
      }
    );
  };

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
      <View className="mb-3 flex-row">
        <TextInput
          className="mr-2 h-10 flex-1 rounded border border-gray-300 px-2"
          value={newQuestion}
          placeholder="Ask a question..."
          onChangeText={setNewQuestion}
        />
        <Button title="Send" onPress={onSubmit} />
      </View>

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
