import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useIsVenueOwner } from '@/api/auth/use-is-venue-owner';
import UserHome from '@/components/home/user-home';
import VenueOwnerHome from '@/components/home/venue-ower-home';
import { useVenueStore } from '@/lib/store/venue';

export default function Home() {
  const { data, isLoading, isError } = useIsVenueOwner();
  const [venueID, setVenueID] = useState<number | null>(null);

  const setLastCreatedVenueID = useVenueStore(
    (state) => state.setLastCreatedVenueID
  );

  useEffect(() => {
    if (
      data?.isOwner &&
      Array.isArray(data.venueIDs) &&
      data.venueIDs.length > 0
    ) {
      setVenueID(data.venueIDs[0]);
      setLastCreatedVenueID(data.venueIDs[0]);
    }
  }, [data, setLastCreatedVenueID]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={'#22C55E'} />
      </View>
    );
  }

  if (isError || !data) {
    // fallback or error state if needed
    return <UserHome />;
  }

  return venueID !== null ? <VenueOwnerHome venueID={venueID} /> : <UserHome />;
}
