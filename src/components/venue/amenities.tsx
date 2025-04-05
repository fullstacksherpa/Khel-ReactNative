import { Text, View } from 'react-native';

const Amenities = () => {
  const services = [
    {
      id: '0',
      name: 'First Aid',
    },
    {
      id: '2',
      name: 'free wifi',
    },
    {
      id: '3',
      name: 'Wash Rooms',
    },
    {
      id: '4',
      name: 'Change Rooms',
    },
    {
      id: '5',
      name: 'Drinking Water',
    },
    {
      id: '6',
      name: 'Juice',
    },
    {
      id: '7',
      name: 'Fitness Coach',
    },
    {
      id: '8',
      name: "Member's Lounge",
    },
  ];
  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 30, fontWeight: '600', marginVertical: 8 }}>
        Amenities
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {services.map((item, index) => (
          <View
            style={{
              margin: 10,
              backgroundColor: '#10D000',
              paddingHorizontal: 6,
              paddingVertical: 6,
              borderRadius: 8,
            }}
            key={index}
          >
            <Text style={{ textAlign: 'center', color: 'white' }}>
              {item.name}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default Amenities;
