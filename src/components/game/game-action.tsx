import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, Pressable, Text, TextInput, View } from 'react-native';

import { useGetGameQA } from '@/api/games/get-game-qa';
import { useCreateQuestion } from '@/api/games/use-create-question';
import { useJoinGame } from '@/api/games/use-join-game';

interface GameActionsProps {
  gameID: string;
}

// eslint-disable-next-line max-lines-per-function
const GameActions: React.FC<GameActionsProps> = ({ gameID }) => {
  const { refetch } = useGetGameQA({
    variables: { gameID },
  });
  const [isQuerySheetOpen, setIsQuerySheetOpen] = useState(false);

  const querySheetRef = useRef<BottomSheet>(null);

  const [queryMessage, setQueryMessage] = useState('');

  const { mutate: joinGame, isPending } = useJoinGame({
    onSuccess: (data) => {
      Alert.alert('Success', data.message); // Show the response message
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Something went wrong';
      Alert.alert('Error', message);
    },
  });

  const handlePress = () => {
    Alert.alert(
      'Confirm Join',
      'Are you sure you want to send a join request?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Send',
          onPress: () => joinGame({ gameID }),
          style: 'default',
        },
      ]
    );
  };

  const { mutate: sendQuestion, isPending: isPendingQuestion } =
    useCreateQuestion({
      onSuccess: () => {
        Alert.alert('Question Sent', 'Your question was submitted.');
        refetch();
      },
      onError: (error) => {
        const msg = error.response?.data?.message || 'Something went wrong';
        Alert.alert('Error', msg);
      },
    });

  useEffect(() => {
    if (isQuerySheetOpen) querySheetRef.current?.expand();
    else querySheetRef.current?.close();
  }, [isQuerySheetOpen]);

  const handleSendQuery = () => {
    if (!queryMessage.trim()) {
      Alert.alert('Please enter a question');
      return;
    }
    sendQuestion({ gameID, question: queryMessage });
    setQueryMessage('');
    setIsQuerySheetOpen(false);
  };

  return (
    <>
      <View className="flex flex-row justify-around pb-10">
        <Pressable
          style={{
            width: '41%',
            marginTop: 10,
            borderWidth: 1,
            borderColor: '#787878',
            padding: 10,
            borderRadius: 30,
            alignItems: 'center',
          }}
          onPress={() => setIsQuerySheetOpen(true)}
        >
          <Text>Ask a Question</Text>
        </Pressable>
        <Pressable
          onPress={handlePress}
          disabled={isPending}
          style={{
            width: '41%',
            marginTop: 10,
            backgroundColor: isPending ? 'gray' : 'green',
            borderWidth: 1,
            padding: 10,
            justifyContent: 'center',
            flexDirection: 'row',
            borderRadius: 30,
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Text
            style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}
          >
            {isPending ? 'Sending...' : 'Send Join Request'}
          </Text>
        </Pressable>
      </View>

      <BottomSheet
        ref={querySheetRef}
        index={-1}
        snapPoints={[400]}
        enablePanDownToClose
        onClose={() => setIsQuerySheetOpen(false)}
        backgroundStyle={{ backgroundColor: '#fff' }}
      >
        <BottomSheetView style={{ padding: 16, gap: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '600' }}>
            Ask a Question
          </Text>
          <TextInput
            placeholder="Ask us anything about this game?"
            value={queryMessage}
            onChangeText={setQueryMessage}
            style={{
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              borderRadius: 4,
              height: 90,
              fontSize: 20,
            }}
            multiline
            maxLength={120}
          />
          <Button
            title={isPendingQuestion ? 'Sending...' : 'Submit Question'}
            onPress={handleSendQuery}
            disabled={isPendingQuestion}
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

export default GameActions;
