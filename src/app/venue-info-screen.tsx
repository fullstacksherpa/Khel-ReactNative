import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import Amenities from '@/components/venue/amenities';

// import Amenities from '../components/Amenities';

// eslint-disable-next-line max-lines-per-function
const VenueInfoScreen = () => {
  // const navigation = useNavigation();

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'android' ? 35 : 0,
        }}
      >
        <ScrollView>
          <>
            <View>
              <Image
                style={{ width: '100%', height: 200, resizeMode: 'cover' }}
                source={{
                  uri: 'https://images.pexels.com/photos/3660204/pexels-photo-3660204.jpeg?auto=compress&cs=tinysrgb&w=800',
                }}
              />
            </View>
            <View style={{ padding: 10 }}>
              <Text style={{ fontSize: 20, fontWeight: '600' }}>
                {/* {route.params.name} */}
                Arena Futsal
              </Text>
              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Ionicons name="time-outline" size={24} color="black" />
                <Text style={{ fontSize: 15, fontWeight: '500' }}>
                  {/* {route.params.timings} */}
                  9-6
                </Text>
              </View>
              <View
                style={{
                  marginTop: 5,
                  flexDirection: 'row',

                  gap: 5,
                }}
              >
                <Ionicons name="location" size={24} color="black" />
                <Text style={{ fontSize: 14, width: '80%', fontWeight: '500' }}>
                  {/* {route.params.location} */}
                  Boudha, ramhiti
                </Text>
              </View>
            </View>
            <View
              style={{
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
            >
              <View>
                <View style={{ flexDirection: 'row' }}>
                  {[0, 0, 0, 0, 0].map((en, i) => (
                    <FontAwesome
                      key={i}
                      style={{ paddingHorizontal: 3 }}
                      name={i < Math.floor(3) ? 'star' : 'star-o'}
                      size={15}
                      color="#FFD700"
                    />
                  ))}
                  <Text>{9} (9 ratings)</Text>
                </View>
                <Pressable
                  style={{
                    marginTop: 6,
                    width: 160,
                    borderColor: '#686868',
                    borderWidth: 1,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}
                >
                  <Text>Rate Venue</Text>
                </Pressable>
              </View>
              <View style={{}}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ textAlign: 'center' }}>
                    100 total Activities{' '}
                  </Text>
                </View>
                <Pressable
                  style={{
                    marginTop: 6,
                    width: 160,
                    borderColor: '#686868',

                    borderWidth: 1,
                    borderRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  }}
                >
                  <Text>1 Upcoming</Text>
                </Pressable>
              </View>
            </View>
            <Text
              style={{ fontSize: 15, marginHorizontal: 10, fontWeight: '500' }}
            >
              Sports Available
            </Text>

            <Amenities />
          </>
        </ScrollView>
      </SafeAreaView>
      <View className="mx-auto mb-8 flex-row gap-4">
        <Pressable
          style={{
            width: '41%',
            marginTop: 10,
            borderWidth: 1,
            borderColor: '#787878',
            padding: 10,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <AntDesign name="plus" size={24} color="black" />
          <Text>Host Game</Text>
        </Pressable>

        <Pressable
          onPress={() => {}}
          style={{
            width: '41%',
            marginTop: 10,
            backgroundColor: 'green',
            borderWidth: 1,
            padding: 10,
            justifyContent: 'center',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <Text
            style={{ textAlign: 'center', color: 'white', fontWeight: 'bold' }}
          >
            Book Hourly
          </Text>
        </Pressable>
      </View>
    </>
  );
};

export default VenueInfoScreen;
