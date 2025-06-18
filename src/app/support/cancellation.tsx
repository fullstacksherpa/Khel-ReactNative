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
    question: 'Can I cancel my venue booking?',
    answer:
      'Yes, you can cancel your booking. However, please avoid frequent cancellations, as venue owners may choose not to accept your booking requests in the future.',
  },
  {
    question: 'Will I get a full refund after cancelling a booking?',
    answer:
      'It depends on the venue’s cancellation policy. Please review the policy details before cancelling.',
  },
];

export default function FAQCancellationScreen() {
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
            <Text className="text-xl font-bold text-white">
              Cancellation & Refunds
            </Text>
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
