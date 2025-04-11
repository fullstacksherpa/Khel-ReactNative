import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import React from 'react';

import { useGameVenue } from '@/lib/games-venues-store';

import VenueCard from '../venue/venue-card';

// eslint-disable-next-line max-lines-per-function
export default function SelectedVenueSheet() {
  const { selectedVenue, setSelectedVenue } = useGameVenue();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = React.useMemo(() => [110], []);

  useEffect(() => {
    if (selectedVenue && bottomSheetRef.current) {
      console.log('opening bottom sheet .......................');
      bottomSheetRef.current.expand();
    } else if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  }, [selectedVenue]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={selectedVenue ? 0 : -1} // Directly control visibility via state
      snapPoints={snapPoints}
      enablePanDownToClose
      onChange={(index) => {
        if (index === -1) {
          setSelectedVenue(undefined);
        }
      }}
    >
      {selectedVenue && (
        <BottomSheetView>
          <VenueCard item={selectedVenue} />
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}
