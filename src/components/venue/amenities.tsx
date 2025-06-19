import { Text, View } from 'react-native';

type Props = {
  data: string[];
};

const Amenities = ({ data }: Props) => {
  return (
    <View className="p-3">
      <Text className="my-1.5 text-xl font-semibold">Amenities</Text>
      <View className="flex-row flex-wrap items-center">
        {data.map((item, index) => (
          <View key={index} className="m-2 rounded-md bg-gray-200 px-2 py-1.5">
            <Text className="text-center font-semibold tracking-wider text-gray-800">
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Amenities;
