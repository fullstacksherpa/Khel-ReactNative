import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';

import CustomHeader from '@/components/custom-header';

type FAQItem = {
  question: string;
  answer: string;
};

const data: FAQItem[] = [
  {
    question: 'Can I join any game that I like?',
    answer:
      'Yes, but the game admin has the privilege to accept or reject your request.',
  },
  {
    question: 'Can I host a game?',
    answer:
      'Of course! You can host a game and let others join. You can also book a venue to ensure your game has a place to play.',
  },
  {
    question: 'What should I do if a player doesn’t show up?',
    answer:
      'It’s up to the game admin to manage the players. We aim to keep Khel open and fair for everyone. One way we maintain quality is by giving admins the ability to accept or reject players.',
  },
  {
    question:
      'What should I do if the game admin cancels the game at the last minute?',
    answer:
      'Life can be unpredictable and emergencies happen. We encourage players to be understanding and either join another nearby game or create one themselves.',
  },
  {
    question: 'What should I do if no venues are available?',
    answer:
      'We recommend checking nearby venues or booking earlier next time to secure your preferred slot.',
  },
];

export default function FAQPlayersScreen() {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Toggle function
  const handleToggle = (index: number) => {
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const renderItem = ({ item, index }: { item: FAQItem; index: number }) => {
    const isExpanded = expandedIndex === index;

    return (
      <View className="mb-2 border-b border-gray-200">
        <Stack.Screen options={{ headerShown: false }} />
        <Pressable
          onPress={() => handleToggle(index)}
          className="flex-row items-center justify-between py-3"
        >
          <Text className="text-base font-medium text-gray-800">
            {item.question}
          </Text>
          {/* You could add an icon or arrow here to indicate expansion */}
        </Pressable>

        {isExpanded && (
          <Text className="pb-3 text-sm text-gray-600">{item.answer}</Text>
        )}
      </View>
    );
  };

  return (
    <>
      <CustomHeader>
        <View style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 25 }}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </Pressable>
            <Text className="text-xl font-bold text-white">Meet Players</Text>
          </View>
        </View>
      </CustomHeader>
      <View className="flex-1 bg-white p-4">
        {/* FAQ List */}
        <FlatList
          data={data}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
}
