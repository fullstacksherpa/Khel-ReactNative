import scooterImage from '@assets/scooter.png';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useEffect, useRef } from 'react';
import { Button, Image, Text, View } from 'react-native';

import { useVenue } from '@/providers/venue-provider';

// eslint-disable-next-line max-lines-per-function
export default function SelectedVenueSheet() {
  const { selectedVenue, setSelectedVenue } = useVenue();

  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (selectedVenue && bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    } else if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  }, [selectedVenue]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={[200]}
      enablePanDownToClose
      onClose={() => setSelectedVenue(undefined)}
      backgroundStyle={{ backgroundColor: '#414442' }}
    >
      {selectedVenue && (
        <BottomSheetView style={{ flex: 1, padding: 10, gap: 20 }}>
          {/* TOP part */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Image source={scooterImage} style={{ width: 60, height: 60 }} />
            <View style={{ flex: 1, gap: 5 }}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: '600' }}>
                Lime - S
              </Text>
              <Text style={{ color: 'gray', fontSize: 18 }}>
                id-{selectedVenue.id} · Madison Avenue
              </Text>
            </View>
            <View style={{ gap: 5 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  alignSelf: 'flex-start',
                }}
              >
                <FontAwesome6 name="flag-checkered" size={18} color="#42E100" />
                <Text
                  style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}
                >
                  {(12 / 1000).toFixed(1)} km changeLater
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  alignSelf: 'flex-start',
                }}
              >
                <FontAwesome6 name="clock" size={18} color="#42E100" />
                <Text
                  style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}
                >
                  {(30 / 60).toFixed(0)} min
                </Text>
              </View>
            </View>
          </View>
          {/* Bottom part */}
          <View>
            <Button
              title="Start journey"
              onPress={() => {
                setSelectedVenue(undefined);
              }}
            />
          </View>
        </BottomSheetView>
      )}
    </BottomSheet>
  );
}
