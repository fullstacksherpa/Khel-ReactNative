import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useCreateReply } from '@/api/games/create-reply';
import { useGetGameQA } from '@/api/games/get-game-qa';
import CustomHeader from '@/components/custom-header';

// eslint-disable-next-line max-lines-per-function
export default function GameQAScreen() {
  const router = useRouter();
  const { gameID } = useLocalSearchParams();

  // Normalize gameID to always be a string
  const normalizedGameID = Array.isArray(gameID) ? gameID[0] : gameID;

  // Fetch questions with replies
  const { data, isLoading, refetch } = useGetGameQA({
    variables: { gameID: normalizedGameID },
  });
  // Reply mutation hook
  const createReply = useCreateReply();

  // Maintain a map of reply texts keyed by question ID
  const [replyTexts, setReplyTexts] = useState<Record<number, string>>({});

  const handleReplyChange = (questionID: number, text: string) => {
    setReplyTexts((prev) => ({ ...prev, [questionID]: text }));
  };

  const handleReply = async (questionID: number) => {
    const text = replyTexts[questionID];
    if (!text || !text.trim()) {
      Alert.alert('Validation', 'Please enter a reply.');
      return;
    }
    try {
      // Call the reply mutation. Note the questionID is passed as a string.
      await createReply.mutateAsync({
        gameID: normalizedGameID,
        questionID: questionID.toString(),
        reply: text,
      });
      // Clear the reply input for that question and refresh the list
      setReplyTexts((prev) => ({ ...prev, [questionID]: '' }));
      refetch();
    } catch (error) {
      Alert.alert('Error', 'Failed to send reply. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <CustomHeader>
        <View style={{ paddingHorizontal: 12, paddingVertical: 23 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </Pressable>

            <View className="ml-9 items-center self-center rounded-2xl">
              <Text className="pl-12 text-2xl font-semibold tracking-wider text-white">
                Reply Message
              </Text>
            </View>
          </View>
        </View>
      </CustomHeader>
      <ScrollView className="flex-1 bg-white p-4">
        {data?.data.length === 0 ? (
          <Text className="text-center text-lg text-gray-500">
            No questions have been posted.
          </Text>
        ) : (
          data?.data.map((question) => (
            <View key={question.id} className="mb-4 rounded-lg bg-gray-100 p-4">
              <Text className="mb-2 text-lg font-bold">
                {question.question}
              </Text>
              {question.replies && question.replies.length > 0 ? (
                question.replies.map((reply) => (
                  <View
                    key={reply.id}
                    className="mb-2 rounded bg-white p-2 shadow"
                  >
                    <Text className="text-sm">{reply.reply}</Text>
                    <Text className="text-xs text-gray-500">
                      {new Date(reply.created_at).toLocaleString()}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="mb-2 text-sm text-gray-500">
                  No replies yet.
                </Text>
              )}
              <View className="flex-row items-center">
                <TextInput
                  className="flex-1 rounded border border-gray-300 p-2"
                  placeholder="Type your reply..."
                  value={replyTexts[question.id] || ''}
                  onChangeText={(text) => handleReplyChange(question.id, text)}
                />
                <TouchableOpacity
                  onPress={() => handleReply(question.id)}
                  className="ml-2 rounded bg-blue-500 p-2"
                >
                  <Text className="text-white">Reply</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
}
