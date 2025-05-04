// app/filter.tsx
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Define your FilterValues type
export type FilterValues = {
  sport_type?: string;
  game_level?: string;
  venue_id?: number;
  is_booked?: boolean;
  status?: 'active' | 'cancelled' | 'completed';
  lat?: number;
  lon?: number;
  radius?: number;
  start_after?: string;
  end_before?: string;
  min_price?: number;
  max_price?: number;
  sort?: 'asc' | 'desc';
};

// eslint-disable-next-line max-lines-per-function
export default function FilterScreen() {
  const router = useRouter();

  // Local state for each filter field
  const [sportType, setSportType] = useState('');
  const [gameLevel, setGameLevel] = useState('');
  const [venueId, setVenueId] = useState('');
  const [isBooked, setIsBooked] = useState<boolean>(false);
  const [isBookedEnabled, setIsBookedEnabled] = useState(false);
  const [status, setStatus] = useState('');
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [radius, setRadius] = useState('');
  const [startAfter, setStartAfter] = useState('');
  const [endBefore, setEndBefore] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<'asc' | 'desc'>('asc');

  const handleApply = () => {
    console.log('handle app got hit');
    const filters: FilterValues = {};

    if (sportType) filters.sport_type = sportType;
    if (gameLevel) filters.game_level = gameLevel;
    if (venueId) filters.venue_id = parseInt(venueId, 10);
    if (isBookedEnabled) filters.is_booked = isBooked;
    if (status) filters.status = status as 'active' | 'cancelled' | 'completed';
    if (lat) filters.lat = parseFloat(lat);
    if (lon) filters.lon = parseFloat(lon);
    if (radius) filters.radius = parseInt(radius, 10);
    if (startAfter) filters.start_after = startAfter;
    if (endBefore) filters.end_before = endBefore;
    if (minPrice) filters.min_price = parseInt(minPrice, 10);
    if (maxPrice) filters.max_price = parseInt(maxPrice, 10);
    filters.sort = sort;

    // Navigate back to home, adding filters as a query parameter.
    // We stringify the object so that it can be passed via URL.
    router.replace({
      pathname: '/game',
      params: { filters: JSON.stringify(filters) },
    });
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ padding: 16, backgroundColor: 'white' }}
      >
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
          Filter Games
        </Text>

        <Text>Sport Type</Text>
        <TextInput
          autoCapitalize="none"
          value={sportType}
          onChangeText={setSportType}
          placeholder="e.g., basketball"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
          }}
        />

        <Text>Game Level</Text>
        <TextInput
          autoCapitalize="none"
          value={gameLevel}
          onChangeText={setGameLevel}
          placeholder="e.g., intermediate"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
          }}
        />

        <Text>Venue ID</Text>
        <TextInput
          autoCapitalize="none"
          value={venueId}
          onChangeText={setVenueId}
          placeholder="Enter venue ID"
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
          }}
        />

        <Text>Is Booked?</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
          }}
        >
          <Switch value={isBookedEnabled} onValueChange={setIsBookedEnabled} />
          <Text style={{ marginLeft: 8 }}>
            {isBookedEnabled ? (isBooked ? 'Yes' : 'No') : 'Off'}
          </Text>
          {isBookedEnabled && (
            <Switch
              style={{ marginLeft: 16 }}
              value={isBooked}
              onValueChange={setIsBooked}
            />
          )}
        </View>

        <Text>Status</Text>
        <TextInput
          autoCapitalize="none"
          value={status}
          onChangeText={setStatus}
          placeholder="active, cancelled, completed"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
          }}
        />

        <Text>Latitude</Text>
        <TextInput
          autoCapitalize="none"
          value={lat}
          onChangeText={setLat}
          placeholder="Enter latitude"
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
          }}
        />

        <Text>Longitude</Text>
        <TextInput
          autoCapitalize="none"
          value={lon}
          onChangeText={setLon}
          placeholder="Enter longitude"
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
          }}
        />

        <Text>Radius (km)</Text>
        <TextInput
          value={radius}
          autoCapitalize="none"
          onChangeText={setRadius}
          placeholder="Enter radius"
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
          }}
        />

        <Text>Start After (RFC3339)</Text>
        <TextInput
          value={startAfter}
          autoCapitalize="none"
          onChangeText={setStartAfter}
          placeholder="e.g., 2023-05-04T12:00:00Z"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
          }}
        />

        <Text>End Before (RFC3339)</Text>
        <TextInput
          value={endBefore}
          autoCapitalize="none"
          onChangeText={setEndBefore}
          placeholder="e.g., 2023-05-04T18:00:00Z"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
          }}
        />

        <Text>Minimum Price</Text>
        <TextInput
          autoCapitalize="none"
          value={minPrice}
          onChangeText={setMinPrice}
          placeholder="Enter min price"
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
          }}
        />

        <Text>Maximum Price</Text>
        <TextInput
          autoCapitalize="none"
          value={maxPrice}
          onChangeText={setMaxPrice}
          placeholder="Enter max price"
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 4,
            padding: 8,
            marginBottom: 12,
          }}
        />

        <Text>Sort Order</Text>
        <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 4 }}>
          <TouchableOpacity
            onPress={() => setSort('asc')}
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
              backgroundColor: sort === 'asc' ? '#3b82f6' : 'transparent',
              marginRight: 10,
            }}
          >
            <Text style={{ color: sort === 'asc' ? 'white' : 'black' }}>
              Asc
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSort('desc')}
            style={{
              padding: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 4,
              backgroundColor: sort === 'desc' ? '#3b82f6' : 'transparent',
            }}
          >
            <Text style={{ color: sort === 'desc' ? 'white' : 'black' }}>
              Desc
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Pressable
        onPress={handleApply}
        style={{
          backgroundColor: '#10B981',
          padding: 12,
          borderRadius: 4,
          alignItems: 'center',
          marginBottom: 18,
          marginHorizontal: 'auto',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          Apply Filters
        </Text>
      </Pressable>
    </>
  );
}
