// VenueReviewsSheet.tsx
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useDeleteVenueReview } from '@/api/venues/use-delete-review';
import { useVenueReviews } from '@/api/venues/use-venues-reviews';
import { getUserId } from '@/lib/auth/utils';

// Helper: format the review date to Kathmandu (Asia/Kathmandu timezone)
const formatReviewDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    timeZone: 'Asia/Kathmandu',
  });
};

type Review = {
  id: number;
  venue_id: number;
  user_id: number;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user_name?: string;
  avatar_url?: string | null;
};

type VenueReviewsSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  venueID: number;
};

type ReviewItemProps = {
  review: Review;
  isCurrentUser: boolean;
  onDelete: (review: Review) => void;
};

const ReviewItem: React.FC<ReviewItemProps> = ({
  review,
  isCurrentUser,
  onDelete,
}) => {
  return (
    <View style={styles.reviewContainer}>
      <View style={styles.header}>
        {review.avatar_url ? (
          <Image source={{ uri: review.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholder]}>
            <Text style={styles.avatarText}>
              {review.user_name
                ? review.user_name.charAt(0).toUpperCase()
                : '?'}
            </Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{review.user_name || 'Anonymous'}</Text>
          <Text style={styles.reviewDate}>
            {formatReviewDate(review.created_at)}
          </Text>
        </View>
        {isCurrentUser && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => onDelete(review)}
              style={styles.actionButton}
            >
              <Text style={[styles.actionText, { color: 'red' }]}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <Text style={styles.comment}>{review.comment}</Text>
    </View>
  );
};

// eslint-disable-next-line max-lines-per-function
export default function VenueReviewsSheet({
  bottomSheetRef,
  venueID,
}: VenueReviewsSheetProps) {
  const { data, isLoading, isError, refetch } = useVenueReviews({
    variables: { venueID },
  });
  const deleteReviewMutation = useDeleteVenueReview();
  const currentUserId = getUserId();

  // Handler for delete action with confirmation alert
  const handleDelete = (review: Review) => {
    Alert.alert(
      'Delete Review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            deleteReviewMutation.mutate(
              { venueID, reviewID: review.id },
              {
                onSuccess: () => {
                  Alert.alert('Success', 'Review deleted successfully.');
                  refetch();
                },
                onError: (error: unknown) => {
                  Alert.alert('Error', 'Failed to delete review.');
                  console.error(error);
                },
              }
            );
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  if (isLoading) {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['80%']}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
      >
        <ActivityIndicator size="large" style={styles.loadingIndicator} />
      </BottomSheet>
    );
  }

  if (isError) {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={['80%']}
        enablePanDownToClose
        backgroundStyle={styles.bottomSheetBackground}
      >
        <View style={styles.centeredView}>
          <Text style={styles.errorText}>Failed to load reviews.</Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  }

  const reviews: Review[] = data?.data.reviews || [];
  // Move current user's reviews to the top.
  const myReviews = reviews.filter(
    (review) => review.user_id === Number(currentUserId)
  );
  const otherReviews = reviews.filter(
    (review) => review.user_id !== Number(currentUserId)
  );
  const sortedReviews = [...myReviews, ...otherReviews];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['80%']}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>
          Reviews ({data?.data.total_reviews}) – Average: {data?.data.average}{' '}
          ⭐
        </Text>
      </View>
      <BottomSheetFlatList
        data={sortedReviews}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <ReviewItem
            review={item}
            isCurrentUser={item.user_id === Number(currentUserId)}
            onDelete={handleDelete}
          />
        )}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#efefef',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
  },
  retryButton: {
    marginTop: 8,
  },
  retryText: {
    color: 'blue',
  },
  headerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  reviewContainer: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  placeholder: {
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
  },
  reviewDate: {
    fontSize: 12,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 10,
    padding: 4,
  },
  actionText: {
    fontSize: 14,
    color: 'blue',
  },
  comment: {
    fontSize: 14,
    marginTop: 4,
  },
});
