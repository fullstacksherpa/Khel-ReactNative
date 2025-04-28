import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ActiveLevelProps {
  level: 'Warming Up' | 'Active' | 'Super Active' | 'On Fire';
}

const levels = ['Warming Up', 'Active', 'Super Active', 'On Fire'] as const;

const ActiveLevel: React.FC<ActiveLevelProps> = ({ level }) => {
  const router = useRouter();

  return (
    <View className="my-2 rounded-xl bg-gray-100 p-4">
      <View className="flex-row justify-between">
        <Text className="text-base font-semibold">Active Level</Text>
        <TouchableOpacity onPress={() => router.push('/learn-more')}>
          <Text className="font-semibold text-green-500">Learn More</Text>
        </TouchableOpacity>
      </View>
      <View className="mt-4 flex-row justify-around">
        {levels.map((item) => (
          <View key={item} className="items-center">
            <View
              className={[
                'w-5 h-5 rounded-full mb-1',
                item === level ? 'bg-red-400' : 'bg-gray-300',
              ].join(' ')}
            />
            <Text className="text-center text-[10px]">{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ActiveLevel;
