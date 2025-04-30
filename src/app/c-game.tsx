import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import {
  addDays,
  addMinutes,
  format,
  isBefore,
  isEqual,
  parse,
  startOfDay,
} from 'date-fns';
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { date } from 'zod';

import { useCreateGame } from '@/api/games/create-game';
import { type Venue } from '@/api/venues/types';
import { useListVenues } from '@/api/venues/venues';
import CustomHeader from '@/components/custom-header';

const { width } = Dimensions.get('window');
const TIMEZONE = 'Asia/Kathmandu';

//
// Helper: Generate an array of dates (today + next 10 days)
//
const generateDatesArray = (numDays = 10) => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i <= numDays; i++) {
    const dateObj = addDays(today, i);
    const dayStart = startOfDay(dateObj);
    dates.push({
      // Display day number and abbreviated day name in Kathmandu time
      dayNum: formatInTimeZone(dayStart, TIMEZONE, 'dd'),
      dayLabel: formatInTimeZone(dayStart, TIMEZONE, 'EEE'),
      // Store full date as ISO string (midnight of that day)
      fullDate: dayStart.toISOString(),
    });
  }
  return dates;
};

//
// Helper: Generate time slots in 30-minute increments between openTime and closeTime
//
const generateTimeSlots = (openTime = '06:00', closeTime = '21:00') => {
  const slots = [];
  // Parse open and close times relative to an arbitrary reference date.
  const refDate = new Date();
  const open = parse(openTime, 'HH:mm', refDate);
  const close = parse(closeTime, 'HH:mm', refDate);

  let current = open;
  while (isBefore(current, close) || isEqual(current, close)) {
    // Format the time in the desired display format, e.g., '06:00 AM'
    const formatted = format(current, 'hh:mm aa');
    slots.push(formatted);
    current = addMinutes(current, 30);
  }
  return slots;
};

//
// Duration options (in minutes)
//
const durations = [
  { label: '1 hour', minutes: 60 },
  { label: '1 hour 30 minutes', minutes: 90 },
  { label: '2 hours', minutes: 120 },
];

const sports = [
  'futsal',
  'basketball',
  'badminton',
  'e-sport',
  'cricket',
  'tennis',
];
const sportIcons: Record<
  string,
  { Icon: typeof FontAwesome | typeof MaterialIcons; name: string }
> = {
  futsal: { Icon: FontAwesome, name: 'soccer-ball-o' },
  basketball: { Icon: MaterialIcons, name: 'sports-basketball' },
  badminton: { Icon: MaterialIcons, name: 'sports-tennis' }, // good alt
  'e-sport': { Icon: MaterialIcons, name: 'sports-esports' },
  cricket: { Icon: MaterialIcons, name: 'sports-cricket' },
  tennis: { Icon: MaterialIcons, name: 'sports-tennis' },
};
const gameLevels = ['beginner', 'intermediate', 'advanced'];
const visibilityOptions = ['public', 'private'];

type Props = {
  openTime?: string; // e.g. '06:00'
  closeTime?: string; // e.g. '21:00'
};

