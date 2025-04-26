import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SportPickerProps {
  sport: string;
  onPress: () => void;
}

const SportPicker: React.FC<SportPickerProps> = ({ sport, onPress }) => {
  return (
    <View style={{ marginVertical: 10 }}>
      <TouchableOpacity
        onPress={onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: '#ddd',
          backgroundColor: '#fff',
        }}
      >
        <MaterialCommunityIcons name="whistle" size={24} color="gray" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 17, fontWeight: '500' }}>Sport</Text>
        </View>
        <Text
          style={{
            fontSize: 15,
            color: sport ? 'black' : 'gray',
          }}
        >
          {sport || 'Select…'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SportPicker;
