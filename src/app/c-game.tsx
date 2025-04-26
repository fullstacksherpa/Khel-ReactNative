import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
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

import { useCreateGame } from '@/api/games/create-game';
import { type Venue } from '@/api/venues/types';
import { useListVenues } from '@/api/venues/venues';
import CustomHeader from '@/components/custom-header';
import { formatKathmandu, toKathmanduISOString } from '@/lib/date-utils';

const { width } = Dimensions.get('window');

const sports = [
  'futsal',
  'basketball',
  'badminton',
  'e-sport',
  'cricket',
  'tennis',
];
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
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<string>(visibilityOptions[0]);
  const [gameLevel, setGameLevel] = useState<string>(gameLevels[1]);
  const [instruction, setInstruction] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [format, setFormat] = useState<string>('');
  const [maxPlayers, setMaxPlayers] = useState<string>('');

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
  const timeTarget = useRef<'start' | 'end'>('start');

  // generate next 7 days
  const dates = useMemo(() => {
    const arr: Date[] = [];
    const now = new Date();
    for (let i = 0; i <= 7; i++) {
      const d = new Date(now.getTime() + i * 24 * 3600_000);
      arr.push(d);
    }
    return arr;
  }, []);

  // generate times
  const times = useMemo(() => {
    const list: string[] = [];
    const [h1, m1] = openTime.split(':').map(Number);
    const [h2, m2] = closeTime.split(':').map(Number);
    const base = new Date();
    base.setHours(h1, m1, 0, 0);
    const end = new Date();
    end.setHours(h2, m2, 0, 0);
    let cur = new Date(base);
    while (cur <= end) {
      list.push(formatKathmandu(cur, 'h:mm a'));
      cur = new Date(cur.getTime() + 30 * 60_000);
    }
    return list;
  }, [openTime, closeTime]);

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
    // build ISO strings
    const dt = new Date(date);
    const [sh, sm] = startTime
      .match(/(\d+):(\d+)\s?(AM|PM)/i)!
      .slice(1, 3)
      .map(Number);
    dt.setHours(sh + (startTime.includes('PM') && sh < 12 ? 12 : 0), sm);
    const isoStart = toKathmanduISOString(dt);

    const dt2 = new Date(date);
    const [eh, em] = endTime
      .match(/(\d+):(\d+)\s?(AM|PM)/i)!
      .slice(1, 3)
      .map(Number);
    dt2.setHours(eh + (endTime.includes('PM') && eh < 12 ? 12 : 0), em);
    const isoEnd = toKathmanduISOString(dt2);

    // Build payload matching CreateGamePayload
    const payload: any = {
      sport_type: sport,
      venue_id: venue,
      max_players: Number(maxPlayers),
      start_time: isoStart,
      end_time: isoEnd,
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
              {date ? formatKathmandu(date, 'dd MMM yyyy') : 'Select Date'}
            </Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.input, styles.half]}
              onPress={() => {
                timeTarget.current = 'start';
                timeSheet.current?.expand();
              }}
            >
              <Text>{startTime || 'Start Time'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.input, styles.half]}
              onPress={() => {
                timeTarget.current = 'end';
                timeSheet.current?.expand();
              }}
            >
              <Text>{endTime || 'End Time'}</Text>
            </TouchableOpacity>
          </View>

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
            <View style={{ marginHorizontal: 10 }}>
              <Text
                style={{
                  marginBottom: 10,
                  fontSize: 15,
                  fontWeight: '500',
                  marginLeft: 17,
                }}
              >
                Game Visibility
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 15,
                  marginHorizontal: 20,
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
                          borderRadius: 6,
                          padding: 10,
                        }
                      : {
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          backgroundColor: 'white',
                          width: 140,
                          justifyContent: 'center',
                          borderRadius: 6,
                          padding: 10,
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
                        : { color: 'black', fontWeight: 'bold', fontSize: 15 }
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
                          borderRadius: 6,
                          padding: 10,
                        }
                      : {
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          backgroundColor: 'white',
                          width: 140,
                          justifyContent: 'center',
                          borderRadius: 6,
                          padding: 10,
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
                        : { color: 'black', fontWeight: 'bold', fontSize: 15 }
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
          <View>
            <Text style={{ marginBottom: 10, fontSize: 15, fontWeight: '500' }}>
              Game Level
            </Text>

            <Pressable
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
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
                      width: 120,
                      justifyContent: 'center',
                      borderRadius: 3,
                      padding: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected ? 'white' : 'black',
                        fontWeight: isSelected ? 'bold' : 'normal',
                        fontSize: 15,
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
              marginVertical: 9,
            }}
          />

          {/*Total player*/}

          <View>
            <Text style={{ fontSize: 16 }}>Total Players</Text>
            <View
              style={{
                padding: 10,
                backgroundColor: '#F0F0F0',
                marginTop: 10,
                borderRadius: 6,
              }}
            >
              <View style={{ marginVertical: 5 }}>
                <View>
                  <TextInput
                    value={maxPlayers.toString()}
                    keyboardType="numeric"
                    onChangeText={(text) => setMaxPlayers(text)}
                    style={{
                      padding: 10,
                      backgroundColor: 'white',
                      borderColor: '#D0D0D0',
                      borderWidth: 1,
                    }}
                    placeholder="Total Players (including you)"
                  />
                </View>
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

          {/*Instruction*/}
          <View>
            <Text style={{ marginTop: 20, fontSize: 16 }}>
              Add Instructions
            </Text>
            <View
              style={{
                padding: 10,
                backgroundColor: '#F0F0F0',
                marginTop: 10,
                borderRadius: 6,
              }}
            >
              <TextInput
                onChangeText={handleInstructionChange}
                value={instruction}
                style={{
                  padding: 10,
                  backgroundColor: 'white',
                  borderColor: '#D0D0D0',
                  borderWidth: 1,
                  marginVertical: 8,
                  borderRadius: 6,
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

          {/*Format*/}
          <View className="mb-4">
            <Text>Format</Text>
            <TextInput
              value={format}
              onChangeText={setFormat}
              placeholder="e.g., 5v5"
              maxLength={20}
              className="rounded border p-2"
            />
          </View>

          <Text
            style={{
              borderColor: '#E0E0E0',
              borderWidth: 0.7,
              height: 1,
              marginVertical: 9,
            }}
          />

          {/* Price */}
          <View>
            <Text>Price</Text>
            <View
              style={{
                padding: 10,
                backgroundColor: '#F0F0F0',
                marginTop: 10,
                borderRadius: 6,
              }}
            >
              <TextInput
                onChangeText={(text) => setPrice(text)}
                value={price}
                style={{
                  padding: 10,
                  backgroundColor: 'white',
                  borderColor: '#D0D0D0',
                  borderWidth: 1,
                  marginVertical: 8,
                  borderRadius: 6,
                }}
                placeholder="Price for each player"
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
        </ScrollView>
      </KeyboardAvoidingView>
      {/* Sport Sheet */}
      <BottomSheet
        ref={sportSheet}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <BottomSheetFlatList
          data={sports}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                setSport(item);
                sportSheet.current?.close();
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </BottomSheet>

      {/* Venue Sheet */}
      <BottomSheet
        ref={venueSheet}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        {venuesLoading ? (
          <ActivityIndicator />
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

      {/* Date Sheet */}
      <BottomSheet
        ref={dateSheet}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <BottomSheetFlatList
          data={dates}
          keyExtractor={(d) => d.toISOString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                setDate(item);
                dateSheet.current?.close();
              }}
            >
              <Text>{formatKathmandu(item, 'dd MMM yyyy')}</Text>
            </TouchableOpacity>
          )}
        />
      </BottomSheet>

      {/* Time Sheet */}
      <BottomSheet
        ref={timeSheet}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <BottomSheetFlatList
          data={times}
          keyExtractor={(t) => t}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                if (timeTarget.current === 'start') setStartTime(item);
                else setEndTime(item);
                timeSheet.current?.close();
              }}
            >
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </BottomSheet>

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
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
});
