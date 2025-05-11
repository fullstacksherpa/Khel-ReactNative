import { Ionicons } from '@expo/vector-icons';
import { type useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';

interface Props {
  selected: string;
  onSelect: (opt: any) => void;
  router: ReturnType<typeof useRouter>;
}

const OptionTabs: React.FC<Props> = ({ selected, onSelect, router }) => {
  const options = ['Home', 'Update Venue', 'Analytics', 'Pricing', 'Set Offer'];

  return (
    <View style={{ padding: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '500', color: 'white' }}>
          Next
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="chatbox-outline" size={24} color="white" />
          <Ionicons name="notifications-outline" size={24} color="white" />
          <Pressable onPress={() => router.push('/view-profile')}>
            <Image
              source={{
                uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJqcSD_2qz834cW2RuNWmvAbOMwcZdWSf81Q&s',
              }}
              style={{ width: 30, height: 30, borderRadius: 15 }}
            />
          </Pressable>
        </View>
      </View>

      <View style={{ marginVertical: 7, flexDirection: 'row' }}>
        {options.map((s) => (
          <Pressable
            key={s}
            onPress={() => onSelect(s)}
            style={{
              padding: 10,
              borderColor: 'white',
              borderWidth: selected === s ? 0 : 1,
              marginRight: 10,
              borderRadius: 8,
              backgroundColor: selected === s ? '#1dbf22' : 'transparent',
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 15 }}>
              {s}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

export default OptionTabs;
