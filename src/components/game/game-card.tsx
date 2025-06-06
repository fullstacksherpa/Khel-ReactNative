import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { AddShortlistButton } from './add-shortlist-button';
import FormattedDateTimeRange from './formatted-datetime-range';
import { StatusBadge } from './game-status-badge';
import { RemoveShortlistButton } from './remove-shortlist-button';

interface GameProps {
  item: {
    game_id: number;
    venue_id: number;
    venue_name: string;
    sport_type: string;
    price: number;
    format: string;
    game_admin_name: string;
    game_level: string;
    start_time: string;
    end_time: string;
    max_players: number;
    current_player: number;
    player_images: string[];
    is_booked: boolean;
    match_full: boolean;
    venue_lat: number;
    venue_lon: number;
    shortlisted: boolean;
    status: string;
  };
}

// eslint-disable-next-line max-lines-per-function
const Game: React.FC<GameProps> = ({ item }) => {
  const isMatchFull =
    item?.match_full || item?.max_players === item?.current_player;

  const shouldShowPrice =
    !item?.match_full &&
    item?.max_players !== item?.current_player &&
    item?.price != null;

  const isUserInRequests = false;
  return (
    <Link href={`/games/${item.game_id}`} asChild>
      <Pressable
        style={{
          marginVertical: 10,
          marginHorizontal: 14,
          padding: 14,
          backgroundColor: 'white',
          borderRadius: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: 'gray' }}>
            {item.format ? item.format : 'Regular'}
          </Text>

          {item?.shortlisted ? (
            <RemoveShortlistButton gameID={item.game_id} />
          ) : (
            <AddShortlistButton gameID={item.game_id} />
          )}
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row' }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: -7,
                }}
              >
                {item?.player_images?.length > 0 ? (
                  item.player_images.map((imageUrl, index) => (
                    <Image
                      key={index}
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        marginLeft: index === 0 ? 0 : -7,
                      }}
                      source={{ uri: imageUrl }}
                    />
                  ))
                ) : (
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      backgroundColor: '#ccc',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}
                    >
                      {item?.game_admin_name?.charAt(0)?.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '500' }}>
                {item?.current_player} /{item?.max_players} Going
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                backgroundColor: '#fffbde',
                borderRadius: 8,
                borderColor: '#EEDC82',
                borderWidth: 1,
              }}
            >
              <Text style={{ fontWeight: '500' }}>
                Only {item?.max_players - item?.current_player} slots left 🚀
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <Text style={{ marginTop: 10, color: 'gray', fontSize: 15 }}>
                {item?.game_admin_name}
              </Text>

              <Text style={{ marginTop: 10, fontSize: 14, fontWeight: '500' }}>
                <FormattedDateTimeRange
                  startUtc={item.start_time}
                  endUtc={item.end_time}
                  style={{ marginTop: 10, fontSize: 14, fontWeight: '500' }}
                />
              </Text>
            </View>

            {isMatchFull && (
              <Image
                style={{ width: 100, height: 70, resizeMode: 'contain' }}
                source={{
                  uri: 'https://playo.co/_next/image?url=https%3A%2F%2Fplayo-website.gumlet.io%2Fplayo-website-v3%2Fmatch_full.png&w=256&q=75',
                }}
              />
            )}

            {shouldShowPrice && (
              <View className="flex flex-row items-center justify-center rounded-2xl bg-[#E0E0E0] p-2">
                <MaterialCommunityIcons
                  name="currency-inr"
                  size={20}
                  color="black"
                />
                <Text style={{ fontSize: 16, fontWeight: '500' }}>
                  {item.price}
                </Text>
              </View>
            )}
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <SimpleLineIcons name="location-pin" size={20} color="black" />
            <Text
              style={{ fontSize: 15, flex: 1 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.venue_name}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                backgroundColor: '#E0E0E0',
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 7,
                marginTop: 12,
                alignSelf: 'flex-start',
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: '400' }}>
                {item?.game_level}
              </Text>
            </View>
            {isUserInRequests && (
              <View
                style={{
                  backgroundColor: '#4ba143',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 5,
                  marginTop: 10,
                }}
              >
                <Text style={{ textAlign: 'center', color: 'white' }}>
                  Requested
                </Text>
              </View>
            )}
            {item?.is_booked && (
              <View
                style={{
                  backgroundColor: '#4ba143',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 5,
                  marginTop: 10,
                }}
              >
                <Text style={{ textAlign: 'center', color: 'white' }}>
                  Venue Booked
                </Text>
              </View>
            )}
            {['active', 'cancelled', 'completed'].includes(item.status) ? (
              <StatusBadge
                status={item.status as 'active' | 'cancelled' | 'completed'}
              />
            ) : null}
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

export default React.memo(Game);
