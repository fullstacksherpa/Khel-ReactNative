import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';

import { useSubmitReview } from '@/api/app-reviews/use-submit-review';
import { Button } from '@/components/ui';

// eslint-disable-next-line max-lines-per-function
const AppFeedback: React.FC = () => {
  const router = useRouter();
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  const submitReview = useSubmitReview();

  const handleStarPress = (star: number) => {
    setRating(star);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Validation Error', 'Please select a rating.');
      return;
    }

    submitReview.mutate(
      { rating, feedback },
      {
        onSuccess: () => {
          showMessage({
            message: 'Review submitted successfully! 🎉',
            type: 'success',
          });
          setTimeout(() => {
            router.back();
            setRating(0);
            setFeedback('');
          }, 2000);
        },
        onError: (error) => {
          showMessage({
            message: 'Failed to submit review',
            description: error.message,
            type: 'danger',
          });
        },
      }
    );
  };

  const getRatingMessage = () => {
    switch (rating) {
      case 5:
        return 'Awesome! We’re thrilled you loved it.';
      case 4:
        return 'Great! Thanks for your support.';
      case 3:
        return 'Good! Tell us how we can make it even better.';
      case 2:
        return 'Thanks for your feedback — we’re working to improve.';
      case 1:
        return 'We’re sorry to hear that. We’re here to listen.';
      default:
        return 'Help us improve and grow our community!';
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        gap: 20,
        paddingTop: Platform.OS === 'ios' ? 55 : StatusBar.currentHeight || 0,
      }}
    >
      <View>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="black" />
        </Pressable>
      </View>
      <Text
        style={{
          fontSize: 19,
          fontWeight: '400',
          color: 'black',
          alignSelf: 'center',
        }}
      >
        Your opinion matters to us
      </Text>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginVertical: 7,
        }}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
            <Fontisto
              name="star"
              size={40}
              color={star <= rating ? '#22C55E' : '#bebebe'}
              style={{ marginHorizontal: 4 }}
            />
          </TouchableOpacity>
        ))}
      </View>
      <Text
        style={{
          textAlign: 'center',
          fontSize: 16,
          color: 'gray',
          marginTop: 8,
        }}
      >
        {getRatingMessage()}
      </Text>
      <TextInput
        placeholder="Leave a comment or suggestion for us.."
        placeholderTextColor="gray"
        value={feedback}
        onChangeText={setFeedback}
        style={{
          borderWidth: 1,
          borderColor: 'gray',
          padding: 10,
          marginVertical: 10,
          borderRadius: 5,
          color: 'black',
          height: 80,
          textAlignVertical: 'top',
        }}
        multiline
      />
      <Button
        className="my-2 rounded-3xl bg-green-500"
        textClassName="text-2xl"
        label={'Share Experience'}
        onPress={handleSubmit}
      />
    </View>
  );
};

export default AppFeedback;
