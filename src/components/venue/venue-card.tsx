import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

// Interface for individual courts
interface Court {
  id: string;
  name: string;
}

// Interface for each sport available
interface Sport {
  id: string;
  name: string;
  icon: string;
  price: number;
  courts: Court[];
}

// Interface for each facility or item in the list
export interface Facility {
  id: string;
  name: string;
  address: string;
  location: string;
  image: string;
  newImage: string;
  rating: number;
  timings: string;
  sportsAvailable: Sport[];
}

interface VenueCardProps {
  item: Facility;
}

const { width } = Dimensions.get('window');

// eslint-disable-next-line max-lines-per-function
const VenueCard = ({ item }: VenueCardProps) => {
  // const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  // Array of images for the carousel (swapable images)
  const images = [
    item.image,
    'https://lh3.googleusercontent.com/p/AF1QipOcYgj76vIPZotPrYrd8EuKv96Mz3OgYgDfyYBc=s680-w680-h510',
  ];

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setActiveIndex(index);
  };

  return (
    <View style={{ margin: 15 }}>
      <Pressable
        // onPress={() => {
        //   router.push('/venue-info-screen');
        // }}
        style={{
          backgroundColor: 'white',
          borderRadius: 5,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}
      >
        <View style={{ width: width - 30, overflow: 'hidden' }}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
            style={{ width: width - 30 }}
          >
            {images.map((uri, index) => (
              <Image
                key={index}
                style={{
                  width: width - 30,
                  height: 200,
                }}
                source={{ uri }}
              />
            ))}
          </ScrollView>

          {/* Carousel indicators */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 5,
            }}
          >
            {images.map((_, index) => (
              <View
                key={index}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  margin: 3,
                  backgroundColor:
                    activeIndex === index ? 'black' : 'lightgray',
                }}
              />
            ))}
          </View>
        </View>

        <View style={{ paddingVertical: 12, paddingHorizontal: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '500' }}>
              {item.name.length > 40
                ? item.name.substring(0, 40) + '...'
                : item.name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                backgroundColor: 'green',
                padding: 6,
                borderRadius: 6,
              }}
            >
              <AntDesign name="star" size={20} color="white" />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {item.rating}
              </Text>
            </View>
          </View>

          <Text style={{ color: 'gray' }}>
            {item?.address.length > 40
              ? item?.address.substring(0, 40) + '...'
              : item?.address}
          </Text>

          <View
            style={{
              height: 1,
              borderWidth: 0.6,
              borderColor: '#E0E0E0',
              marginVertical: 10,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Text>Upto 10% Off</Text>
            <Text style={{ fontWeight: '500' }}>INR 25O Onwards</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

export default VenueCard;
