import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

export type FilterValues = {
  sport_type?: string;
  game_level?: string;
  is_booked?: boolean;
  status?: 'active' | 'cancelled' | 'completed';
  max_price?: number;
};

const SPORT_OPTIONS = [
  'futsal',
  'basketball',
  'badminton',
  'e-sport',
  'tennis',
] as const;
const LEVEL_OPTIONS = ['beginner', 'intermediate', 'advance'] as const;
const BOOKED_OPTIONS = [
  { label: 'Booked', val: true },
  { label: 'Not Yet', val: false },
] as const;
const STATUS_OPTIONS = ['active', 'cancelled', 'completed'] as const;
const PRICE_OPTIONS = [100, 250, 350, 450, 500] as const;

// eslint-disable-next-line max-lines-per-function
export default function FilterScreen() {
  const router = useRouter();

  const [sportType, setSportType] = useState<
    (typeof SPORT_OPTIONS)[number] | ''
  >('');
  const [gameLevel, setGameLevel] = useState<
    (typeof LEVEL_OPTIONS)[number] | ''
  >('');
  const [isBooked, setIsBooked] = useState<boolean | null>(null);
  const [status, setStatus] = useState<(typeof STATUS_OPTIONS)[number] | ''>(
    ''
  );
  const [maxPrice, setMaxPrice] = useState<number | null>(null);

  const handleApply = () => {
    const filters: FilterValues = {};
    if (sportType) filters.sport_type = sportType;
    if (gameLevel) filters.game_level = gameLevel;
    if (isBooked !== null) filters.is_booked = isBooked;
    if (status) filters.status = status;
    if (maxPrice !== null) filters.max_price = maxPrice;

    router.replace({
      pathname: '/game',
      params: { filters: JSON.stringify(filters) },
    });
  };

  const renderButtons = <T extends string | number>(
    options: readonly T[],
    selected: T | '',
    onPress: (v: T) => void
  ) => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => {
        const val = opt as T;
        const label =
          String(opt).charAt(0).toUpperCase() + String(opt).slice(1);
        const isSel = selected === val;
        return (
          <Pressable
            key={String(opt)}
            onPress={() => onPress(val)}
            style={{
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 20,
              borderWidth: isSel ? 0 : 1,
              borderColor: '#ccc',
              backgroundColor: isSel ? '#10B981' : 'transparent',
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ color: isSel ? 'white' : '#333' }}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Stack.Screen
        options={{ headerTitle: 'Filter Games', headerBackTitle: 'Back' }}
      />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ marginBottom: 8 }}>Sport Type</Text>
        {renderButtons(SPORT_OPTIONS, sportType, (v) =>
          setSportType(sportType === v ? '' : v)
        )}

        <Text style={{ marginTop: 16, marginBottom: 8 }}>Game Level</Text>
        {renderButtons(LEVEL_OPTIONS, gameLevel, (v) =>
          setGameLevel(gameLevel === v ? '' : v)
        )}

        <Text style={{ marginTop: 16, marginBottom: 8 }}>Booked?</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
          {BOOKED_OPTIONS.map(({ label, val }) => {
            const isSel = isBooked === val;
            return (
              <Pressable
                key={label}
                onPress={() => setIsBooked(isBooked === val ? null : val)}
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                  borderWidth: isSel ? 0 : 1,
                  borderColor: '#ccc',
                  backgroundColor: isSel ? '#10B981' : 'transparent',
                }}
              >
                <Text style={{ color: isSel ? 'white' : '#333' }}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={{ marginTop: 16, marginBottom: 8 }}>Status</Text>
        {renderButtons(STATUS_OPTIONS, status, (v) =>
          setStatus(status === v ? '' : v)
        )}

        <Text style={{ marginTop: 16, marginBottom: 8 }}>Max Price</Text>
        {renderButtons(PRICE_OPTIONS, maxPrice ?? '', (v) =>
          setMaxPrice(maxPrice === v ? null : v)
        )}
      </ScrollView>

      <Pressable
        onPress={handleApply}
        style={{
          backgroundColor: '#10B981',
          padding: 16,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Apply Filters
        </Text>
      </Pressable>
    </View>
  );
}
