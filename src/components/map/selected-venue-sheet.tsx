import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { type Game as Gtype } from '@/api/games/games';
import { useUpcomingGamesByVenue } from '@/api/games/upcoming-at-venue';
import type { Venue } from '@/api/venues/types';
import Game from '@/components/game/game-card';

import VenueCard from '../venue/venue-card';

type VenueDetailsBottomSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  venue: Venue | null;
};

export default function VenueDetailsBottomSheet({
  bottomSheetRef,
  venue,
}: VenueDetailsBottomSheetProps) {
  // Ensure venueID is a valid number.
  const venueID = venue?.id;
  const { data, isLoading, error, refetch } = useUpcomingGamesByVenue(
    venueID !== undefined
      ? { variables: { venueID }, enabled: true }
      : { variables: { venueID: 0 }, enabled: false }
  );
  const games: Gtype[] = data?.data || [];

  // Header component that renders the venue information and messages.
  const ListHeader = React.useMemo(() => {
    return (
      <View style={styles.headerContainer}>
        {venue ? (
          <VenueCard item={venue} />
        ) : (
          <Text style={styles.noVenueText}>No Venue Selected</Text>
        )}
        {isLoading ? (
          <ActivityIndicator size="large" style={{ marginTop: 20 }} />
        ) : error ? (
          <View style={styles.centeredView}>
            <Text style={styles.errorText}>Failed to load upcoming games.</Text>
            <TouchableOpacity
              onPress={() => refetch()}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>Tap to retry</Text>
            </TouchableOpacity>
          </View>
        ) : games.length === 0 ? (
          <View style={styles.centeredView}>
            <Text style={styles.noGameText}>No upcoming games found.</Text>
          </View>
        ) : (
          <View style={{ alignSelf: 'center' }}>
            <Text
              style={styles.upcomingTitle}
            >{`Upcoming Games at ${venue?.name}`}</Text>
          </View>
        )}
      </View>
    );
  }, [venue, isLoading, error, games.length, refetch]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['95%']}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetFlatList
        data={games}
        keyExtractor={(item) => item.game_id.toString()}
        contentContainerStyle={styles.bottomSheetContent}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => <Game item={item} />}
        onRefresh={() => refetch()}
        refreshing={isLoading}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: '#efefef',
  },
  bottomSheetContent: {
    padding: 16,
  },
  headerContainer: {
    marginBottom: 16,
  },
  noVenueText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },
  centeredView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 8,
  },
  retryButton: {
    marginTop: 8,
  },
  retryText: {
    color: 'blue',
  },
  noGameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
  upcomingTitle: {
    fontSize: 17,
    fontWeight: '600',
    paddingVertical: 9,
  },
});