// eslint-disable-next-line max-lines-per-function
export default function CreateGameScreen({
  openTime = '06:00',
  closeTime = '21:00',
}: Props) {
  const { mutate: createGame, isPending } = useCreateGame();
  const router = useRouter();

  // Selection state
  const [sport, setSport] = useState<string | null>(null);
  const [venue, setVenue] = useState<number | null>(null);

  // Default selected date: today's midnight (in ISO string)
  const [selectedDate, setSelectedDate] = useState<string>(
    startOfDay(new Date()).toISOString()
  );
  // Selected time string, e.g. '06:00 AM'
  const [selectedTime, setSelectedTime] = useState<string>('');
  // Selected game duration in minutes
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [visibility, setVisibility] = useState<string>(visibilityOptions[0]);
  const [gameLevel, setGameLevel] = useState<string>(gameLevels[1]);
  const [instruction, setInstruction] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [format, setFormat] = useState<string>('');
  const [maxPlayers, setMaxPlayers] = useState<string>('');

  // Arrays for date and time pickers
  const datesArray = useMemo(() => generateDatesArray(10), []);
  const timeArray = useMemo(
    () => generateTimeSlots(openTime, closeTime),
    [openTime, closeTime]
  );

  //
  // Compute start_time as a Date (converted to UTC) from the selected date and time.
  //
  const startTime = useMemo(() => {
    if (!selectedDate || !selectedTime) return null;

    // Convert the stored ISO string to a Date (assumed at midnight)
    const baseDate = new Date(selectedDate);
    // Parse the selected time. The result will use the baseDate as reference.
    const parsedTime = parse(selectedTime, 'hh:mm aa', baseDate);
    // Create a Date object that combines the date and the time parts.
    // We treat parsedTime as if it were already in the Asia/Kathmandu time zone.
    // Convert that local Kathmandu time to UTC:
    const utcDate = fromZonedTime(parsedTime, TIMEZONE);
    return utcDate;
  }, [selectedDate, selectedTime]);

  //
  // Compute end_time by adding the selected duration (in minutes) to start_time.
  //
  const endTime = useMemo(() => {
    if (!startTime) return null;
    return addMinutes(startTime, selectedDuration);
  }, [startTime, selectedDuration]);

  const handleConfirm = useCallback(() => {
    if (!startTime || !endTime) {
      // Optionally display an alert if selections are incomplete.
      console.log('Please select a date and time.');
      return;
    }

    const finalStart = startTime.toISOString();
    const finalEnd = endTime.toISOString();

    console.log('Sending to backend:', {
      start_time: finalStart,
      end_time: finalEnd,
    });
    // Example: router.push or your API call here

    // Close the BottomSheet after confirmation.
    closeAll();
  }, [startTime, endTime]);

  const { data: venuesResponse, isLoading: venuesLoading } = useListVenues({
    variables: {
      sport: sport ? sport.charAt(0).toUpperCase() + sport.slice(1) : 'Futsal',
    },
  });
  const venues: Venue[] = venuesResponse?.data || [];

  // bottom sheet refs
  const sportSheet = useRef<BottomSheet>(null);
  const venueSheet = useRef<BottomSheet>(null);
  const dateSheet = useRef<BottomSheet>(null);
  const timeSheet = useRef<BottomSheet>(null);

  const closeAll = useCallback(() => {
    sportSheet.current?.close();
    venueSheet.current?.close();
    dateSheet.current?.close();
    timeSheet.current?.close();
  }, []);

  const snapPoints = useMemo(() => ['50%'], []);

  const DateTimeSnapPoints = useMemo(() => ['80%'], []);

  const VenueSnapPoints = useMemo(() => {
    return venues.length === 0 ? ['30%'] : ['80%'];
  }, [venues.length]);

  // Use useCallback for better performance if this function gets passed down
  const handleInstructionChange = useCallback((text: string) => {
    setInstruction(text);
  }, []);

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
    if (!date) {
      Alert.alert('Error', 'Date is required');
      return false;
    }
    return true;
  };

  const handleCreateGame = () => {
    closeAll();
    if (!validateForm()) return;
    if (!sport || !venue || !date || !startTime || !endTime) return;

    // Build payload matching CreateGamePayload
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
      onError: (error) => {
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
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={30} color="white" />
            </Pressable>
            <Text className="items-center self-center rounded-2xl  p-2 pl-5 text-2xl font-bold text-white">
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
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              closeAll();
              sportSheet.current?.expand();
            }}
          >
            <Text>{sport || 'Select Sport'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              closeAll();
              venueSheet.current?.expand();
            }}
          >
            <Text>
              {venue
                ? venues.find((v) => v.id === venue)?.name
                : 'Select Venue'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.input}
            onPress={() => {
              closeAll();
              dateSheet.current?.expand();
            }}
          >
            <Text>
              {startTime
                ? formatInTimeZone(startTime, TIMEZONE, 'yyyy-MM-dd HH:mm:ss')
                : 'Select Date'}
            </Text>
          </TouchableOpacity>

          <Text
            style={{
              borderColor: '#E0E0E0',
              borderWidth: 0.7,
              height: 1,
              marginVertical: 9,
            }}
          />

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

          <Text
            style={{
              borderColor: '#E0E0E0',
              borderWidth: 0.7,
              height: 1,
              marginVertical: 9,
            }}
          />

          {/* Game Level*/}
          <View className="pt-3">
            <Text style={{ marginBottom: 10, fontSize: 15, fontWeight: '500' }}>
              Game Level
            </Text>

            <Pressable
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                justifyContent: 'center',
              }}
            >
              {gameLevels.map((level) => {
                const isSelected = gameLevel === level;
                return (
                  <Pressable
                    key={level}
                    onPress={() => setGameLevel(level)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      backgroundColor: isSelected ? '#07bc0c' : 'white',
                      width: 110,
                      justifyContent: 'center',
                      borderRadius: 7,
                      padding: 8,
                      borderColor: '#D0D0D0',
                      borderWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? 'white' : 'black',
                        fontWeight: isSelected ? 'bold' : 'normal',
                        fontSize: isSelected ? 13 : 15,
                        textTransform: 'capitalize',
                      }}
                    >
                      {level}
                    </Text>
                  </Pressable>
                );
              })}
            </Pressable>
          </View>

          <Text
            style={{
              borderColor: '#E0E0E0',
              borderWidth: 0.7,
              height: 1,
              marginVertical: 14,
            }}
          />

          {/*Total player*/}

          <View className="flex flex-row items-center gap-3">
            <Text style={{ fontSize: 15, fontWeight: 500 }}>Total Players</Text>

            <View>
              <TextInput
                value={maxPlayers.toString()}
                keyboardType="numeric"
                onChangeText={(text) => setMaxPlayers(text)}
                style={{
                  width: 150,
                  padding: 10,
                  backgroundColor: 'white',
                  borderColor: '#D0D0D0',
                  borderWidth: 1,
                  borderRadius: 7,
                }}
                placeholder="Including You"
              />
            </View>
          </View>

          <Text
            style={{
              borderColor: '#E0E0E0',
              borderWidth: 0.7,
              height: 1,
              marginVertical: 16,
            }}
          />
          {/*Format*/}
          <View className="flex-row items-center gap-2">
            <Text style={{ fontSize: 15, fontWeight: 500 }}>Format</Text>
            <TextInput
              value={format}
              onChangeText={setFormat}
              placeholder="e.g., 5v5"
              maxLength={20}
              style={{
                padding: 10,
                backgroundColor: 'white',
                borderColor: '#D0D0D0',
                borderWidth: 1,
                marginVertical: 2,
                borderRadius: 7,
                width: 200,
              }}
            />
          </View>

          <Text
            style={{
              borderColor: '#E0E0E0',
              borderWidth: 0.7,
              height: 1,
              marginVertical: 15,
            }}
          />

          {/* Price */}
          <View className="flex flex-row items-center gap-2">
            <Text style={{ fontWeight: '500', fontSize: 15 }}>Price</Text>
            <View
              style={{
                backgroundColor: '#F0F0F0',
                borderRadius: 6,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                  backgroundColor: 'white',
                  borderColor: '#D0D0D0',
                  borderWidth: 1,
                  marginVertical: 8,
                  borderRadius: 7,
                }}
              >
                <Text style={{ marginRight: 6, color: '#555' }}>Nrs</Text>
                <TextInput
                  onChangeText={(text) => setPrice(text)}
                  value={price}
                  keyboardType="numeric"
                  placeholder="Price for each player"
                  style={{ width: 100, paddingVertical: 10 }}
                />
              </View>
            </View>
          </View>

          <Text
            style={{
              borderColor: '#E0E0E0',
              borderWidth: 0.7,
              height: 1,
              marginVertical: 15,
            }}
          />
          {/*Instruction*/}
          <View>
            <Text style={{ fontSize: 15, fontWeight: 500 }}>
              Add Instructions
            </Text>
            <View
              style={{
                paddingTop: 6,
                backgroundColor: '#F0F0F0',
                borderRadius: 6,
              }}
            >
              <TextInput
                onChangeText={handleInstructionChange}
                multiline
                value={instruction}
                style={{
                  padding: 10,
                  backgroundColor: 'white',
                  borderColor: '#D0D0D0',
                  borderWidth: 1,
                  marginVertical: 2,
                  borderRadius: 7,
                }}
                placeholder="Add Additional Instructions"
              />
            </View>
          </View>
          <Text
            style={{
              borderColor: '#E0E0E0',
              borderWidth: 0.7,
              height: 1,
              marginVertical: 9,
            }}
          />
          {/* Submit */}
          <View className="py-5">
            <TouchableOpacity
              onPress={handleCreateGame}
              disabled={isPending}
              className={`mx-8 rounded py-4 ${isPending ? 'bg-blue-300' : 'bg-mainGreen'}`}
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

          <Text
            style={{
              borderColor: '#E0E0E0',
              borderWidth: 0.7,
              height: 1,
              marginTop: 9,
              marginBottom: 12,
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Sport Sheet */}
      <BottomSheet
        ref={sportSheet}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <View className="mb-3">
          <Text className="items-center self-center text-2xl font-bold tracking-wider">
            Select Your Game
          </Text>
        </View>
        <BottomSheetFlatList
          data={sports}
          numColumns={2}
          keyExtractor={(item) => item}
          renderItem={({ item }) => {
            const { Icon, name } = sportIcons[item];

            return (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setSport(item);
                  sportSheet.current?.close();
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    borderWidth: 1,
                    borderColor: 'gray',
                    padding: 8,
                    width: width / 2.5,
                    gap: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: item === sport ? '#F59E0B' : 'white',
                    borderRadius: 7,
                  }}
                >
                  <Icon name={name as any} size={24} color="#333" />
                  <Text
                    style={{
                      fontSize: 16,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </BottomSheet>

      {/* Venue Sheet */}
      <BottomSheet
        ref={venueSheet}
        index={-1}
        snapPoints={VenueSnapPoints}
        enablePanDownToClose
      >
        {venuesLoading ? (
          <ActivityIndicator />
        ) : venues.length === 0 ? (
          <View className=" flex items-center justify-center">
            <Text className="text-center text-xl font-bold text-gray-500">
              {`No venues found for the sport ${sport}`}
            </Text>
          </View>
        ) : (
          <BottomSheetFlatList
            data={venues}
            keyExtractor={(v) => v.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => {
                  setVenue(item.id);
                  venueSheet.current?.close();
                }}
              >
                <Text className="font-medium">{item.name}</Text>
                <Text className="text-sm text-gray-500">{item.address}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </BottomSheet>

      {/* Date and time Sheet */}
      <BottomSheet ref={dateSheet} index={-1} snapPoints={DateTimeSnapPoints}>
        <TouchableOpacity
          className="mr-4  flex flex-row-reverse"
          onPress={() => closeAll()}
        >
          <AntDesign name="closecircleo" size={29} color="black" />
        </TouchableOpacity>
        {/* Title */}
        <View className="mb-3 mt-1">
          <Text className="self-center text-2xl font-bold tracking-wider">
            Pick a Date
          </Text>
        </View>

        {/* =========== DATE PICKER =========== */}
        <View className="mb-4">
          <BottomSheetFlatList
            data={datesArray}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.fullDate}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            renderItem={({ item }) => {
              const isSelected = item.fullDate === selectedDate;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedDate(item.fullDate)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    marginRight: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected ? '#F59E0B' : '#F0F0F0',
                    width: 60,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      marginBottom: 4,
                      fontSize: 27,
                      lineHeight: 30,
                    }}
                  >
                    {item.dayNum}
                  </Text>
                  <Text style={{ letterSpacing: 2 }}>{item.dayLabel}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View className="my-5">
          <Text className="self-center text-2xl font-bold tracking-wider">
            Game Start Time
          </Text>
        </View>

        {/* =========== TIME PICKER =========== */}
        <View className="mb-4">
          <BottomSheetFlatList
            data={timeArray}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, idx) => `${item}-${idx}`}
            contentContainerStyle={{ paddingHorizontal: 18 }}
            renderItem={({ item }) => {
              const isSelected = item === selectedTime;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedTime(item)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    marginRight: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected ? '#F59E0B' : '#F0F0F0',
                    minWidth: 70,
                  }}
                >
                  <Text
                    style={{ fontWeight: 'bold', padding: 4, fontSize: 16 }}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        <View className="my-5">
          <Text className="self-center text-2xl font-bold tracking-wider">
            Game Duration
          </Text>
        </View>

        {/* =========== DURATION PICKER =========== */}
        <View className="mb-4">
          <BottomSheetFlatList
            data={durations}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.label}
            contentContainerStyle={{ paddingHorizontal: 12 }}
            renderItem={({ item }) => {
              const isSelected = item.minutes === selectedDuration;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedDuration(item.minutes)}
                  style={{
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    marginRight: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected ? '#F59E0B' : '#F0F0F0',
                  }}
                >
                  <Text
                    style={{
                      fontWeight: 'bold',
                      paddingVertical: 4,
                      fontSize: 17,
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* =========== CONFIRM BUTTON =========== */}
        <View className="my-4 items-center">
          <TouchableOpacity
            onPress={handleConfirm}
            style={{
              backgroundColor: '#F59E0B',
              paddingVertical: 12,
              paddingHorizontal: 24,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: 'bold', color: '#fff' }}>Confirm</Text>
          </TouchableOpacity>
        </View>

        {/* Debug Info */}
        {startTime && endTime && (
          <View className="mb-2 px-3">
            <Text>
              Selected Start:{' '}
              {formatInTimeZone(startTime, TIMEZONE, 'yyyy-MM-dd HH:mm:ss')}
            </Text>
            <Text>
              Selected End:{' '}
              {formatInTimeZone(endTime, TIMEZONE, 'yyyy-MM-dd HH:mm:ss')}
            </Text>
          </View>
        )}
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: 'white' },
  heading: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
  input: { padding: 14, borderWidth: 1, borderRadius: 8, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  half: { width: (width - 48) / 2 },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  btnText: { color: '#FFF', fontWeight: '600' },
  item: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginBottom: 4,
  },
});
