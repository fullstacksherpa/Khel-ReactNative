// components/venue-owner/BookingCard.tsx
import { FontAwesome5 } from '@expo/vector-icons';
import {
  type QueryObserverResult,
  type RefetchOptions,
} from '@tanstack/react-query';
import { type AxiosError } from 'axios';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  useAcceptBooking,
  useRejectBooking,
} from '@/api/owner-booking/use-accept-reject-booking';
import {
  type PendingBooking,
  type PendingBookingsResponse,
} from '@/api/owner-booking/use-pending-bookings';
import { type APIError } from '@/api/types';
import { formatKathmandu } from '@/lib/date-utils';

interface Props {
  venueID: number | string;
  booking: PendingBooking;
  refetch: (
    options?: RefetchOptions
  ) => Promise<
    QueryObserverResult<PendingBookingsResponse, AxiosError<APIError, any>>
  >;
}

// eslint-disable-next-line max-lines-per-function
const BookingCard: React.FC<Props> = ({ venueID, booking, refetch }) => {
  const {
    booking_id,
    user_name,
    user_image,
    user_number,
    price,
    requested_at,
    start_time,
    end_time,
  } = booking;

  const formattedRequested = formatKathmandu(requested_at, 'dd MMM, h:mm a');
  const formattedRange = `${formatKathmandu(start_time, 'h:mm a')} - ${formatKathmandu(end_time, 'h:mm a')}`;

  const { mutate: acceptBooking, isPending: isAccepting } = useAcceptBooking({
    onSuccess: () => {
      refetch();
      Alert.alert('Success', 'Booking accepted.');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to accept booking.');
    },
  });

  const { mutate: rejectBooking, isPending: isRejecting } = useRejectBooking({
    onSuccess: () => {
      refetch();
      Alert.alert('Success', 'Booking rejected.');
    },
    onError: () => {
      Alert.alert('Error', 'Failed to reject booking.');
    },
  });

  const confirmAccept = () => {
    Alert.alert(
      'Confirm Accept',
      'Are you sure you want to accept this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => acceptBooking({ venueID, bookingID: booking_id }),
        },
      ]
    );
  };

  const confirmReject = () => {
    Alert.alert(
      'Confirm Reject',
      'Are you sure you want to reject this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => rejectBooking({ venueID, bookingID: booking_id }),
        },
      ]
    );
  };

  const handleCall = () => {
    Linking.openURL(`tel:+977${user_number}`);
  };

  return (
    <View className="mb-4 rounded-2xl border border-gray-400 bg-white p-4">
      {/* Header */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          {user_image ? (
            <Image
              source={{ uri: user_image }}
              className="mr-3 size-10 rounded-full"
            />
          ) : (
            <View className="mr-3 size-10 items-center justify-center rounded-full bg-gray-200">
              <Text className="font-semibold text-gray-600">
                {user_name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <View>
            <Text className="text-base font-semibold text-gray-800">
              {user_name}
            </Text>
            <Text className="text-sm text-gray-500">
              Requested: {formattedRequested}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleCall} className="p-2">
          <FontAwesome5 name="phone-alt" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>

      {/* Booking Info */}
      <Text className="mb-1 text-gray-700">
        Booking #{booking_id} • ₹{price}
      </Text>
      <Text className="mb-4 text-gray-600">{formattedRange}</Text>

      {/* Actions */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={confirmReject}
          disabled={isRejecting || isAccepting}
          className="mr-2 flex-1 items-center rounded-xl border border-red-400 px-4 py-2"
        >
          {isRejecting ? (
            <ActivityIndicator color="#DC2626" />
          ) : (
            <Text className="font-medium text-red-600">Reject</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={confirmAccept}
          disabled={isAccepting || isRejecting}
          className="ml-2 flex-1 items-center rounded-xl bg-green-600 px-4 py-2"
        >
          {isAccepting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="font-medium text-white">Accept</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingCard;
