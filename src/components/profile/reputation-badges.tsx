import { useRouter } from 'expo-router';
import { BadgeDollarSign, Clock } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ReputationBadgesProps {
  punctual: number;
  paymentOnTime: number;
}

const ReputationBadges: React.FC<ReputationBadgesProps> = ({
  punctual,
  paymentOnTime,
}) => {
  const router = useRouter();

  return (
    <View className="my-2 rounded-xl bg-gray-100 p-4">
      <View className="flex-row justify-between">
        <Text className="text-base font-semibold">Reputation Badges</Text>
        <TouchableOpacity onPress={() => router.push('/badges')}>
          <Text className="font-semibold text-green-500">See All</Text>
        </TouchableOpacity>
      </View>
      <View className="mt-4 flex-row justify-around">
        <View className="items-center">
          <Clock size={32} color="#00BFFF" />
          <Text className="mt-1 text-xs">Punctual ({punctual})</Text>
        </View>
        <View className="items-center">
          <BadgeDollarSign size={32} color="#00BFFF" />
          <Text className="mt-1 text-xs">
            Payment On Time ({paymentOnTime})
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReputationBadges;
