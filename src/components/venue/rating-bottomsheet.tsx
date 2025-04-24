import Fontisto from '@expo/vector-icons/Fontisto';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Button } from '@/components/ui';

interface RatingBottomSheetProps {
  isOpen: boolean;
  name: string;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
  isReviewSubmitting: boolean;
}

// eslint-disable-next-line max-lines-per-function
const RatingBottomSheet: React.FC<RatingBottomSheetProps> = ({
  isOpen,
  onClose,
  onSubmit,
  name,
  isReviewSubmitting,
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>('');

  useEffect(() => {
    if (isOpen && bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    } else if (!isOpen && bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  }, [isOpen]);

  const handleStarPress = (star: number) => {
    setRating(star);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      Alert.alert('Validation Error', 'Please select a rating.');
      return;
    }
    // Call the submit callback with the selected rating and review.
    onSubmit(rating, review);
    // Reset states after submission.
    setRating(0);
    setReview('');
    if (!isReviewSubmitting) {
      onClose();
    }
  };

  const getRatingMessage = () => {
    switch (rating) {
      case 5:
        return 'Excellent! Glad you loved it.';
      case 4:
        return 'Great! Thanks for the positive vibes.';
      case 3:
        return 'Good! Let us know how we can be better.';
      case 2:
        return 'Thanks! We’d love to improve.';
      case 1:
        return 'Sorry to hear that. We’re listening.';
      default:
        return 'Your rating/review is anonymous.';
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isOpen ? 0 : -1}
      snapPoints={[600]}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={{ backgroundColor: '#FEFCFF' }}
    >
      <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
        <Text
          style={{
            fontSize: 19,
            fontWeight: '400',
            color: 'black',
            alignSelf: 'center',
          }}
        >
          {`We’d love your feedback on ${name} ?`}
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
          placeholder="Leave a review"
          placeholderTextColor="gray"
          value={review}
          onChangeText={setReview}
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
          loading={isReviewSubmitting}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default RatingBottomSheet;
