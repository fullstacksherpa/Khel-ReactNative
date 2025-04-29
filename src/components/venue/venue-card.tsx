import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

const CARD_WIDTH = Dimensions.get('window').width - 25;
const IMAGE_HEIGHT = 190;

type VenueCardProps = {
  item: {
    id: number;
    name: string;
    address: string;
    image_urls: string[];
    location: number[]; // [longitude, latitude]
    open_time: string;
    phone_number: string;
    sport: string;
    total_reviews: number;
    average_rating: number;
  };
};

// eslint-disable-next-line max-lines-per-function
const VenueCard = ({ item }: VenueCardProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

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
      <Link href={`/venue/${item.id}`} asChild>
        <Pressable
          style={{
            borderRadius: 11,
            overflow: 'hidden',
          }}
        >
          <FlatList
            horizontal
            data={item.image_urls}
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
                  {`${item.average_rating} (${item.total_reviews})`}
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
              <Text>{item.open_time}</Text>
              <TouchableOpacity
                className="pr-3"
                onPress={() => Linking.openURL(`tel:+977${item.phone_number}`)}
              >
                <FontAwesome5 name="phone-alt" size={23} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Link>
      <View style={styles.indicatorContainer}>
        {item.image_urls.map((_, index) => (
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
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  indicator: {
    height: 7,
    width: 7,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginHorizontal: 3,
  },
  activeIndicator: {
    backgroundColor: '#15803D',
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
