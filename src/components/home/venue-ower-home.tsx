import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import type { PendingBooking } from '@/api/owner-booking/use-pending-bookings';
import { usePendingBookings } from '@/api/owner-booking/use-pending-bookings';
import { DateSelector } from '@/components/booking/date-selector';
import CustomHeader from '@/components/custom-header';
import BookingCard from '@/components/venue-owner/booking-request-card';
import OptionTabs from '@/components/venue-owner/options-tabs';
import TabSelector from '@/components/venue-owner/tab-selector';
import { generateDatesArray } from '@/lib/date-utils';

// eslint-disable-next-line max-lines-per-function
const VenueOwnerHomeScreen: React.FC = () => {
  const router = useRouter();
  const venueID = 5;
  const dates = useMemo(() => generateDatesArray(10), []);
  const [selectedDate, setSelectedDate] = useState(dates[0].fullDate);
  const isoDate = selectedDate.slice(0, 10);
  const [activeTab, setActiveTab] = useState<'requests' | 'scheduled'>(
    'requests'
  );
  const [option, setOption] = useState<
    'Home' | 'Update Venue' | 'Analytics' | 'Pricing' | 'Set Offer'
  >('Home');

  const { data, isLoading, error, refetch } = usePendingBookings({
    variables: { venueID: venueID.toString(), date: isoDate },
  });

  const bookings = data?.data ?? [];

  return (
    <>
      <CustomHeader>
        <OptionTabs selected={option} onSelect={setOption} router={router} />
      </CustomHeader>

      {option === 'Home' && (
        <>
          <View className="bg-gray-50">
            <DateSelector
              dates={dates}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />
            <TabSelector activeTab={activeTab} onChangeTab={setActiveTab} />
          </View>
          <View className="mt-1 flex-1 px-3">
            {activeTab === 'requests' ? (
              isLoading ? (
                <ActivityIndicator size="large" color="green" />
              ) : error ? (
                <Text className="text-red-500">Failed to load requests.</Text>
              ) : bookings.length === 0 ? (
                <Text className="mt-8 text-center text-gray-500">
                  No pending requests for this date.
                </Text>
              ) : (
                <FlatList<PendingBooking>
                  data={data?.data ?? []}
                  keyExtractor={(item) => item.booking_id.toString()}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <BookingCard
                      booking={item}
                      venueID={venueID}
                      refetch={refetch}
                    />
                  )}
                />
              )
            ) : (
              <Text className="pt-24 text-center text-gray-500">
                No scheduled booking yet.
              </Text>
            )}
          </View>
        </>
      )}

      {option === 'Update Venue' && <Text>Update Venue</Text>}
      {option === 'Analytics' && <Text>Analytics</Text>}
      {option === 'Pricing' && <Text>Pricing</Text>}
    </>
  );
};

export default VenueOwnerHomeScreen;
