import { AntDesign, FontAwesome } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { useVenue } from '@/api/venues/venues';
import Amenities from '@/components/venue/amenities';
import RatingBottomSheet from '@/components/venue/rating-bottomsheet'; // Adjust the import path as needed

const { width } = Dimensions.get('window');
const IMG_HEIGHT = 300;

// eslint-disable-next-line max-lines-per-function
const VenueDetails = () => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(
    scrollRef.current ? scrollRef : null
  );
  const local = useLocalSearchParams<{ id: string }>();

  const { data, isPending, isError } = useVenue({
    //@ts-ignore
    variables: { id: local.id },
  });
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [isRatingSheetOpen, setIsRatingSheetOpen] = useState(false);

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollOffset.value,
          [-IMG_HEIGHT, 0, IMG_HEIGHT],
          [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
        ),
      },
      {
        scale: interpolate(
          scrollOffset.value,
          [-IMG_HEIGHT, 0, IMG_HEIGHT],
          [2, 1, 1]
        ),
      },
    ],
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollOffset.value, [0, IMG_HEIGHT / 1.5], [0, 1]),
  }));

  const backButtonAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollOffset.value,
      [0, IMG_HEIGHT / 1.4],
      ['#d3d3d3', '#15803D']
    );

    return {
      backgroundColor,
    };
  });

  const handleImageScroll = (e: any) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const toggleExpanded = () => setExpanded(!expanded);

  const handleRatingSubmit = (rating: number, review: string) => {
    // You can integrate API calls or local state updates here.
    Alert.alert('Thank you!', `Rating: ${rating}\nReview: ${review}`);
  };

  if (isPending) {
    return (
      <View className="flex-1 justify-center  p-3">
        <Stack.Screen options={{ title: 'Venue', headerBackTitle: 'Back' }} />

        <ActivityIndicator />
      </View>
    );
  }
  if (isError) {
    return (
      <View className="flex-1 justify-center p-3">
        <Stack.Screen options={{ title: 'Post', headerBackTitle: 'Back' }} />

        <Text className="text-center">Error loading this Venue</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: '',
          headerLeft: () => (
            <View
              style={{ flexDirection: 'row', justifyContent: 'flex-start' }}
            >
              <TouchableOpacity onPress={() => router.back()}>
                <Animated.View
                  style={[styles.backButton, backButtonAnimatedStyle]}
                >
                  <Ionicons name="chevron-back" size={28} color="white" />
                </Animated.View>
              </TouchableOpacity>
            </View>
          ),
          headerBackground: () => (
            <Animated.View style={[styles.header, headerAnimatedStyle]} />
          ),
        }}
      />

      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Carousel */}
        <FlatList
          data={data.image_urls}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleImageScroll}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <Animated.Image
              source={{ uri: item }}
              style={[styles.image, imageAnimatedStyle]}
            />
          )}
        />
        {/* Indicators */}
        <View style={styles.indicatorContainer}>
          {data.image_urls.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                activeIndex === index && styles.activeIndicator,
              ]}
            />
          ))}
        </View>

        {/* Content */}
        <View style={{ padding: 10, flexDirection: 'row' }}>
          <View>
            <Text
              style={{
                fontSize: 25,
                fontWeight: '800',
                lineHeight: 40,
                letterSpacing: 2,
              }}
            >
              {data.name}
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
                {data.open_time}
              </Text>
            </View>
            <View
              style={{
                marginTop: 5,
                flexDirection: 'row',
                gap: 5,

                alignItems: 'center',
              }}
            >
              <Ionicons name="location" size={24} color="black" />
              <Text style={{ fontSize: 14, width: '80%', fontWeight: '500' }}>
                {data.address}
              </Text>
            </View>
          </View>
          <View style={{ marginRight: 10 }}>
            <TouchableOpacity
              style={{
                borderRadius: 10,
                backgroundColor: '#d3d3d3',
                padding: 10,
              }}
              onPress={() => Linking.openURL(`tel:+977${data.phone_number}`)}
            >
              <FontAwesome5 name="phone-alt" size={24} color="green" />
            </TouchableOpacity>
          </View>
        </View>

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
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {[0, 0, 0, 0, 0].map((_, i) => (
                <FontAwesome
                  key={i}
                  style={{ paddingHorizontal: 3 }}
                  name={i < Math.floor(data.average_rating) ? 'star' : 'star-o'}
                  size={15}
                  color="#F59E0B"
                />
              ))}
              <Text style={{ fontSize: 10 }}>
                {data.average_rating} ({data.total_reviews})
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
              onPress={() => setIsRatingSheetOpen(true)}
            >
              <Text>Rate Venue</Text>
            </Pressable>
          </View>
          <View>
            <Text
              style={{ fontSize: 15 }}
            >{`(${data.completed_games}) games completed`}</Text>
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
              <Text>{`${data.upcoming_games} Upcoming`}</Text>
            </Pressable>
          </View>
        </View>

        <View
          style={{
            height: 1,
            borderWidth: 0.7,
            borderColor: '#E0E0E0',
            marginVertical: 10,
          }}
        />
        <Amenities />
        <View
          style={{
            height: 1,
            borderWidth: 0.7,
            borderColor: '#E0E0E0',
            marginVertical: 10,
          }}
        />
        <View style={{ marginHorizontal: 16, marginTop: 20 }}>
          <Text style={{ marginBottom: 10, fontSize: 20, fontWeight: '600' }}>
            Description
          </Text>
          <Text style={{ fontSize: 16 }}>
            {expanded
              ? data.description
              : data.description?.slice(0, 200) + '..... '}
            <Text
              onPress={toggleExpanded}
              style={{ color: 'green', fontWeight: 'bold' }}
            >
              {expanded ? 'Show less' : 'Read more'}
            </Text>
          </Text>
        </View>
        <View
          style={{
            height: 1,
            borderWidth: 0.7,
            borderColor: '#E0E0E0',
            marginVertical: 10,
          }}
        />
        <View>
          <Text>check all review</Text>
        </View>
        <View
          style={{
            height: 1,
            borderWidth: 0.7,
            borderColor: '#E0E0E0',
            marginVertical: 10,
          }}
        />
        <View style={{ alignItems: 'center', marginVertical: 20 }}>
          <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>
            View Cancellation Policy
          </Text>
        </View>
      </Animated.ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginBottom: 20,
        }}
      >
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

      {/* Rating Bottom Sheet */}
      <RatingBottomSheet
        isOpen={isRatingSheetOpen}
        onClose={() => setIsRatingSheetOpen(false)}
        onSubmit={handleRatingSubmit}
        name="Arena futsal"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  backButton: { padding: 5, borderRadius: 100 },
  image: { width, height: IMG_HEIGHT, resizeMode: 'cover' },
  header: { backgroundColor: '#15803D', height: 100 },
  indicatorContainer: {
    position: 'relative',
    bottom: 20,
    flexDirection: 'row',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    alignSelf: 'center',
  },
  indicator: {
    height: 6,
    width: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginHorizontal: 4,
  },
  activeIndicator: { backgroundColor: '#15803D' },
});

export default VenueDetails;
