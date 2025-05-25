import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import type BottomSheet from '@gorhom/bottom-sheet';
import { addMinutes, parse, startOfDay } from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { useCreateGame } from '@/api/games/create-game';
import { useListVenues } from '@/api/venues/venues';
import DateTimeSheet from '@/components/create-game/datetimesheet';
import SportSheet from '@/components/create-game/sportsheet';
import VenueSheet, { type Venue } from '@/components/create-game/venuesheet';
import CustomHeader from '@/components/custom-header';

const TIMEZONE = 'Asia/Kathmandu';

// eslint-disable-next-line max-lines-per-function
export default function CreateGameScreen({
  openTime = '06:00',
  closeTime = '21:00',
}: {
  openTime?: string;
  closeTime?: string;
}) {
  const router = useRouter();
  const { mutate: createGame, isPending } = useCreateGame();

  const { venueID } = useLocalSearchParams();

  // State for selections
  const [sport, setSport] = useState<string | null>(null);
  const [venue, setVenue] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(
    startOfDay(new Date()).toISOString()
  );
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [visibility, setVisibility] = useState<string>('public');
  const [gameLevel, setGameLevel] = useState<string>('intermediate');
  const [instruction, setInstruction] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [format, setFormat] = useState<string>('');
  const [maxPlayers, setMaxPlayers] = useState<string>('');

  useEffect(() => {
    if (venueID) {
      const parsedId = Number(venueID);
      if (!isNaN(parsedId)) {
        setVenue(parsedId);
      } else {
        setVenue(null);
      }
    }
  }, [venueID]);

  // BottomSheet refs
  const sportSheetRef = useRef<BottomSheet>(null);
  const venueSheetRef = useRef<BottomSheet>(null);
  const dateTimeSheetRef = useRef<BottomSheet>(null);

  const closeAll = useCallback(() => {
    sportSheetRef.current?.close();
    venueSheetRef.current?.close();
    dateTimeSheetRef.current?.close();
  }, []);

  // API: Fetch venues based on selected sport
  const { data: venuesResponse, isLoading: venuesLoading } = useListVenues({
    variables: {
      sport: sport ? sport : 'futsal',
    },
  });

  const venues: Venue[] = venuesResponse?.data || [];
  console.log(venues);

  // Compute start_time and end_time (converting from Kathmandu to UTC)
  const startTime = useMemo(() => {
    if (!selectedDate || !selectedTime) return null;
    const baseDate = new Date(selectedDate);
    const parsedTime = parse(selectedTime, 'hh:mm aa', baseDate);
    const utcDate = fromZonedTime(parsedTime, TIMEZONE);
    return utcDate;
  }, [selectedDate, selectedTime]);

  const endTime = useMemo(() => {
    if (!startTime) return null;
    return addMinutes(startTime, selectedDuration);
  }, [startTime, selectedDuration]);

  const handleConfirmDateTime = useCallback(() => {
    if (!startTime || !endTime) {
      Alert.alert('Error', 'Please select both date and time.');
      return;
    }
    console.log(
      'Date Time Selected: ',
      startTime.toISOString(),
      endTime.toISOString()
    );
    closeAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, endTime]);

  const validateForm = () => {
    if (!sport) {
      Alert.alert('Error', 'Sport type is required');
      return false;
    }
    if (!venue) {
      Alert.alert('Error', 'Venue is required');
      return false;
    }
    if (!maxPlayers) {
      Alert.alert('Error', 'Maximum players is required');
      return false;
    }
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Date and time are required');
      return false;
    }
    return true;
  };

  const handleCreateGame = () => {
    closeAll();
    if (!validateForm()) return;
    if (!sport || !venue || !selectedDate || !startTime || !endTime) return;

    const payload: any = {
      sport_type: sport,
      venue_id: venue,
      max_players: Number(maxPlayers),
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      visibility: visibility,
    };
    if (price) payload.price = Number(price);
    if (format) payload.format = format;
    if (gameLevel) payload.game_level = gameLevel;
    if (instruction) payload.instruction = instruction;

    createGame(payload, {
      onSuccess: () => {
        Alert.alert('Success', 'Game created successfully');
        router.back();
      },
      onError: (error: any) => {
        Alert.alert(
          'Error',
          error.response?.data?.message || 'Failed to create game'
        );
      },
    });
  };

  return (
    <>
      <CustomHeader>
        <View className="px-4 pt-4">
          <View className="flex-row items-center gap-10">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </TouchableOpacity>
            <Text className="self-center rounded-2xl p-2 pl-5 text-2xl font-bold text-white">
              Create a Game
            </Text>
          </View>
        </View>
      </CustomHeader>

      <KeyboardAvoidingView
        className="flex-1 px-3 pt-4"
        behavior="padding"
        keyboardVerticalOffset={10}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Sport */}
          <TouchableOpacity
            className="mb-3 rounded border p-4"
            onPress={() => sportSheetRef.current?.expand()}
          >
            <Text>{sport || 'Select Sport'}</Text>
          </TouchableOpacity>

          {/* Venue */}
          <TouchableOpacity
            className="mb-3 rounded border p-4"
            onPress={() => {
              venueSheetRef.current?.expand();
            }}
          >
            <Text>
              {venue
                ? venues.find((v) => v.id === venue)?.name
                : 'Select Venue'}
            </Text>
          </TouchableOpacity>

          {/* Date & Time */}
          <TouchableOpacity
            className="mb-3 rounded border p-4"
            onPress={() => dateTimeSheetRef.current?.expand()}
          >
            <Text>
              {!startTime || !endTime
                ? 'Select Date & Time'
                : `${formatInTimeZone(startTime, TIMEZONE, 'EEEE h:mm aa')} - ${formatInTimeZone(endTime, TIMEZONE, 'h:mm aa')}`}
            </Text>
          </TouchableOpacity>

          {/* Visibility */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 20,
              marginTop: 7,
              marginVertical: 10,
            }}
          >
            <View>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  fontWeight: '500',
                }}
              >
                Game Visibility
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  justifyContent: 'center',
                }}
              >
                <Pressable
                  onPress={() => setVisibility('public')}
                  style={
                    visibility.includes('public')
                      ? {
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          backgroundColor: '#07bc0c',
                          width: 140,
                          justifyContent: 'center',
                          borderRadius: 7,
                          padding: 8,
                          borderColor: '#D0D0D0',
                          borderWidth: 1,
                        }
                      : {
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          backgroundColor: 'white',
                          width: 140,
                          justifyContent: 'center',
                          borderRadius: 7,
                          padding: 8,
                          borderColor: '#D0D0D0',
                          borderWidth: 1,
                        }
                  }
                >
                  <Ionicons
                    name="earth"
                    size={24}
                    color={visibility.includes('public') ? 'white' : 'black'}
                  />
                  <Text
                    style={
                      visibility.includes('public')
                        ? { color: 'white', fontWeight: 'bold', fontSize: 15 }
                        : { color: 'black', fontWeight: 'normal', fontSize: 15 }
                    }
                  >
                    Public
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setVisibility('private')}
                  style={
                    visibility.includes('private')
                      ? {
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          backgroundColor: '#07bc0c',
                          width: 140,
                          justifyContent: 'center',
                          borderRadius: 7,
                          padding: 8,
                          borderColor: '#D0D0D0',
                          borderWidth: 1,
                        }
                      : {
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          backgroundColor: 'white',
                          width: 140,
                          justifyContent: 'center',
                          borderRadius: 7,
                          padding: 8,
                          borderColor: '#D0D0D0',
                          borderWidth: 1,
                        }
                  }
                >
                  <AntDesign
                    name="lock1"
                    size={24}
                    color={visibility.includes('private') ? 'white' : 'black'}
                  />
                  <Text
                    style={
                      visibility.includes('private')
                        ? { color: 'white', fontWeight: 'bold', fontSize: 15 }
                        : { color: 'black', fontWeight: 'normal', fontSize: 15 }
                    }
                  >
                    Invite Only
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* Game Level */}
          <View className="mb-4">
            <Text className="mb-2 text-lg font-medium">Game Level</Text>
            <View className="flex-row justify-around">
              {['beginner', 'intermediate', 'advanced'].map((level) => {
                const isSelected = gameLevel === level;
                return (
                  <TouchableOpacity
                    key={level}
                    className={`rounded border border-[#D0D0D0] px-5 py-3 ${isSelected ? 'bg-[#07bc0c]' : 'bg-white'}`}
                    onPress={() => setGameLevel(level)}
                  >
                    <Text
                      className={`${isSelected ? 'font-bold text-white' : 'text-black'}`}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Total Players */}
          <View className="mb-4 flex-row items-center gap-3">
            <Text className="text-lg font-medium">Total Players</Text>
            <TextInput
              value={maxPlayers.toString()}
              keyboardType="numeric"
              onChangeText={(text) => setMaxPlayers(text)}
              className="w-52 rounded border border-gray-300 bg-white p-3"
              placeholder="Including You"
            />
          </View>

          {/* Format */}
          <View className="mb-4 flex-row items-center gap-2">
            <Text className="text-lg font-medium">Format</Text>
            <TextInput
              value={format}
              onChangeText={setFormat}
              placeholder="e.g., 5v5"
              maxLength={20}
              className="w-48 rounded border border-gray-300 bg-white p-3"
            />
          </View>

          {/* Price */}
          <View className="mb-4 flex-row items-center gap-2">
            <Text className="text-lg font-medium">Price</Text>
            <View className="rounded ">
              <View className="my-2 flex-row items-center rounded border border-gray-300 bg-white px-3">
                <Text className="mr-2 text-gray-600">Nrs</Text>
                <TextInput
                  onChangeText={setPrice}
                  value={price}
                  keyboardType="numeric"
                  placeholder="Price for each player"
                  className="w-32 py-3"
                />
              </View>
            </View>
          </View>

          {/* Instruction */}
          <View className="mb-4">
            <Text className="text-lg font-medium">Add Instructions</Text>
            <View className="rounded  pt-2">
              <TextInput
                onChangeText={setInstruction}
                multiline
                value={instruction}
                placeholder="Add Additional Instructions"
                className="rounded border border-gray-300 bg-white p-3"
              />
            </View>
          </View>

          {/* Submit */}
          <View className="py-5">
            <TouchableOpacity
              onPress={handleCreateGame}
              disabled={isPending}
              className={`mx-8 rounded-xl py-4 ${isPending ? 'bg-blue-300' : 'bg-green-700'}`}
            >
              {isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center font-bold text-white">
                  Create Game
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* BottomSheets */}
      <SportSheet
        bottomSheetRef={sportSheetRef}
        selectedSport={sport}
        onSelect={setSport}
      />
      <VenueSheet
        bottomSheetRef={venueSheetRef}
        venues={venues}
        loading={venuesLoading}
        onSelect={setVenue}
        sport={sport}
      />
      <DateTimeSheet
        bottomSheetRef={dateTimeSheetRef}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedTime={selectedTime}
        setSelectedTime={setSelectedTime}
        selectedDuration={selectedDuration}
        setSelectedDuration={setSelectedDuration}
        handleConfirm={handleConfirmDateTime}
        openTime={openTime}
        closeTime={closeTime}
      />
    </>
  );
}
