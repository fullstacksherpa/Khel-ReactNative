import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { useCurrentUser } from '@/api/auth/use-current-user';
import CustomHeader from '@/components/custom-header';

const ViewProfile = () => {
  const router = useRouter();

  const { data: user, isLoading } = useCurrentUser();

  if (isLoading || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
  return (
    <>
      <CustomHeader>
        <View style={{ paddingHorizontal: 12, paddingVertical: 12 }}>
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
            <Pressable onPress={() => router.push('/edit-profile')}>
              <FontAwesome5 name="user-edit" size={24} color="white" />
            </Pressable>
          </View>
        </View>
      </CustomHeader>
      <ScrollView className="flex-1 bg-white px-4 py-8">
        <View className="mb-6 items-center">
          {user.profile_picture_url ? (
            <Image
              source={{ uri: user.profile_picture_url }}
              className="size-24 rounded-full"
            />
          ) : (
            <View className="size-24 items-center justify-center rounded-full bg-gray-300">
              <Text className="text-xl font-bold text-white">
                {user.first_name[0]?.toUpperCase()}
              </Text>
            </View>
          )}
          <Text className="mt-4 text-xl font-semibold">
            {user.first_name} {user.last_name}
          </Text>
          <Text className="capitalize text-gray-600">
            Skill Level: {user.skill_level}
          </Text>
          <Text className="mt-1 text-gray-500">
            Joined: {format(new Date(user.created_at), 'MMMM d, yyyy')}
          </Text>
        </View>
        <View className="mt-20 items-center">
          <Text>Point and badges coming soon ....</Text>
        </View>
      </ScrollView>
    </>
  );
};

export default ViewProfile;
