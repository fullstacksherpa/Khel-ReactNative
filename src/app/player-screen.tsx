import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useGamePlayers } from '@/api/games/get-game-player';
import CustomHeader from '@/components/custom-header';
import { getItem } from '@/lib/storage';

type GamePlayer = {
  id: number;
  first_name: string;
  profile_picture_url: string | null;
  skill_level: string | null;
  phone: string;
};

// eslint-disable-next-line max-lines-per-function
const PlayersScreen = () => {
  const router = useRouter();
  const USERID = getItem('USERID');
  const { gameId, adminId, timeRange } = useLocalSearchParams();
  const isUserGameAdmin: boolean =
    !!USERID && !!adminId && Number(USERID) === Number(adminId);

  const { data, isLoading, isError, error } = useGamePlayers({
    variables: { gameID: Number(gameId) },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#28c752" />
        <Text className="mt-2 text-gray-500">Loading players...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-red-500">Error: {error?.message}</Text>
      </View>
    );
  }

  const players = data?.data as GamePlayer[];

  const renderItem = ({ item }: { item: GamePlayer }) => (
    <View className="mb-3 flex-row items-center rounded-xl bg-white p-3 shadow-sm shadow-black/10">
      <Image
        source={{
          uri: item.profile_picture_url
            ? item.profile_picture_url
            : 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
        }}
        className="cover size-16 rounded-full"
      />
      <View className="ml-3 flex-1">
        <Text className="text-base font-bold text-gray-900">
          {item.first_name}
        </Text>
        <Text className="mt-0.5 text-sm text-gray-600">
          {item.skill_level ? item.skill_level : 'Beginner'}
        </Text>
      </View>
      {Number(item.id) === Number(adminId) ? (
        <Text className="text-md mr-4 rounded-2xl border border-mainGreen p-2 font-bold text-gray-600">
          Admin
        </Text>
      ) : null}
      {isUserGameAdmin && (
        <View style={{ marginRight: 10 }}>
          <TouchableOpacity
            style={{
              borderRadius: 10,
              backgroundColor: 'green',
              padding: 8,
            }}
            onPress={() => Linking.openURL(`tel:+977${item.phone}`)}
          >
            <FontAwesome5 name="phone-alt" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <>
      <CustomHeader>
        <View style={{ paddingHorizontal: 12, paddingVertical: 23 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </Pressable>
            <Text className="items-center self-center rounded-2xl border-2 border-white p-2 text-lg font-bold text-white">
              {timeRange}
            </Text>
          </View>
        </View>
      </CustomHeader>
      <View
        style={{
          backgroundColor: 'white',
          padding: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text className="items-center self-center text-2xl font-bold text-gray-700">
          All Players
        </Text>
      </View>
      <View className="flex-1">
        <FlatList
          data={players}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
        />
      </View>
    </>
  );
};

export default PlayersScreen;
