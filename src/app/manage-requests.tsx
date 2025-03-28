/* eslint-disable max-lines-per-function */

import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

import { type IPlayer, type IRequestArray } from '@/types';

const ManageRequests = () => {
  const router = useRouter();
  const [option, setOption] = useState('Requests');
  const [requests, setRequests] = useState<IRequestArray>([]);
  const { gameId } = useLocalSearchParams();

  const acceptRequest = async (userId: string) => {
    try {
      const user = {
        gameId: gameId,
        userId: userId,
      };
      console.log(user);
      const response = await axios.post(
        'http://localhost:8000/game/accept',
        user
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Request accepted');

        await fetchRequests();

        await fetchPlayers();
        // Optionally, refresh the data or update the stat
      }
    } catch (error) {
      console.error('Failed to accept request:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/game/${gameId}/requests`
      );
      setRequests(response.data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  console.log(`This is requests fetch ${requests}`);
  const [players, setPlayers] = useState<IPlayer[]>([]);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/game/${gameId}/players`
      );
      setPlayers(response.data.players);
    } catch (error) {
      console.error('Failed to fetch players:', error);
    }
  };

  return (
    <SafeAreaView>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ padding: 12, backgroundColor: '#223536' }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            justifyContent: 'space-between',
          }}
        >
          <Pressable onPress={() => router.back()} style={{ padding: 10 }}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <AntDesign name="plussquareo" size={24} color="white" />
        </View>

        <View
          style={{
            marginTop: 15,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: '600', color: 'white' }}>
            Manage
          </Text>

          <View>
            <Text style={{ color: 'white', fontSize: 17 }}>Match Full</Text>
          </View>
        </View>

        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 15,
          }}
        >
          <Pressable onPress={() => setOption('Requests')}>
            <Text
              style={{
                fontWeight: '500',
                color: option === 'Requests' ? '#1dd132' : 'white',
              }}
            >
              Requests ({requests?.length})
            </Text>
          </Pressable>

          <Pressable onPress={() => setOption('Invited')}>
            <Text
              style={{
                fontWeight: '500',
                color: option === 'Invited' ? '#1dd132' : 'white',
              }}
            >
              Invited (0)
            </Text>
          </Pressable>

          <Pressable onPress={() => setOption('Playing')}>
            <Text
              style={{
                fontWeight: '500',
                color: option === 'Playing' ? '#1dd132' : 'white',
              }}
            >
              Playing({players?.length})
            </Text>
          </Pressable>

          <Pressable onPress={() => setOption('Retired')}>
            <Text
              style={{
                fontWeight: '500',
                color: option === 'Retired' ? '#1dd132' : 'white',
              }}
            >
              Retired(0)
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={{ marginTop: 10, marginHorizontal: 15 }}>
        <View>
          {option === 'Requests' && (
            <View>
              {requests?.map((item, index) => (
                <Pressable
                  key={index}
                  style={{
                    padding: 10,
                    backgroundColor: 'white',
                    marginVertical: 10,
                    borderRadius: 6,
                  }}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 13,
                    }}
                  >
                    <Image
                      style={{ width: 50, height: 50, borderRadius: 25 }}
                      source={{ uri: item?.image }}
                    />

                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600' }}>
                        {item?.firstName} {item?.lastName}
                      </Text>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 3,
                          marginTop: 10,
                          borderRadius: 20,
                          borderColor: 'orange',
                          borderWidth: 1,
                          alignSelf: 'flex-start',
                        }}
                      >
                        <Text style={{ fontSize: 13 }}>INTERMEDIATE</Text>
                      </View>
                    </View>

                    <View>
                      <Image
                        style={{
                          width: 110,
                          height: 60,
                          resizeMode: 'contain',
                        }}
                        source={{
                          uri: 'https://playo-website.gumlet.io/playo-website-v2/logos-icons/new-logo-playo.png?q=50',
                        }}
                      />
                    </View>
                  </View>

                  <Text style={{ marginTop: 8 }}>{item?.comment}</Text>

                  <View
                    style={{
                      height: 1,
                      borderColor: '#E0E0E0',
                      borderWidth: 0.7,
                      marginVertical: 15,
                    }}
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <View>
                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          backgroundColor: '#E0E0E0',
                          borderRadius: 5,
                          alignSelf: 'flex-start',
                        }}
                      >
                        <Text style={{ fontSize: 14, color: 'gray' }}>
                          0 NO SHOWS
                        </Text>
                      </View>

                      <Text
                        style={{
                          marginTop: 10,
                          fontWeight: 'bold',
                          textDecorationLine: 'underline',
                        }}
                      >
                        See Reputation
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      <Pressable
                        style={{
                          padding: 10,
                          borderRadius: 6,
                          borderColor: '#E0E0E0',
                          borderWidth: 1,
                          width: 100,
                        }}
                      >
                        <Text style={{ textAlign: 'center' }}>RETIRE</Text>
                      </Pressable>

                      <Pressable
                        onPress={() => acceptRequest(item.userId)}
                        style={{
                          padding: 10,
                          borderRadius: 6,
                          backgroundColor: '#26bd37',
                          width: 100,
                        }}
                      >
                        <Text style={{ textAlign: 'center', color: 'white' }}>
                          ACCEPT
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      <View style={{ marginTop: 10, marginHorizontal: 15 }}>
        <View>
          {option === 'Playing' && (
            <>
              <View style={{}}>
                {players?.map((item, index) => (
                  <Pressable
                    key={index}
                    style={{
                      marginVertical: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <View>
                      <Image
                        style={{ width: 60, height: 60, borderRadius: 30 }}
                        source={{ uri: item?.image }}
                      />
                    </View>

                    <View>
                      <Text>
                        {item?.firstName} {item?.lastName}
                      </Text>

                      <View
                        style={{
                          paddingHorizontal: 10,
                          paddingVertical: 5,
                          marginTop: 10,
                          borderRadius: 20,
                          borderColor: 'orange',
                          borderWidth: 1,
                          alignSelf: 'flex-start',
                        }}
                      >
                        <Text style={{ fontSize: 13, fontWeight: '400' }}>
                          INTERMEDIATE
                        </Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ManageRequests;
