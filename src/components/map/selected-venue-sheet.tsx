import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useUpcomingGamesByVenue } from '@/api/games/upcoming-at-venue';
import type { Venue } from '@/api/venues/types';
import Game from '@/components/game/game-card';

import VenueCard from '../venue/venue-card';

type Props = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  venue: Venue | null;
};

// eslint-disable-next-line max-lines-per-function
export default function VenueDetailsBottomSheet({
  bottomSheetRef,
  venue,
}: Props) {
  const venueID = venue?.id ?? 0;

  // 1) have we asked to load games yet?
  const [loadGames, setLoadGames] = useState(false);

  // reset whenever we get a new venue
  useEffect(() => {
    setLoadGames(false);
  }, [venueID]);

  // 2) defer the query until loadGames === true
  const { data, isLoading, error, refetch } = useUpcomingGamesByVenue({
    variables: { venueID },
    enabled: loadGames,
  });
  const games = data?.data || [];

  // 3) build a header that always shows VenueCard,
  //    then one of: button, spinner, error, “no games,” or title
  const ListHeader = useMemo(() => {
    if (!venue) {
      return <Text style={styles.noVenueText}>No Venue Selected</Text>;
    }

    let below: React.ReactNode;
    if (!loadGames) {
      below = (
        <TouchableOpacity
          style={styles.checkButton}
          onPress={() => setLoadGames(true)}
        >
          <Text style={styles.checkButtonText}>Check Upcoming Games</Text>
        </TouchableOpacity>
      );
    } else if (isLoading) {
      below = (
        <View style={styles.centeredView}>
          <ActivityIndicator size="large" color={'#22C55E'} />
        </View>
      );
    } else if (error) {
      below = (
        <View style={styles.centeredView}>
          <Text style={styles.errorText}>Failed to load upcoming games.</Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (games.length === 0) {
      below = (
        <View style={styles.centeredView}>
          <Text style={styles.noGameText}>No upcoming games found.</Text>
        </View>
      );
    } else {
      below = (
        <Text style={styles.upcomingTitle}>Upcoming Games at {venue.name}</Text>
      );
    }

    return (
      <View style={styles.headerContainer}>
        <VenueCard item={venue} />
        {below}
      </View>
    );
  }, [venue, loadGames, isLoading, error, games.length, refetch]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={['95%']}
      index={-1}
      enablePanDownToClose
      backgroundStyle={styles.bottomSheetBackground}
    >
      <BottomSheetFlatList
        data={games}
        keyExtractor={(item) => item.game_id.toString()}
        contentContainerStyle={styles.bottomSheetContent}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => <Game item={item} />}
        onRefresh={refetch}
        refreshing={isLoading}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  bottomSheetBackground: { backgroundColor: '#efefef' },
  bottomSheetContent: {
    paddingBottom: 16,
    paddingTop: 1,
    paddingHorizontal: 4,
  },
  headerContainer: { marginBottom: 16 },
  noVenueText: { fontSize: 16, textAlign: 'center', marginVertical: 8 },
  centeredView: { alignItems: 'center', justifyContent: 'center', padding: 16 },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 8,
  },
  retryButton: { marginTop: 8 },
  retryText: { color: 'blue' },
  noGameText: { fontSize: 18, fontWeight: 'bold', color: 'gray' },
  upcomingTitle: {
    fontSize: 17,
    fontWeight: '600',
    paddingVertical: 9,
    marginHorizontal: 'auto',
  },
  checkButton: {
    marginTop: 12,
    alignSelf: 'center',
    backgroundColor: '#023e8a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  checkButtonText: { color: 'white', fontSize: 16 },
});
