import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
// import { useNavigation } from '@react-navigation/native';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';

import CustomHeader from '@/components/custom-header';
import Game from '@/components/game/game-card';
import UpcomingGame from '@/components/game/upcoming-game-card';
import { type IGame } from '@/types';

// eslint-disable-next-line max-lines-per-function
const HomeScreen = () => {
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
        { question: 'Is it indoor or beach?', answer: 'Beach volleyball.' },
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
  const [upcomingGames] = useState<IGame[]>([]);
  const [games] = useState<IGame[]>(Dummygames);

  // const initialOption = route.params?.initialOption || 'My Sports';
  const initialOption = 'My Sports';
  const [option, setOption] = useState(initialOption);
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CustomHeader>
        <View style={{ padding: 12 }}>
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
                Kathmandu
              </Text>
              <AntDesign name="arrowdown" size={24} color="white" />
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

          <View style={{ marginVertical: 7 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <Pressable
                onPress={() => setSport('Badminton')}
                style={{
                  padding: 10,
                  borderColor: 'white',
                  borderWidth: sport === 'Badminton' ? 0 : 1,
                  marginRight: 10,
                  borderRadius: 8,
                  backgroundColor:
                    sport === 'Badminton' ? '#1dbf22' : 'transparent',
                }}
              >
                <Text
                  style={{ color: 'white', fontWeight: '600', fontSize: 15 }}
                >
                  Badminton
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setSport('Cricket')}
                style={{
                  padding: 10,
                  borderColor: 'white',
                  borderWidth: sport === 'Cricket' ? 0 : 1,
                  marginRight: 10,
                  borderRadius: 8,
                  backgroundColor:
                    sport === 'Cricket' ? '#1dbf22' : 'transparent',
                }}
              >
                <Text
                  style={{ color: 'white', fontWeight: '600', fontSize: 15 }}
                >
                  Cricket
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setSport('Cycling')}
                style={{
                  padding: 10,
                  borderColor: 'white',
                  borderWidth: sport === 'Cycling' ? 0 : 1,
                  marginRight: 10,
                  borderRadius: 8,
                  backgroundColor:
                    sport === 'Cycling' ? '#1dbf22' : 'transparent',
                }}
              >
                <Text
                  style={{ color: 'white', fontWeight: '600', fontSize: 15 }}
                >
                  Cycling
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setSport('Running')}
                style={{
                  padding: 10,
                  borderColor: 'white',
                  borderWidth: sport === 'Running' ? 0 : 1,
                  marginRight: 10,
                  borderRadius: 8,
                  backgroundColor:
                    sport === 'Running' ? '#1dbf22' : 'transparent',
                }}
              >
                <Text
                  style={{ color: 'white', fontWeight: '600', fontSize: 15 }}
                >
                  Running
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </CustomHeader>
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
            router.push('/create-game');
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
      {option === 'My Sports' && (
        <FlatList
          data={games}
          renderItem={({ item }) => <Game item={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
      {option === 'Calendar' && (
        <FlatList
          data={upcomingGames}
          renderItem={({ item }) => <UpcomingGame item={item} />}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </>
  );
};

export default HomeScreen;
