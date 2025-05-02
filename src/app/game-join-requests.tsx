import { Ionicons } from '@expo/vector-icons';
import { format, toZonedTime } from 'date-fns-tz';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';

import { useAcceptJoinRequest } from '@/api/game-admin/use-accept-join-request';
import { useListGameJoinRequests } from '@/api/game-admin/use-list-gamejoin-requests';
import { useRejectJoinRequest } from '@/api/game-admin/use-reject-join-request';
import CustomHeader from '@/components/custom-header';
import { getUserId } from '@/lib/auth/utils';

// eslint-disable-next-line max-lines-per-function
export default function GameJoinRequestsScreen() {
  const router = useRouter();
  const { gameID } = useLocalSearchParams();

  const rawUserID = getUserId();
  const userIDNumberConverted = rawUserID ? Number(rawUserID) : null;

  const { data, error, isLoading, refetch } = useListGameJoinRequests({
    variables: { gameID: Number(gameID) },
  });

  const {
    mutate: acceptJoinRequest,
    isPending: isAccepting,
    error: acceptError,
  } = useAcceptJoinRequest();

  const {
    mutate: rejectJoinRequest,
    isPending: isRejecting,
    error: rejectError,
  } = useRejectJoinRequest();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#28c752" />
        <Text className="mt-2 text-gray-500">Loading join requests...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-base text-red-600">Error: {error.message}</Text>
      </View>
    );
  }

  const callPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleAccept = (user_id: number) => {
    // Call the accept join request hook.
    acceptJoinRequest(
      { gameID: Number(gameID), user_id },
      {
        onSuccess: () => {
          refetch(); // refresh the join request list after accepting
        },
      }
    );
  };

  const handleReject = (user_id: number) => {
    rejectJoinRequest(
      { gameID: Number(gameID), user_id },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  return (
    <>
      <CustomHeader>
        <View style={{ paddingHorizontal: 12, paddingVertical: 23 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </Pressable>
            <View className="items-center self-center pl-10">
              <Text className="text-2xl text-white">Manage Requests</Text>
            </View>
          </View>
        </View>
      </CustomHeader>

      <View className="flex-1 bg-white p-4">
        {data?.data?.length ? (
          <FlatList
            data={data.data}
            keyExtractor={(item) => String(item.id)}
            // eslint-disable-next-line max-lines-per-function
            renderItem={({ item }) => {
              const kathmanduDate = toZonedTime(
                new Date(item.request_time),
                'Asia/Kathmandu'
              );
              const formattedDate = format(kathmanduDate, 'dd MMM, hh:mm aa', {
                timeZone: 'Asia/Kathmandu',
              });

              const isAdmin = item.user_id === userIDNumberConverted;

              return (
                <View className="flex-row items-center border-b border-gray-200 py-3">
                  {/* Profile Picture */}
                  <Image
                    source={
                      item.profile_picture_url.Valid &&
                      item.profile_picture_url.String
                        ? { uri: item.profile_picture_url.String }
                        : {
                            uri: 'https://t3.ftcdn.net/jpg/01/65/63/94/360_F_165639425_kRh61s497pV7IOPAjwjme1btB8ICkV0L.jpg',
                          }
                    }
                    className="mr-4 size-12 rounded-full"
                  />

                  {/* User Info */}
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-800">
                      {item.first_name}
                    </Text>
                    <Text className="text-sm text-gray-600">
                      Requested: {formattedDate}
                    </Text>
                  </View>

                  {isAdmin ? (
                    <View className="rounded border border-yellow-300 bg-yellow-100 px-3 py-1">
                      <Text className="text-sm font-semibold text-yellow-800">
                        Admin 🚀
                      </Text>
                    </View>
                  ) : (
                    <>
                      {/* Phone Icon */}
                      <Pressable
                        onPress={() => callPhone(item.phone)}
                        className="mr-4"
                      >
                        <Ionicons name="call" size={24} color="#2563eb" />
                      </Pressable>

                      {/* Accept/Reject Buttons */}
                      <View className="flex-row">
                        <Pressable
                          onPress={() => handleAccept(item.user_id)}
                          className="ml-2"
                        >
                          <Ionicons
                            name="checkmark-circle"
                            size={28}
                            color="green"
                          />
                        </Pressable>
                        <Pressable
                          className="ml-2"
                          onPress={() => handleReject(item.user_id)}
                        >
                          <Ionicons name="close-circle" size={28} color="red" />
                        </Pressable>
                      </View>
                    </>
                  )}
                </View>
              );
            }}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg text-gray-600">
              Oops! No game join requests...
            </Text>
          </View>
        )}
        {(acceptError || rejectError) && (
          <Text className="mt-4 text-center text-red-600">
            {acceptError
              ? `Error accepting request: ${acceptError.message}`
              : `Error rejecting request: ${rejectError?.message}`}
          </Text>
        )}
        {(isAccepting || isRejecting) && (
          <View className="mt-4 items-center">
            <ActivityIndicator size="small" color="#28c752" />
            <Text className="mt-1 text-gray-500">
              {isAccepting ? 'Accepting request...' : 'Rejecting request...'}
            </Text>
          </View>
        )}
      </View>
    </>
  );
}
