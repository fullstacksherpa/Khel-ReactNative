import gads from '@assets/gads.png';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Image } from 'expo-image';
import {
  Link,
  Stack,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useLayoutEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { useGameDetails } from '@/api/games/games';
import CustomHeader from '@/components/custom-header';
import { CancelGameButton } from '@/components/game/cancel-game-button';
import FormattedDateTimeRange from '@/components/game/formatted-datetime-range';
import GameActions from '@/components/game/game-action';
import { GameQAList } from '@/components/game/game-qa-list';
import { StatusBadge } from '@/components/game/game-status-badge';
import { ToggleMatchFullButton } from '@/components/game/toggle-matchfull';
import { getUserId } from '@/lib/auth/utils';
import { formatDateTimeRangeString } from '@/lib/date-utils';

// eslint-disable-next-line max-lines-per-function
export default function GameDetails() {
  const router = useRouter();

  const { setOptions } = useNavigation();
  useLayoutEffect(() => {
    setOptions({ headerShown: false });
  }, [setOptions]);

  const local = useLocalSearchParams<{ id: string }>();
  const gameIDNumber = Number(local.id);
  const { data, isLoading, isError, error, isFetching } = useGameDetails({
    variables: { gameID: gameIDNumber },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#28c752" />
        <Text className="mt-2 text-gray-500">Loading Game Details...</Text>
      </View>
    );
  }
  if (isError)
    return (
      <View>
        <Text>{`Error: ${error?.message}`}</Text>
      </View>
    );
  if (isFetching)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#28c752" />
        <Text className="mt-2 text-gray-500">
          Requesting to Server... hold tight
        </Text>
      </View>
    );

  const game = data?.data;
  if (!game) return <Text>No game found.</Text>;

  const isMatchFull =
    game.match_full || game.max_players === game.current_player;

  const total_join_request = game.requested_player_ids.length;

  const rawUserID = getUserId();

  const userIDNumberConverted = rawUserID ? Number(rawUserID) : null;

  // If game data is available, perform the checks only when userIDNumberConverted is not null
  const userRequested =
    userIDNumberConverted !== null &&
    game.requested_player_ids.includes(userIDNumberConverted);

  const isUserAdmin =
    userIDNumberConverted !== null && game.admin_id === userIDNumberConverted;

  const adminUrl =
    'https://t3.ftcdn.net/jpg/01/65/63/94/360_F_165639425_kRh61s497pV7IOPAjwjme1btB8ICkV0L.jpg';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />

      <CustomHeader>
        <View style={{ paddingHorizontal: 12, paddingVertical: 5 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color="white" />
            </Pressable>

            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <Entypo name="share" size={24} color="white" />
            </View>
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold',
                letterSpacing: 3,
              }}
            >
              {game.sport_type}
            </Text>

            <View
              style={{
                padding: 7,

                backgroundColor: 'white',
                borderRadius: 7,
                alignSelf: 'flex-start',
              }}
            >
              <Text>{game.game_level.toUpperCase()}</Text>
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 15, color: 'white', fontWeight: '600' }}>
              <FormattedDateTimeRange
                startUtc={game.start_time}
                endUtc={game.end_time}
                style={{ marginTop: 10, fontSize: 18, fontWeight: '700' }}
              />
            </Text>
          </View>

          {game.venue_id ? (
            <Link href={`/venue/${game.venue_id}`} asChild>
              <Pressable
                style={{
                  backgroundColor: '#28c752',
                  paddingHorizontal: 8,
                  paddingVertical: 6,
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                  width: '90%',
                  justifyContent: 'center',
                  borderRadius: 8,
                  marginHorizontal: 'auto',
                }}
              >
                <Entypo name="location" size={24} color="white" />
                <View>
                  <Text style={{ color: 'white' }}>{game.venue_name}</Text>
                </View>
              </Pressable>
            </Link>
          ) : (
            <Pressable
              style={{
                backgroundColor: '#28c752',
                paddingHorizontal: 10,
                paddingVertical: 6,
                marginTop: 10,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                width: '90%',
                justifyContent: 'center',
                borderRadius: 8,
              }}
              disabled
            >
              <Entypo name="location" size={24} color="white" />
              <View>
                <Text style={{ color: 'white' }}>Venue not decided</Text>
              </View>
            </Pressable>
          )}
        </View>
      </CustomHeader>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex flex-1">
          <View style={{ marginHorizontal: 7, marginVertical: 7 }}>
            <Image
              style={{
                width: '100%',
                height: 90,
                borderRadius: 10,
                resizeMode: 'cover',
              }}
              source={gads}
            />
          </View>

          <View
            style={{
              marginVertical: 9,
              marginHorizontal: 9,
              backgroundColor: 'white',
              padding: 12,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{ fontSize: 16, fontWeight: '600' }}
              >{`Players (${game.current_player})`}</Text>
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: '#fffbde',
                  borderRadius: 8,
                  borderColor: '#EEDC82',
                  borderWidth: 1,
                  flexDirection: 'row',
                  gap: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialCommunityIcons
                  name="currency-inr"
                  size={20}
                  color="black"
                />
                <Text style={{ fontWeight: '700', fontSize: 16 }}>
                  {game.price}
                </Text>
              </View>
            </View>

            <View style={{ marginVertical: 12, flexDirection: 'row', gap: 10 }}>
              <View>
                <Image
                  style={{ width: 30, height: 30, borderRadius: 15 }}
                  source={{
                    uri: adminUrl,
                  }}
                />
              </View>

              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Text className="font-bold tracking-wide">
                    {game.game_admin_name}
                  </Text>
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      backgroundColor: '#E0E0E0',
                      borderRadius: 8,
                    }}
                  >
                    <Text>HOST</Text>
                  </View>
                </View>

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
                  <Text>{game.game_level}</Text>
                </View>
                {game.is_booked && (
                  <View
                    style={{
                      backgroundColor: '#4ba143',
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 8,
                      marginTop: 10,
                    }}
                  >
                    <Text style={{ textAlign: 'center', color: 'white' }}>
                      Venue Booked
                    </Text>
                  </View>
                )}
                <StatusBadge
                  status={game.status as 'active' | 'cancelled' | 'completed'}
                />
              </View>
              {isMatchFull && (
                <Image
                  style={{ width: 100, height: 70, resizeMode: 'contain' }}
                  source={{
                    uri: 'https://playo.co/_next/image?url=https%3A%2F%2Fplayo-website.gumlet.io%2Fplayo-website-v3%2Fmatch_full.png&w=256&q=75',
                  }}
                />
              )}
            </View>

            {isUserAdmin ? (
              <View>
                <View
                  style={{
                    height: 1,
                    borderWidth: 0.5,
                    borderColor: '#E0E0E0',
                    marginVertical: 12,
                  }}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: '/admin-reply-screen',
                        params: {
                          gameID: game.game_id.toString(),
                        },
                      });
                    }}
                    style={{ alignItems: 'center' }} // you can adjust the styling as needed
                  >
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        style={{ width: 30, height: 30, resizeMode: 'contain' }}
                        source={{
                          uri: 'https://cdn-icons-png.flaticon.com/128/1474/1474545.png',
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        marginTop: 8,
                        fontWeight: '500',
                        textAlign: 'center',
                      }}
                    >
                      Game Chat
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: '/game-join-requests',
                        params: {
                          gameID: gameIDNumber,
                        },
                      });
                    }}
                    style={{ alignItems: 'center' }} // you can adjust the styling as needed
                  >
                    <View
                      style={{
                        width: 60,
                        height: 60,
                        borderWidth: 1,
                        borderColor: '#E0E0E0',
                        borderRadius: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Image
                        style={{ width: 30, height: 30, resizeMode: 'contain' }}
                        source={{
                          uri: 'https://cdn-icons-png.flaticon.com/128/7928/7928637.png',
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        marginTop: 8,
                        fontWeight: '500',
                        textAlign: 'center',
                      }}
                    >
                      Manage ({total_join_request})
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => {
                      const timeRange = formatDateTimeRangeString(
                        game.start_time,
                        game.end_time
                      );
                      router.push({
                        pathname: '/player-screen',
                        params: {
                          gameId: game.game_id.toString(),
                          adminId: game.admin_id.toString(),
                          timeRange,
                        },
                      });
                    }}
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        padding: 10,
                        borderColor: '#E0E0E0',
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginVertical: 12,
                      }}
                    >
                      <MaterialCommunityIcons
                        style={{ textAlign: 'center' }}
                        name="chevron-right"
                        size={24}
                        color="black"
                      />
                    </View>

                    <Text
                      style={{
                        marginBottom: 12,
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      All Players
                    </Text>
                  </Pressable>
                </View>

                <View
                  style={{
                    height: 1,
                    borderWidth: 0.5,
                    borderColor: '#E0E0E0',
                    marginVertical: 12,
                  }}
                />
                <ToggleMatchFullButton
                  gameId={game.game_id}
                  matchFull={game.match_full}
                />
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  const timeRange = formatDateTimeRangeString(
                    game.start_time,
                    game.end_time
                  );
                  router.push({
                    pathname: '/player-screen',
                    params: {
                      gameId: game.game_id.toString(),
                      adminId: game.admin_id.toString(),
                      timeRange,
                    },
                  });
                }}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderTopColor: '#E0E0E0',
                  borderTopWidth: 1,
                  borderBottomColor: '#E0E0E0',
                  borderBottomWidth: 1,
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    padding: 10,
                    borderColor: '#E0E0E0',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginVertical: 12,
                  }}
                >
                  <MaterialCommunityIcons
                    style={{ textAlign: 'center' }}
                    name="chevron-right"
                    size={24}
                    color="black"
                  />
                </View>

                <Text style={{ marginBottom: 12, fontWeight: '600' }}>
                  All Players
                </Text>
              </Pressable>
            )}
          </View>

          <View
            style={{
              marginHorizontal: 9,
              backgroundColor: 'white',
              padding: 12,
              borderRadius: 6,
            }}
          >
            <View>
              <Text style={{ fontSize: 18, fontWeight: '600' }}>QA</Text>
              <GameQAList gameID={local.id} />
            </View>
          </View>
          {isUserAdmin ? (
            <CancelGameButton gameID={game.game_id} />
          ) : userRequested ? (
            <Pressable
              style={{
                backgroundColor: 'red',
                marginTop: 'auto',
                marginBottom: 30,
                padding: 15,
                marginHorizontal: 10,
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontSize: 15,
                  fontWeight: '500',
                }}
              >
                CANCEL REQUEST
              </Text>
            </Pressable>
          ) : (
            <GameActions gameID={local.id} />
          )}
        </View>
      </ScrollView>
    </>
  );
}
