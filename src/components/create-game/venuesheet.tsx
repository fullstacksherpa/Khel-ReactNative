import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native';

export type Venue = {
  id: number;
  name: string;
  address: string;
};

type VenueSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  venues: Venue[];
  loading: boolean;
  onSelect: (venueId: number) => void;
  snapPoints?: string[];
  sport: string | null;
};

export default function VenueSheet({
  bottomSheetRef,
  venues,
  loading,
  onSelect,
  snapPoints = ['80%'],
  sport,
}: VenueSheetProps) {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      {loading ? (
        <ActivityIndicator size="large" />
      ) : venues.length === 0 ? (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-xl font-bold text-gray-500">
            {`No venues found for the sport ${sport}`}
          </Text>
        </View>
      ) : (
        <BottomSheetFlatList
          data={venues}
          keyExtractor={(v) => v.id.toString()}
          contentContainerClassName="mb-5"
          renderItem={({ item }) => (
            <TouchableOpacity
              className="border-b border-gray-200 p-3 pl-6"
              onPress={() => {
                onSelect(item.id);
                bottomSheetRef.current?.close();
              }}
            >
              <Text className="font-medium">{item.name}</Text>
              <Text className="text-sm text-gray-500">{item.address}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </BottomSheet>
  );
}
