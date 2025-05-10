// app/(tabs)/index.tsx
import React from 'react';

import UserHome from '@/components/home/user-home';
import VenueOwnerHome from '@/components/home/venue-ower-home';

const isVenueOwner = true;

export default function Home() {
  return isVenueOwner ? <VenueOwnerHome /> : <UserHome />;
}
