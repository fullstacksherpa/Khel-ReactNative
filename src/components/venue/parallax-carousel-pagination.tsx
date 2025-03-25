import React from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { type CarouselItem } from '@/mock';

const OFFSET = 45;
const ITEM_WIDTH = Dimensions.get('window').width - OFFSET * 2;

// Define types for props
interface PaginationDotProps {
  index: number;
  scrollX: SharedValue<number>;
}
const PaginationDot: React.FC<PaginationDotProps> = ({ index, scrollX }) => {
  const inputRange = [
    (index - 1) * ITEM_WIDTH,
    index * ITEM_WIDTH,
    (index + 1) * ITEM_WIDTH,
  ];
  const animatedDotStyle = useAnimatedStyle(() => {
    const widthAnimation = interpolate(
      scrollX.value,
      inputRange,
      [10, 20, 10],
      Extrapolation.CLAMP
    );
    const opacityAnimation = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolation.CLAMP
    );
    return {
      width: widthAnimation,
      opacity: opacityAnimation,
    };
  });

  // const animatedColor = useAnimatedStyle(() => {
  //   const backgroundColor = interpolateColor(
  //     scrollX.value,
  //     [0, ITEM_WIDTH, 2 * ITEM_WIDTH],
  //     ['#FF5733', '#3498db', '#2ecc71']
  //   );
  //   return {
  //     backgroundColor,
  //   };
  // });
  return <Animated.View style={[styles.dots, animatedDotStyle]} />;
};

interface ParallaxCarouselPaginationProps {
  data: CarouselItem[];
  scrollX: SharedValue<number>;
}

const ParallaxCarouselPagination: React.FC<ParallaxCarouselPaginationProps> = ({
  data,
  scrollX,
}) => {
  return (
    <View style={styles.paginationContainer}>
      {data.map((_, index) => {
        return <PaginationDot index={index} scrollX={scrollX} key={index} />;
      })}
    </View>
  );
};

export default ParallaxCarouselPagination;

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dots: {
    height: 10,
    marginHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderWidth: 1, // Add border for debugging
  },
});
