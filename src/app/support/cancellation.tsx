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
    question: 'Can I log-in with 2 numbers/Accounts at the same time?',
    answer:
      'Yes, but you would typically need to sign out of one account before signing in to another.',
  },
  {
    question: 'How do I Reset/Delete my account?',
    answer:
      'Navigate to the account settings and look for the “Delete Account” or “Reset Account” option. Please note, you may require an email confirmation or additional verification steps.',
  },
  {
    question: 'How to change mobile number without losing my data?',
    answer:
      'Within the profile settings, there should be a section to update phone number. Make sure you have verified your email or other credentials so data remains synced to your account.',
  },
  {
    question: 'How to change my profile picture?',
    answer:
      'Open your profile page, tap on the existing profile picture, and select a new image from your device.',
  },
  {
    question: 'How to edit profile Information?',
    answer:
      'Go to your profile settings where you can edit personal information such as first name, last name, bio, contact info, etc.',
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
