import React from 'react';
import { Image, Text, View } from 'react-native';

interface ProfileHeaderProps {
  username: string;
  games: number;
  playpals: number;
  karma: number;
  lastPlayed: string;
  uri: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  username,
  games,
  playpals,
  karma,
  lastPlayed,
  uri,
}) => (
  <View className="items-center p-4">
    <Image source={{ uri: uri }} className="mb-2 size-20 rounded-full" />
    <View className="my-2 flex-row">
      <View className="mx-3 items-center">
        <Text className="text-lg font-bold">{games}</Text>
        <Text className="text-xs text-gray-500">GAMES</Text>
      </View>
      <View className="mx-3 items-center">
        <Text className="text-lg font-bold">{playpals}</Text>
        <Text className="text-xs text-gray-500">PLAYPALS</Text>
      </View>
      <View className="mx-3 items-center">
        <Text className="text-lg font-bold">{karma}</Text>
        <Text className="text-xs text-gray-500">KARMA</Text>
      </View>
    </View>
    <Text className="mt-2 text-lg font-semibold">{username}</Text>
    <Text className="text-xs text-gray-500">Last played on {lastPlayed}</Text>
  </View>
);

export default ProfileHeader;
