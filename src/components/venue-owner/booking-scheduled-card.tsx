// components/venue-owner/BookingCard.tsx
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Image, Linking, Text, TouchableOpacity, View } from 'react-native';

import { type ScheduledBooking } from '@/api/owner-booking/use-scheduled-bookings';
import { formatKathmandu } from '@/lib/date-utils';

interface Props {
  booking: ScheduledBooking;
}

// eslint-disable-next-line max-lines-per-function
const ScheduledCard: React.FC<Props> = ({ booking }) => {
  const {
    booking_id,
    user_name,
    user_image,
    user_number,
    price,
    accepted_at,
    start_time,
    end_time,
  } = booking;

  const formattedAccepted = formatKathmandu(accepted_at, 'dd MMM, h:mm a');
  const formattedRange = `${formatKathmandu(start_time, 'h:mm a')} - ${formatKathmandu(end_time, 'h:mm a')}`;

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
              Accepted At: {formattedAccepted}
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
    </View>
  );
};

export default ScheduledCard;
