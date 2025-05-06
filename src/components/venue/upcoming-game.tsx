import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { type BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native';

import { type Game as Gtype } from '@/api/games/games';
import { useUpcomingGamesByVenue } from '@/api/games/upcoming-at-venue';
import Game from '@/components/game/game-card';

export type UpcomingGameSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheetMethods>;
  venueID: number;
};

// eslint-disable-next-line max-lines-per-function
export default function UpcomingGameSheet({
  bottomSheetRef,
  venueID,
}: UpcomingGameSheetProps) {
  const { data, isLoading, error, refetch } = useUpcomingGamesByVenue({
    variables: { venueID },
  });
  const games: Gtype[] = data?.data || [];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={['80%']}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: '#efefef' }}
    >
      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : error ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red' }}>
            Failed to load upcoming games.
          </Text>
          <TouchableOpacity onPress={() => refetch()} style={{ marginTop: 8 }}>
            <Text style={{ color: 'blue' }}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      ) : games.length === 0 ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'gray' }}>
            No upcoming games found.
          </Text>
        </View>
      ) : (
        <BottomSheetFlatList
          data={games}
          keyExtractor={(item) => item.game_id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => <Game item={item} />}
          onRefresh={() => refetch()}
          refreshing={isLoading}
        />
      )}
    </BottomSheet>
  );
}
