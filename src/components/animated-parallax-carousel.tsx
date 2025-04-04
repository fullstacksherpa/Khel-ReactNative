import React from 'react';
import {
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, { useSharedValue } from 'react-native-reanimated';

import ParallaxCarouselCard from '@/components/venue/parallax-carousel-card';
import ParallaxCarouselPagination from '@/components/venue/parallax-carousel-pagination';
import mockCarouselItems from '@/mock/index';

const OFFSET = 45;
const ITEM_WIDTH = Dimensions.get('window').width - OFFSET * 2;

const AnimationParallaxCarousel = () => {
  const scrollX = useSharedValue(0);
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
  };
  return (
    <View style={styles.parallaxCarouselView}>
      <Animated.ScrollView
        horizontal
        decelerationRate={'fast'}
        snapToInterval={ITEM_WIDTH}
        bounces={false}
        disableIntervalMomentum
        scrollEventThrottle={12}
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll bar
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
      >
        {mockCarouselItems.map((item, index) => (
          <ParallaxCarouselCard
            item={item}
            key={index}
            id={index}
            scrollX={scrollX}
            total={mockCarouselItems.length}
          />
        ))}
      </Animated.ScrollView>
      <View>
        <Text>hello onghcen</Text>
      </View>
      <View>
        <Text>hello onghcen</Text>
      </View>
      <ParallaxCarouselPagination data={mockCarouselItems} scrollX={scrollX} />
    </View>
  );
};

export default AnimationParallaxCarousel;

const styles = StyleSheet.create({
  parallaxCarouselView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});
