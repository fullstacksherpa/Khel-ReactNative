import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import UpdateVenueScreen from '@/app/update-venue-screen';
import { DateSelector } from '@/components/booking/date-selector';
import CustomHeader from '@/components/custom-header';
import OptionTabs from '@/components/venue-owner/options-tabs';
import TabSelector from '@/components/venue-owner/tab-selector';
import { generateDatesArray } from '@/lib/date-utils';

import { PendingTab } from '../venue-owner/pending-tab';
import { ScheduledTab } from '../venue-owner/scheduled-tabs';
import VenuePhotosScreen from '../venue-owner/venue-photo-screen';

type props = {
  venueID: number;
};

// eslint-disable-next-line max-lines-per-function
const VenueOwnerHomeScreen: React.FC<props> = ({ venueID }) => {
  console.log(`VenueID from venueOwnerHome ⛔️ : ${venueID}`);
  const router = useRouter();

  useEffect(() => {
    setOption('Home');
  }, []);

  const dates = useMemo(() => generateDatesArray(10), []);
  const [selectedDate, setSelectedDate] = useState(dates[0].fullDate);
  const isoDate = selectedDate.slice(0, 10);
  const [activeTab, setActiveTab] = useState<'requests' | 'scheduled'>(
    'requests'
  );
  const [option, setOption] = useState<
    'Home' | 'Update Venue' | 'Update Images' | 'Pricing' | 'Set Offer'
  >('Home');

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
              <PendingTab venueID={venueID} date={isoDate} />
            ) : (
              <ScheduledTab venueID={venueID} date={isoDate} />
            )}
          </View>
        </>
      )}

      {option === 'Update Venue' && (
        <UpdateVenueScreen venueID={venueID} setOption={setOption} />
      )}
      {option === 'Update Images' && <VenuePhotosScreen venueID={venueID} />}
      {option === 'Pricing' && <Text>Pricing</Text>}
    </>
  );
};

export default VenueOwnerHomeScreen;
