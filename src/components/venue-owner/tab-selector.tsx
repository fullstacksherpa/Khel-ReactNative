import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TabButtonProps {
  title: string;
  selected: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ title, selected, onPress }) => (
  <TouchableOpacity
    className={`flex-1 items-center border-b-2 px-4 py-2 ${selected ? 'border-black' : 'border-transparent'}`}
    onPress={onPress}
  >
    <Text className={`${selected ? 'text-black' : 'text-gray-500'} text-lg`}>
      {title}
    </Text>
  </TouchableOpacity>
);

interface Props {
  activeTab: 'requests' | 'scheduled';
  onChangeTab: (tab: 'requests' | 'scheduled') => void;
}

const TabSelector: React.FC<Props> = ({ activeTab, onChangeTab }) => (
  <View className="flex-row border-b border-gray-200">
    <TabButton
      title="Requests"
      selected={activeTab === 'requests'}
      onPress={() => onChangeTab('requests')}
    />
    <TabButton
      title="Scheduled"
      selected={activeTab === 'scheduled'}
      onPress={() => onChangeTab('scheduled')}
    />
  </View>
);

export default TabSelector;
