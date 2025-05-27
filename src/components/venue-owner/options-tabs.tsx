import { Ionicons } from '@expo/vector-icons';
import { type useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { UserAvatar } from '@/components/profile/user-avatar';

interface Props {
  selected: string;
  onSelect: (opt: any) => void;
  router: ReturnType<typeof useRouter>;
}

const OptionTabs: React.FC<Props> = ({ selected, onSelect, router }) => {
  const options = [
    'Home',
    'Update Venue',
    'Update Images',
    'Pricing',
    'Set Offer',
  ];

  return (
    <View style={{ padding: 12 }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: '500', color: 'green' }}>
          .
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name="chatbox-outline" size={24} color="white" />
          <Ionicons name="notifications-outline" size={24} color="white" />
          <Pressable onPress={() => router.push('/view-profile')}>
            <UserAvatar />
          </Pressable>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
      </ScrollView>
    </View>
  );
};

export default OptionTabs;
