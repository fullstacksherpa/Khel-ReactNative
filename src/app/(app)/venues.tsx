import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import { type ListVenuesVariables } from '@/api/venues/types';
import { useInfiniteVenues } from '@/api/venues/venues';
import Address from '@/components/address';
import AddressBottomSheet from '@/components/address-bottomsheet';
import CustomHeader from '@/components/custom-header';
import VenueCard from '@/components/venue/venue-card';

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
  const variables: ListVenuesVariables = {
    sport: 'Futsal',
    // Optional: lat, lng, distance, and limit (if not provided, limit defaults to 10)
    limit: 2,
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
            padding: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>
              <Address />
            </Text>
            <MaterialIcons name="location-pin" size={20} color="#f94449" />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Ionicons name="chatbox-outline" size={24} color="white" />
            <Ionicons name="notifications-outline" size={24} color="white" />

            <View>
              <Image
                style={{ width: 30, height: 30, borderRadius: 15 }}
                source={{
                  uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJqcSD_2qz834cW2RuNWmvAbOMwcZdWSf81Q&s',
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            marginHorizontal: 12,
            backgroundColor: '#E8E8E8',
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 25,
          }}
        >
          <TextInput placeholder="Search For Venues" />
          <Ionicons name="search" size={24} color="gray" />
        </View>

        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            padding: 13,
          }}
        >
          <View
            style={{
              padding: 10,
              borderRadius: 10,
              borderColor: '#E0E0E0',
              borderWidth: 2,
            }}
          >
            <Text className="text-white">Sports & Availabilty</Text>
          </View>

          <View
            style={{
              padding: 10,
              borderRadius: 10,
              borderColor: '#E0E0E0',
              borderWidth: 2,
            }}
          >
            <Text className="text-white">Favorites</Text>
          </View>

          <View
            style={{
              padding: 10,
              borderRadius: 10,
              borderColor: '#E0E0E0',
              borderWidth: 2,
            }}
          >
            <Text className="text-white">Offers</Text>
          </View>
        </Pressable>
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
            <ActivityIndicator />
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
