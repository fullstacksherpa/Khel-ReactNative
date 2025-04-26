import { MaterialIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { type ListGamesVariables, useInfiniteGames } from '@/api/games/games';
import Address from '@/components/address';
import AddressBottomSheet from '@/components/address-bottomsheet';
import CustomHeader from '@/components/custom-header';
import Game from '@/components/game/game-card';
import UpcomingGame from '@/components/game/upcoming-game-card';
import { type IGame } from '@/types';

// eslint-disable-next-line max-lines-per-function
export default function HomeScreen() {
  // Use these variables for filtering the games
  const variables: ListGamesVariables = {
    limit: 2,
  };

  // Get infinite pages from the API using react-query-kit hook
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteGames({ variables });

  // Since the API response returns an object with a top-level "data" array,
  // we flatten the pages by directly merging the arrays from each page.
  const gamesFromApi = data?.pages.flatMap((page) => page.data) ?? [];
  console.log(gamesFromApi);

  // Dummy games data for the Calendar option
  const Dummygames: IGame[] = [
    {
      _id: 'game1',
      sport: 'Basketball',
      date: '2025-04-10',
      time: '18:00',
      area: 'Downtown Court',
      players: [
        {
          _id: 'player1',
          imageUrl: 'https://example.com/player1.jpg',
          name: 'John Doe',
        },
        {
          _id: 'player2',
          imageUrl: 'https://example.com/player2.jpg',
          name: 'Alice Smith',
        },
      ],
      totalPlayers: 10,
      queries: [
        {
          question: 'Is there a referee?',
          answer: 'Yes, one referee is assigned.',
        },
      ],
      requests: [{ userId: 'user123', comment: 'Can I join?' }],
      isBooked: false,
      adminName: 'Michael Jordan',
      adminUrl: 'https://example.com/admin1.jpg',
      matchFull: false,
      isUserAdmin: false,
      courtNumber: 'Court 1',
    },
    {
      _id: 'game2',
      sport: 'Football',
      date: '2025-04-11',
      time: '16:30',
      area: 'City Park Field',
      players: [
        {
          _id: 'player3',
          imageUrl: 'https://example.com/player3.jpg',
          name: 'Bob Marley',
        },
        {
          _id: 'player4',
          imageUrl: 'https://example.com/player4.jpg',
          name: 'Charlie Brown',
        },
      ],
      totalPlayers: 22,
      queries: [
        {
          question: 'Are cleats required?',
          answer: 'Yes, cleats are recommended.',
        },
      ],
      requests: [{ userId: 'user456', comment: 'Looking forward to it!' }],
      isBooked: true,
      adminName: 'Lionel Messi',
      adminUrl: 'https://example.com/admin2.jpg',
      matchFull: true,
      isUserAdmin: true,
      courtNumber: 'Field A',
    },
    {
      _id: 'game3',
      sport: 'Tennis',
      date: '2025-04-12',
      time: '14:00',
      area: 'Greenwood Tennis Club',
      players: [
        {
          _id: 'player5',
          imageUrl: 'https://example.com/player5.jpg',
          name: 'Serena Williams',
        },
      ],
      totalPlayers: 2,
      queries: [
        {
          question: 'Do we need to bring our own racket?',
          answer: 'Yes, bring your own.',
        },
      ],
      requests: [{ userId: 'user789', comment: 'I want to play!' }],
      isBooked: false,
      adminName: 'Roger Federer',
      adminUrl: 'https://example.com/admin3.jpg',
      matchFull: false,
      isUserAdmin: false,
      courtNumber: 'Court 5',
    },
    {
      _id: 'game4',
      sport: 'Volleyball',
      date: '2025-04-13',
      time: '19:00',
      area: 'Beachside Volleyball Arena',
      players: [
        {
          _id: 'player6',
          imageUrl: 'https://example.com/player6.jpg',
          name: 'Misty May',
        },
        {
          _id: 'player7',
          imageUrl: 'https://example.com/player7.jpg',
          name: 'Kerri Walsh',
        },
      ],
      totalPlayers: 12,
      queries: [
        {
          question: 'Is it indoor or beach?',
          answer: 'Beach volleyball.',
        },
      ],
      requests: [{ userId: 'user101', comment: 'Excited to join!' }],
      isBooked: false,
      adminName: 'Gabrielle Reece',
      adminUrl: 'https://example.com/admin4.jpg',
      matchFull: false,
      isUserAdmin: true,
      courtNumber: null,
    },
  ];

  const router = useRouter();
  const [sport, setSport] = useState('Badminton');
  const [dummyGames] = useState<IGame[]>(Dummygames);

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

          {/* Option Selector */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              marginVertical: 14,
            }}
          >
            <Pressable onPress={() => setOption('Calendar')}>
              <Text
                style={{
                  fontWeight: '500',
                  color: option === 'Calendar' ? '#12e04c' : 'white',
                  fontSize: 15,
                }}
              >
                Calendar
              </Text>
            </Pressable>

            <Pressable onPress={() => setOption('My Sports')}>
              <Text
                style={{
                  fontWeight: '500',
                  color: option === 'My Sports' ? '#12e04c' : 'white',
                  fontSize: 15,
                }}
              >
                My Sports
              </Text>
            </Pressable>

            <Pressable onPress={() => setOption('Other Sports')}>
              <Text
                style={{
                  fontWeight: '500',
                  color: option === 'Other Sports' ? '#12e04c' : 'white',
                  fontSize: 15,
                }}
              >
                Other Sports
              </Text>
            </Pressable>
          </View>

          {/* Horizontal Sport Picker */}
          <View style={{ marginVertical: 7 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Badminton', 'Cricket', 'Cycling', 'Running'].map((s) => (
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

      {/* Loading Indicator */}
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

      {/* Error Display */}
      {error && (
        <View
          style={{
            padding: 10,
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <Text
            style={{ color: 'red' }}
          >{`Failed to load venue: ${error.message}`}</Text>
        </View>
      )}

      {/* "My Sports" Option displays games fetched from API */}
      {option === 'My Sports' && (
        <FlatList
          data={gamesFromApi}
          renderItem={({ item }) => <Game item={item} />}
          keyExtractor={(item, index) => `${item.game_id}-${index}`}
          contentContainerStyle={{ paddingBottom: 20 }}
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
      )}

      {/* "Calendar" Option displays dummy games */}
      {option === 'Calendar' && (
        <FlatList
          data={dummyGames}
          renderItem={({ item }) => <UpcomingGame item={item} />}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <AddressBottomSheet />
    </>
  );
}
