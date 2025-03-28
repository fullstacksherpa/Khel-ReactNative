import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';

// Define the types for the props
interface SportPickerProps {
  sport: string;
  setSport: React.Dispatch<React.SetStateAction<string>>;
}

// SportPicker Component
const SportPicker: React.FC<SportPickerProps> = ({ sport, setSport }) => {
  const data = [
    { key: '1', value: 'Basketball' },
    { key: '2', value: 'Tennis' },
    { key: '3', value: 'Futsal' },
    { key: '4', value: 'Hiking' },
  ];

  return (
    <View style={{ marginTop: 15, marginVertical: 10 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <MaterialCommunityIcons name="whistle" size={24} color="gray" />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 17, fontWeight: '500' }}>Sport</Text>
        </View>
        <Text
          style={{
            marginTop: 7,
            fontSize: 15,
            color: sport ? 'black' : 'gray',
            paddingHorizontal: sport ? 10 : 0,
            paddingVertical: sport ? 5 : 0,
            backgroundColor: sport ? '#d4edda' : 'transparent', // Light green background if sport is selected
            borderRadius: sport ? 100 : 0, // Rounded border if sport is selected
          }}
        >
          {sport || 'Eg Badminton / Football / Cricket'}
        </Text>
      </View>

      {/* Dropdown select list */}
      <View style={{ marginTop: 10 }}>
        <SelectList
          setSelected={setSport} // Update the selected sport
          data={data}
          save="value"
          placeholder="Select Sport"
          boxStyles={{
            backgroundColor: 'white',
            borderRadius: 8,
            elevation: 5,
          }}
        />
      </View>
    </View>
  );
};

export default SportPicker;
