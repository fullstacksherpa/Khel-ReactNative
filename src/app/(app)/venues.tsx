import { MaterialIcons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { type ListVenuesVariables } from '@/api/venues/types';
import { useInfiniteVenues } from '@/api/venues/venues';
import Address from '@/components/address';
import AddressBottomSheet from '@/components/address-bottomsheet';
import CustomHeader from '@/components/custom-header';
import { UserAvatar } from '@/components/profile/user-avatar';
import VenueCard from '@/components/venue/venue-card';
import { useLocation } from '@/lib/location/index';

interface Court {
  id: string;
  name: string;
}

// Interface for each sport available
interface Sport {
  id: string;
  name: string;
  icon: string;
  price: number;
  courts: Court[];
}

// Interface for each facility or item in the list
export interface Facility {
  id: string;
  name: string;
  address: string;
  location: string;
  image: string;
  newImage: string;
  rating: number;
  timings: string;
  sportsAvailable: Sport[];
}

// eslint-disable-next-line max-lines-per-function
const VenueScreen = () => {
  const [sport, setSport] = useState('futsal');
  const router = useRouter();

  const latitude = useLocation((state) => state.latitude);
  const longitude = useLocation((state) => state.longitude);

  const variables: ListVenuesVariables = {
    // include the sport filter unless “all”
    ...(sport !== 'all' && { sport }),
    // include lat/lng only if both are non-null
    ...(latitude != null &&
      longitude != null && { lat: latitude, lng: longitude, distance: 50000 }),
    limit: 6,
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteVenues({ variables });

  // Combine pages into a single array
  const venues = data?.pages.flatMap((page) => page.data);
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 12,
            paddingTop: 9,
            paddingBottom: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>
              <Address />
            </Text>
            <MaterialIcons name="location-pin" size={20} color="#f94449" />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Pressable onPress={() => router.push('/view-profile')}>
              <UserAvatar />
            </Pressable>
          </View>
        </View>

        {/* Horizontal Sport Picker */}
        <View
          style={{
            marginVertical: 7,
            paddingHorizontal: 16,
            paddingVertical: 4,
          }}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              'all',
              'futsal',
              'basketball',
              'badminton',
              'e-sport',
              'cricket',
              'tennis',
            ].map((s) => (
              <Pressable
                key={s}
                onPress={() => setSport(s)}
                style={{
                  padding: 10,
                  borderColor: 'white',
                  borderWidth: sport === s ? 0 : 1,
                  marginRight: 10,
                  borderRadius: 8,
                  backgroundColor: sport === s ? '#1dbf22' : 'transparent',
                }}
              >
                <Text
                  style={{ color: 'white', fontWeight: '600', fontSize: 15 }}
                >
                  {s}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </CustomHeader>

      <View style={{ flex: 1, backgroundColor: '#EBEBE5' }}>
        {isLoading && (
          <View
            style={{
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <ActivityIndicator size={'large'} color={'#22C55E'} />
          </View>
        )}
        {error && (
          <View
            style={{
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Text className="text-red-400">{`fail to load venue, ${error.message}`}</Text>
          </View>
        )}

        {!isLoading && venues?.length === 0 && (
          <View
            style={{
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            <Text style={{ color: '#555', fontSize: 16 }}>
              {`No venue found for ${sport}.`}
            </Text>
          </View>
        )}

        <FlatList
          data={venues}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <VenueCard item={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          // When the list end is reached, trigger fetching the next page.
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator style={{ padding: 10 }} />
            ) : null
          }
        />
      </View>
      <AddressBottomSheet />
    </>
  );
};

export default VenueScreen;
