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
    question: 'Can I list my venue here?',
    answer:
      'Yes, but your venue will only be displayed after verification, which typically takes around 5 hours.',
  },
  {
    question: 'How will I know if my venue is verified?',
    answer:
      'We’ll notify you via email once your venue has been successfully verified.',
  },
  {
    question: 'How do I book a venue for a game?',
    answer:
      'Booking a venue is straightforward. Simply go to the "Venues" tab, select the venue you’d like to book, tap the "Book" button, and follow the instructions.',
  },
  {
    question: 'Is the booking confirmed immediately?',
    answer:
      'Not immediately. The venue owner has the right to accept or reject your booking request. This helps prevent false or spam bookings.',
  },
  {
    question: 'Do I have to pay before placing a booking?',
    answer:
      'No, you can request a booking without upfront payment. Expect a call from the venue owner to confirm the details, or you can message them directly through the app.',
  },
];

export default function FAQVenuesScreen() {
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
            <Text className="text-xl font-bold text-white">Venues</Text>
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
