import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

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
  const [venues, _] = useState<Facility[]>([
    {
      id: '1',
      name: 'Boudha Futsal Arena',
      address: 'Boudhanath, Kathmandu',
      location: '27.7215, 85.3620',
      image:
        'https://lh3.googleusercontent.com/p/AF1QipNvhST26oX_hk5IZZUhLjiuLqdMLYFmWylZhZW1=s680-w680-h510',
      newImage: 'https://source.unsplash.com/400x300/?stadium',
      rating: 4.5,
      timings: '6:00 AM - 10:00 PM',
      sportsAvailable: [
        {
          id: 's1',
          name: 'Futsal',
          icon: '⚽',
          price: 500,
          courts: [
            { id: 'c1', name: 'Court A' },
            { id: 'c2', name: 'Court B' },
          ],
        },
      ],
    },
    {
      id: '2',
      name: 'Thamel Basketball Court',
      address: 'Thamel, Kathmandu',
      location: '27.7152, 85.3123',
      image:
        'https://lh3.googleusercontent.com/p/AF1QipMpJ7Hh_lx39OEHchNUlqRasFZ5bVYs3_0-PkYA=s680-w680-h510',
      newImage: 'https://source.unsplash.com/400x300/?court',
      rating: 4.2,
      timings: '7:00 AM - 9:00 PM',
      sportsAvailable: [
        {
          id: 's2',
          name: 'Basketball',
          icon: '🏀',
          price: 300,
          courts: [{ id: 'c3', name: 'Main Court' }],
        },
      ],
    },
    {
      id: '3',
      name: 'Patan Tennis Club',
      address: 'Patan, Lalitpur',
      location: '27.6695, 85.3249',
      image:
        'https://lh3.googleusercontent.com/p/AF1QipOcYgj76vIPZotPrYrd8EuKv96Mz3OgYgDfyYBc=s680-w680-h510',
      newImage: 'https://source.unsplash.com/400x300/?tenniscourt',
      rating: 4.7,
      timings: '5:30 AM - 9:00 PM',
      sportsAvailable: [
        {
          id: 's3',
          name: 'Tennis',
          icon: '🎾',
          price: 600,
          courts: [
            { id: 'c4', name: 'Grass Court' },
            { id: 'c5', name: 'Clay Court' },
          ],
        },
      ],
    },
  ]);
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
            <Text style={{ fontSize: 16, fontWeight: '500' }}>Boudhanath</Text>
            <AntDesign name="arrowdown" size={24} color="black" />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Ionicons name="chatbox-outline" size={24} color="black" />
            <Ionicons name="notifications-outline" size={24} color="black" />

            <View>
              <Image
                style={{ width: 30, height: 30, borderRadius: 15 }}
                source={{
                  uri: 'https://lh3.googleusercontent.com/ogw/AF2bZyi09EC0vkA0pKVqrtBq0Y-SLxZc0ynGmNrVKjvV66i3Yg=s64-c-mo',
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
            <Text>Sports & Availabilty</Text>
          </View>

          <View
            style={{
              padding: 10,
              borderRadius: 10,
              borderColor: '#E0E0E0',
              borderWidth: 2,
            }}
          >
            <Text>Favorites</Text>
          </View>

          <View
            style={{
              padding: 10,
              borderRadius: 10,
              borderColor: '#E0E0E0',
              borderWidth: 2,
            }}
          >
            <Text>Offers</Text>
          </View>
        </Pressable>
      </CustomHeader>
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={venues}
          renderItem={({ item }) => <VenueCard item={item} />}
          keyExtractor={(item) => item.id} // Added keyExtractor here
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </>
  );
};

export default VenueScreen;
