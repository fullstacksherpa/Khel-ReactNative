import Fontisto from '@expo/vector-icons/Fontisto';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface RatingBottomSheetProps {
  isOpen: boolean;
  name: string;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
}

// eslint-disable-next-line max-lines-per-function
const RatingBottomSheet: React.FC<RatingBottomSheetProps> = ({
  isOpen,
  onClose,
  onSubmit,
  name,
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
    onClose();
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isOpen ? 0 : -1}
      snapPoints={[400]}
      enablePanDownToClose
      onClose={onClose}
      backgroundStyle={{ backgroundColor: '#F0F7FF' }}
    >
      <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: '600',
            color: 'black',
            alignSelf: 'center',
          }}
        >
          {`Rate ${name}`}
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
                color={star <= rating ? '#F59E0B' : 'gray'}
                style={{ marginHorizontal: 4 }}
              />
            </TouchableOpacity>
          ))}
        </View>
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
        <Button title="Submit" onPress={handleSubmit} />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default RatingBottomSheet;
