import Feather from '@expo/vector-icons/Feather';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

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
    venue_lat: number;
    venue_lon: number;
  };
}

// eslint-disable-next-line max-lines-per-function
const Game: React.FC<GameProps> = ({ item }) => {
  const isUserInRequests = false;
  const router = useRouter();
  console.log('Game', item);

  return (
    <Pressable
      onPress={() => {
        router.push({
          pathname: '/login',
          params: { item: JSON.stringify(item) },
        });
      }}
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
        <Text style={{ color: 'gray' }}>Regular</Text>
        <Feather name="bookmark" size={24} color="black" />
      </View>

      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <Image
              style={{ width: 56, height: 56, borderRadius: 28 }}
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJqcSD_2qz834cW2RuNWmvAbOMwcZdWSf81Q&s',
              }}
            />
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginLeft: -7,
              }}
            >
              {item?.player_images?.map((imageUrl, index) => (
                <Image
                  key={index}
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    marginLeft: -7,
                  }}
                  source={{ uri: imageUrl }}
                />
              ))}
            </View>
          </View>

          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '500' }}>
              • {item?.current_player}/{item?.max_players} Going
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
              {item?.start_time}, {item?.end_time}
            </Text>
          </View>

          {item?.max_players === item?.current_player && (
            <Image
              style={{ width: 100, height: 70, resizeMode: 'contain' }}
              source={{
                uri: 'https://playo.co/_next/image?url=https%3A%2F%2Fplayo-website.gumlet.io%2Fplayo-website-v3%2Fmatch_full.png&w=256&q=75',
              }}
            />
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
        </View>
      </View>
    </Pressable>
  );
};

export default Game;
