import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import React from 'react';
import { View } from 'react-native';

import type { Venue } from '@/api/venues/types';

import VenueCard from '../venue/venue-card';

type Props = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  venue: Venue | null;
  onChange?: (index: number) => void;
};

// eslint-disable-next-line max-lines-per-function
export default function VenueDetailsBottomSheet({
  bottomSheetRef,
  venue,
  onChange,
}: Props) {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['40%']}
      index={-1}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: '#efefef' }}
      onChange={onChange}
    >
      <BottomSheetView>
        <View style={{ marginBottom: 5 }}>
          {venue && <VenueCard item={venue} />}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}
