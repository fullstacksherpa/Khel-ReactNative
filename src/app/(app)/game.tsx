import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { type ListGamesVariables, useInfiniteGames } from '@/api/games/games';
import { useShortlistedGames } from '@/api/games/use-allshortlisted-game';
import Address from '@/components/address';
import AddressBottomSheet from '@/components/address-bottomsheet';
import CustomHeader from '@/components/custom-header';
import Game from '@/components/game/game-card';
import ShortlistedGameCard from '@/components/game/shortlist-game-card';

// eslint-disable-next-line max-lines-per-function
export default function HomeScreen() {
  // Use these variables for filtering the games
  const variables: ListGamesVariables = {
    limit: 7,
  };

  // Get infinite pages from the API using react-query-kit hook
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteGames({ variables });

  // Since the API response returns an object with a top-level "data" array,
  // we flatten the pages by directly merging the arrays from each page.
  const gamesFromApi = data?.pages.flatMap((page) => page.data) ?? [];

  const {
    data: shortlistedResponse,
    isLoading: isShortlistedLoading,
    error: shortlistedError,
    refetch: refetchShortlisted,
  } = useShortlistedGames();

  const router = useRouter();
  const [sport, setSport] = useState('Badminton');

  // Option state to switch between "My Sports" and "Calendar" view.
  const initialOption = 'My Sports';
  const [option, setOption] = useState(initialOption);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader>
        <View style={{ padding: 12 }}>
          {/* Top Header with address and icons */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>
                <Address />
              </Text>
              <MaterialIcons name="location-pin" size={20} color="#f94449" />
            </View>

            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <Ionicons name="chatbox-outline" size={24} color="white" />
              <Ionicons name="notifications-outline" size={24} color="white" />
              <Pressable onPress={() => router.push('/view-profile')}>
                <Image
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                  source={{
                    uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJqcSD_2qz834cW2RuNWmvAbOMwcZdWSf81Q&s',
                  }}
                />
              </Pressable>
            </View>
          </View>

          {/* Option Selector */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-around',
              marginVertical: 12,
            }}
          >
            <Pressable onPress={() => setOption('Upcoming')}>
              <Text
                style={{
                  fontWeight: option === 'Upcoming' ? '900' : '500',
                  color: option === 'Upcoming' ? '#F59E0B' : 'white',
                  fontSize: 17,
                }}
              >
                Upcoming
              </Text>
            </Pressable>

            <Pressable onPress={() => setOption('My Sports')}>
              <Text
                style={{
                  fontWeight: option === 'My Sports' ? '900' : '500',
                  color: option === 'My Sports' ? '#F59E0B' : 'white',
                  fontSize: 17,
                }}
              >
                My Sports
              </Text>
            </Pressable>

            <Pressable onPress={() => setOption('Shortlisted')}>
              <Text
                style={{
                  fontWeight: option === 'Shortlisted' ? '900' : '500',
                  color: option === 'Shortlisted' ? '#F59E0B' : 'white',
                  fontSize: 17,
                }}
              >
                Shortlisted
              </Text>
            </Pressable>
          </View>

          {/* Horizontal Sport Picker */}
          <View style={{ marginVertical: 7 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
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
        </View>
      </CustomHeader>

      {/* Create Game & Filter/Sort Row */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 12,
          backgroundColor: 'white',
        }}
      >
        <Pressable
          onPress={() => {
            console.log('createnew bottom pressed ⚙️');
            router.push('/c-game');
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>Create Game</Text>
        </Pressable>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <Pressable>
            <Text style={{ fontWeight: 'bold' }}>Filter</Text>
          </Pressable>
          <Pressable>
            <Text style={{ fontWeight: 'bold' }}>Sort</Text>
          </Pressable>
        </View>
      </View>

      {/* Loading & Error for My Sports */}
      {option === 'My Sports' && isLoading && (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator color="green" size="large" />
        </View>
      )}
      {option === 'My Sports' && error && (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <Text
            style={{ color: 'red' }}
          >{`Error loading games: ${error.message}`}</Text>
          <Pressable onPress={() => refetch()} style={{ marginTop: 8 }}>
            <Text style={{ color: 'blue' }}>Retry</Text>
          </Pressable>
        </View>
      )}

      {/* My Sports List */}
      {option === 'My Sports' && !isLoading && !error && (
        <FlatList
          data={gamesFromApi}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
          }
          renderItem={({ item }) => <Game item={item} />}
          keyExtractor={(item, index) => `${item.game_id}-${index}`}
          onEndReached={() =>
            hasNextPage && !isFetchingNextPage && fetchNextPage()
          }
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator
                style={{ padding: 10 }}
                color="green"
                size="large"
              />
            ) : null
          }
        />
      )}

      {/* Shortlisted Loading & Error */}
      {option === 'Shortlisted' && isShortlistedLoading && (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator color="green" size="large" />
        </View>
      )}
      {option === 'Shortlisted' && shortlistedError && (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <Text
            style={{ color: 'red' }}
          >{`Error loading shortlist: ${shortlistedError.message}`}</Text>
          <Pressable
            onPress={() => refetchShortlisted()}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: 'blue' }}>Retry</Text>
          </Pressable>
        </View>
      )}

      {/* Shortlisted List */}
      {option === 'Shortlisted' &&
        !isShortlistedLoading &&
        !shortlistedError && (
          <FlatList
            data={shortlistedResponse?.data ?? []}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <ShortlistedGameCard {...item} />}
            refreshControl={
              <RefreshControl
                refreshing={isShortlistedLoading}
                onRefresh={refetchShortlisted}
              />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text>No games in your shortlist.</Text>
              </View>
            }
          />
        )}

      <AddressBottomSheet />
    </>
  );
}
