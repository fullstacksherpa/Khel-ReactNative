import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  type PendingBooking,
  usePendingBookings,
} from '@/api/owner-booking/use-pending-bookings';
import { DateSelector } from '@/components/booking/date-selector';
import { formatKathmandu, generateDatesArray } from '@/lib/date-utils';

import CustomHeader from '../custom-header';

interface TabButtonProps {
  title: string;
  selected: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ title, selected, onPress }) => (
  <TouchableOpacity
    className={`flex-1 items-center border-b-2 px-4 py-2 ${
      selected ? 'border-black' : 'border-transparent'
    }`}
    onPress={onPress}
  >
    <Text className={`${selected ? 'text-black' : 'text-gray-500'} text-lg`}>
      {title}
    </Text>
  </TouchableOpacity>
);

interface BookingCardProps {
  booking: PendingBooking;
}

// eslint-disable-next-line max-lines-per-function
const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const {
    user_name,
    user_image,
    user_number,
    booking_id,
    price,
    requested_at,
    start_time,
    end_time,
  } = booking;

  const formattedRequested = formatKathmandu(requested_at, 'dd MMM, h:mm a');
  const formattedRange = `${new Date(start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

  return (
    <View className="mb-4 rounded-2xl border border-gray-400 bg-white p-4 ">
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-row items-center">
          {user_image ? (
            <Image
              source={{ uri: user_image }}
              className="mr-3 size-10 rounded-full"
            />
          ) : (
            <View className="mr-3 size-10 items-center justify-center rounded-full bg-gray-200">
              <Text className="text-gray-600">{user_name.charAt(0)}</Text>
            </View>
          )}
          <View>
            <Text className="text-base font-semibold">{user_name}</Text>
            <Text className="text-sm text-gray-500">
              Requested: {formattedRequested}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:+977${user_number}`)}
        >
          <FontAwesome5 name="phone-alt" size={24} color="#808080" />
        </TouchableOpacity>
      </View>

      <Text className="mb-1 text-gray-700">
        Booking #{booking_id} {'      '} • ₹{price}
      </Text>
      <Text className="mb-4 text-gray-600">{formattedRange}</Text>

      <View className="flex-row items-center justify-between">
        <TouchableOpacity
          className="rounded-xl border border-gray-300 px-4 py-2"
          onPress={() => {
            /* TODO: reject handler */
          }}
        >
          <Text className="text-gray-700">Reject</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-xl bg-successGreen px-4 py-2"
          onPress={() => {
            /* TODO: accept handler */
          }}
        >
          <Text className="text-white">Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// eslint-disable-next-line max-lines-per-function
const PendingBookingsScreen: React.FC = () => {
  const router = useRouter();
  const venueID = 5;
  const dates = useMemo(() => generateDatesArray(10), []);
  const [selectedDate, setSelectedDate] = useState(dates[0].fullDate);
  const isoDate = selectedDate.slice(0, 10);
  const [activeTab, setActiveTab] = useState<'requests' | 'scheduled'>(
    'requests'
  );
  const initialOption = 'Home';
  const [option, setOption] = useState(initialOption);

  const { data, isLoading, error } = usePendingBookings({
    variables: { venueID: venueID.toString(), date: isoDate },
  });

  console.log(data);

  return (
    <>
      <CustomHeader>
        <View style={{ padding: 12 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>
                Next
              </Text>
            </View>

            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <Ionicons name="chatbox-outline" size={24} color="white" />
              <Ionicons name="notifications-outline" size={24} color="white" />
              <Pressable onPress={() => router.push('/view-profile')}>
                <Image
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                  source={{
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJqcSD_2qz834cW2RuNWmvAbOMwcZdWSf81Q&s',
                  }}
                />
              </Pressable>
            </View>
          </View>

          {/* Horizontal Sport Picker */}
          <View style={{ marginVertical: 7 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                'Home',
                'Update Venue',
                'Analytics',
                'Pricing',
                'Set Offer',
              ].map((s) => (
                <Pressable
                  key={s}
                  onPress={() => setOption(s)}
                  style={{
                    padding: 10,
                    borderColor: 'white',
                    borderWidth: option === s ? 0 : 1,
                    marginRight: 10,
                    borderRadius: 8,
                    backgroundColor: option === s ? '#1dbf22' : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontWeight: '600',
                      fontSize: 15,
                    }}
                  >
                    {s}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </CustomHeader>
      <View className=" bg-gray-50">
        <DateSelector
          dates={dates}
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />

        {/* Tab selector */}
        <View className="flex-row border-b border-gray-200">
          <TabButton
            title="Requests"
            selected={activeTab === 'requests'}
            onPress={() => setActiveTab('requests')}
          />
          <TabButton
            title="Scheduled"
            selected={activeTab === 'scheduled'}
            onPress={() => setActiveTab('scheduled')}
          />
        </View>
      </View>

      {/* Content */}
      <View className="mt-4 flex-1 px-3">
        {activeTab === 'requests' &&
          (isLoading ? (
            <ActivityIndicator size="large" color="green" />
          ) : error ? (
            <Text className="text-red-500">Failed to load requests.</Text>
          ) : (
            <FlatList<PendingBooking>
              data={data?.data ?? []}
              keyExtractor={(item) => item.booking_id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => <BookingCard booking={item} />}
            />
          ))}

        {activeTab === 'scheduled' && (
          <Text className="text-center text-gray-500">
            No scheduled items yet.
          </Text>
        )}
      </View>
    </>
  );
};

export default PendingBookingsScreen;
