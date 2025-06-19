import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from 'react-native';

import { type ListGamesVariables, useInfiniteGames } from '@/api/games/games';
import { useShortlistedGames } from '@/api/games/use-allshortlisted-game';
import { useUpcomingGamesByUser } from '@/api/games/use-user-upcoming-game';
import Address from '@/components/address';
import AddressBottomSheet from '@/components/address-bottomsheet';
import CustomHeader from '@/components/custom-header';
import Game from '@/components/game/game-card';
import ShortlistedGameCard from '@/components/game/shortlist-game-card';
import { UserAvatar } from '@/components/profile/user-avatar';

// eslint-disable-next-line max-lines-per-function
export default function HomeScreen() {
  const router = useRouter();

  // Read filter query parameter from URL, if any
  const searchParams = useLocalSearchParams<{ filters?: string }>();
  const [filters, setFilters] = useState({});
  useEffect(() => {
    if (searchParams.filters) {
      try {
        const parsed = JSON.parse(searchParams.filters);
        setFilters(parsed);
      } catch (error) {
        console.error('Invalid filters parameter', error);
      }
    }
  }, [searchParams.filters]);

  // Use these variables for filtering the games
  const variables: ListGamesVariables = filters
    ? filters
    : {
        limit: 15,
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

  const {
    data: UpcomingGamesByUserResponse,
    isLoading: isUpcomingGamesByUserLoading,
    error: UpcomingGamesByUserError,
    refetch: refetchUpcomingGamesByUser,
  } = useUpcomingGamesByUser();

  const initialOption = 'All Games';
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
              <Pressable onPress={() => router.push('/view-profile')}>
                <UserAvatar />
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
            <Pressable
              onPress={() => setOption('My Upcoming')}
              style={{
                padding: 10,
                borderColor: 'white',
                borderWidth: option === ' ' ? 0 : 1,
                marginRight: 10,
                borderRadius: 8,
                backgroundColor:
                  option === 'My Upcoming' ? '#1dbf22' : 'transparent',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>
                My Upcoming
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setOption('All Games')}
              style={{
                padding: 10,
                borderColor: 'white',
                borderWidth: option === 'All Games' ? 0 : 1,
                marginRight: 10,
                borderRadius: 8,
                backgroundColor:
                  option === 'All Games' ? '#1dbf22' : 'transparent',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>
                All Games
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setOption('Shortlisted')}
              style={{
                padding: 10,
                borderColor: 'white',
                borderWidth: option === 'Shortlisted' ? 0 : 1,
                marginRight: 10,
                borderRadius: 8,
                backgroundColor:
                  option === 'Shortlisted' ? '#1dbf22' : 'transparent',
              }}
            >
              <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>
                Shortlisted
              </Text>
            </Pressable>
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
            router.push('/c-game');
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>Create Game</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <Pressable onPress={() => router.push('/game-filter')}>
            <Text style={{ fontWeight: 'bold' }}>Filter</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setFilters({});
            }}
          >
            <Text style={{ fontWeight: 'bold' }}>Reset</Text>
          </Pressable>
        </View>
      </View>

      {/* Loading & Error for My Sports */}
      {option === 'All Games' && isLoading && (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator color="green" size="large" />
        </View>
      )}
      {option === 'All Games' && error && (
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
      {option === 'All Games' && !isLoading && !error && (
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

      {/* UpcomingGamesByUser Loading & Error */}
      {option === 'My Upcoming' && isUpcomingGamesByUserLoading && (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator color="green" size="large" />
        </View>
      )}
      {option === 'My Upcoming' && UpcomingGamesByUserError && (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <Text
            style={{ color: 'red' }}
          >{`Error loading shortlist: ${UpcomingGamesByUserError.message}`}</Text>
          <Pressable
            onPress={() => refetchUpcomingGamesByUser()}
            style={{ marginTop: 8 }}
          >
            <Text style={{ color: 'blue' }}>Retry</Text>
          </Pressable>
        </View>
      )}

      {/* UpcomingGamesByUser List */}
      {option === 'My Upcoming' &&
        !isUpcomingGamesByUserLoading &&
        !UpcomingGamesByUserError && (
          <FlatList
            data={UpcomingGamesByUserResponse?.data ?? []}
            renderItem={({ item }) => <Game item={item} />}
            keyExtractor={(item, index) => `${item.game_id}-${index}`}
            refreshControl={
              <RefreshControl
                refreshing={isUpcomingGamesByUserLoading}
                onRefresh={refetchUpcomingGamesByUser}
              />
            }
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View style={{ padding: 20, alignItems: 'center' }}>
                <Text>No games in Upcoming list.</Text>
              </View>
            }
          />
        )}

      <AddressBottomSheet />
    </>
  );
}
