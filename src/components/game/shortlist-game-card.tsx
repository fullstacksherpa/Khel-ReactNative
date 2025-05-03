import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import React from 'react';
import {
  Alert,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { queryClient } from '@/api/common/api-provider';
import type { ShortlistedGame } from '@/api/games/use-allshortlisted-game';
import { useRemoveShortlistGame } from '@/api/games/use-remove-shortlist';

import FormattedDateTimeRange from './formatted-datetime-range';

// Props matching the API's ShortlistedGame
export type ShortlistedGameProps = Pick<
  ShortlistedGame,
  | 'id'
  | 'sport_type'
  | 'price'
  | 'format'
  | 'venue_id'
  | 'game_level'
  | 'start_time'
  | 'end_time'
  | 'max_players'
  | 'is_booked'
  | 'match_full'
>;

// eslint-disable-next-line max-lines-per-function
export default function ShortlistedGameCard({
  id,
  sport_type,
  price,
  format,
  venue_id,
  game_level,
  start_time,
  end_time,
  max_players,
  is_booked,
  match_full,
}: ShortlistedGameProps) {
  const removeMutation = useRemoveShortlistGame({
    onSuccess: () => {
      // Invalidate or refetch the shortlist query so removed item disappears
      queryClient.invalidateQueries({ queryKey: ['all-shortlisted-games'] });
      queryClient.invalidateQueries({ queryKey: ['infinite-games'] });
    },
  });

  const confirmRemove = () => {
    Alert.alert(
      'Remove from shortlist',
      'Are you sure you want to remove this game from your shortlist?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => removeMutation.mutate({ gameID: id }),
        },
      ],
      { cancelable: true }
    );
  };

  const isFull = match_full || max_players <= 0;
  const showPrice = !isFull && price != null;

  return (
    <Link href={`/games/${id}`} asChild>
      <Pressable style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.format}>{format || 'Regular'}</Text>
          <View style={styles.headerRight}>
            <Text style={isFull ? styles.fullBadge : styles.slotBadge}>
              {isFull ? 'Full' : `${max_players} slots`}
            </Text>
            <Pressable onPress={confirmRemove} style={styles.deleteBtn}>
              <MaterialIcons name="delete" size={20} color="#555" />
            </Pressable>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.row}>
            <SimpleLineIcons name="game-controller" size={20} color="#555" />
            <Text style={styles.text}>{sport_type}</Text>
          </View>

          <View style={styles.row}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#555" />
            <Text style={styles.text}>Venue #{venue_id}</Text>
          </View>

          <View style={styles.dateRow}>
            <FormattedDateTimeRange startUtc={start_time} endUtc={end_time} />
          </View>

          {showPrice && (
            <View style={styles.priceRow}>
              <MaterialCommunityIcons
                name="currency-inr"
                size={18}
                color="#555"
              />
              <Text style={[styles.text, styles.priceText]}>{price}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Text style={styles.level}>{game_level}</Text>
          {is_booked && <Text style={styles.booked}>Booked</Text>}
        </View>
      </Pressable>
    </Link>
  );
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 28;

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteBtn: {
    marginLeft: 12,
  },
  format: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  fullBadge: {
    backgroundColor: '#F87171',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '500',
  },
  slotBadge: {
    backgroundColor: '#34D399',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontWeight: '500',
  },
  body: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    color: '#555',
  },
  dateRow: {
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  priceText: {
    marginLeft: 4,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  level: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
  booked: {
    backgroundColor: '#60A5FA',
    color: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    fontWeight: '500',
  },
});
