import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const CARD_WIDTH = Dimensions.get('window').width - 25;
const IMAGE_HEIGHT = 190;

type VenueCardProps = {
  item: {
    image: string;
    name: string;
    address: string;
    price?: string;
    rating?: number;
  };
};

// eslint-disable-next-line max-lines-per-function
const VenueCard = ({ item }: VenueCardProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const images = [
    item.image,
    'https://lh3.googleusercontent.com/p/AF1QipOcYgj76vIPZotPrYrd8EuKv96Mz3OgYgDfyYBc=s680-w680-h510',
  ];

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View
      style={{
        marginVertical: 15,
        backgroundColor: '#fff',
        marginHorizontal: 8,
        borderRadius: 16,
      }}
    >
      <Link href={`/venue-info-screen`} asChild>
        <Pressable
          style={{
            borderRadius: 11,
            overflow: 'hidden',
          }}
        >
          <FlatList
            horizontal
            data={images}
            keyExtractor={(_, index) => index.toString()}
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onScroll={handleScroll}
            renderItem={({ item }) => (
              <View className=" p-2">
                <Image
                  source={{ uri: item }}
                  style={{
                    borderRadius: 11,
                    width: CARD_WIDTH,
                    height: IMAGE_HEIGHT,
                    resizeMode: 'cover',
                  }}
                />
              </View>
            )}
          />
          {/*indicator */}

          <View
            style={{ paddingTop: 4, paddingBottom: 8, paddingHorizontal: 12 }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '500' }}>
                {item.name.length > 28
                  ? item.name.substring(0, 28) + '...'
                  : item.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: '#90EE90',
                  padding: 3,
                  borderRadius: 6,
                }}
              >
                <AntDesign name="star" size={18} color="#15803D" />
                <Text style={{ color: '#15803D', fontWeight: 'bold' }}>
                  {item.rating}
                </Text>
              </View>
            </View>

            <Text style={{ color: 'gray' }}>
              {item?.address.length > 28
                ? item?.address.substring(0, 28) + '...'
                : item?.address}
            </Text>

            <View
              style={{
                height: 1,
                borderWidth: 0.7,
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
              <Text>05:00 AM - 11:00 PM</Text>
              <Text style={{ fontWeight: '500' }}>Rs 25O Onwards</Text>
            </View>
          </View>
        </Pressable>
      </Link>
      <View style={styles.indicatorContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              activeIndex === index && styles.activeIndicator,
            ]}
          />
        ))}
      </View>

      <Pressable
        onPress={() => setIsFavorite(!isFavorite)}
        style={styles.favoriteButton}
      >
        <MaterialIcons
          name={isFavorite ? 'favorite' : 'favorite-border'}
          size={24}
          color={isFavorite ? 'red' : 'black'}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  indicatorContainer: {
    position: 'absolute',
    bottom: 110,
    right: 170,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  indicator: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: '#999',
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: '#000',
  },
  infoContainer: {
    padding: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  location: {
    color: 'gray',
    marginBottom: 4,
  },
  price: {
    fontWeight: '600',
    color: '#15803D',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    elevation: 5,
  },
});

export default VenueCard;
