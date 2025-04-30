import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

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
  badminton: { Icon: MaterialIcons, name: 'sports-tennis' },
  'e-sport': { Icon: MaterialIcons, name: 'sports-esports' },
  cricket: { Icon: MaterialIcons, name: 'sports-cricket' },
  tennis: { Icon: MaterialIcons, name: 'sports-tennis' },
};

type SportSheetProps = {
  bottomSheetRef: React.RefObject<BottomSheet>;
  selectedSport: string | null;
  onSelect: (sport: string) => void;
  snapPoints?: string[];
};

export default function SportSheet({
  bottomSheetRef,
  selectedSport,
  onSelect,
  snapPoints = ['50%'],
}: SportSheetProps) {
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose
    >
      <View className="mb-5">
        <Text className="text-center text-2xl font-bold tracking-wider">
          Select Your Game
        </Text>
      </View>
      <BottomSheetFlatList
        data={sports}
        numColumns={2}
        keyExtractor={(item) => item}
        contentContainerClassName="mx-auto"
        renderItem={({ item }) => {
          const { Icon, name } = sportIcons[item];
          const isSelected = item === selectedSport;
          return (
            <TouchableOpacity
              className={`m-2 flex  flex-row items-center justify-center  gap-4 rounded border border-gray-400 p-3 ${
                isSelected ? 'bg-highlightYellow' : 'bg-white'
              }`}
              style={{ width: width / 2.3 }}
              onPress={() => {
                onSelect(item);
                bottomSheetRef.current?.close();
              }}
            >
              <Icon name={name as any} size={28} color="#333" />
              <Text className="text-center text-xl">{item}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </BottomSheet>
  );
}
