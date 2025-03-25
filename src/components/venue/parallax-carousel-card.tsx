import React from 'react';
import {
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

const OFFSET = 45;
const ITEM_WIDTH = Dimensions.get('window').width - OFFSET * 2;
const ITEM_HEIGHT = 200;

const ParallaxCarouselCard = ({ item, id, scrollX, total }: any) => {
  const inputRange = [
    (id - 1) * ITEM_WIDTH,
    id * ITEM_WIDTH,
    (id + 1) * ITEM_WIDTH,
  ];
  const translateStyle = useAnimatedStyle(() => {
    const translate = interpolate(
      scrollX.value,
      inputRange,
      [0.97, 0.97, 0.97],
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ scale: translate }],
      opacity,
    };
  });
  const translateImageStyle = useAnimatedStyle(() => {
    const translate = interpolate(scrollX.value, inputRange, [
      -ITEM_WIDTH * 0.2,
      0,
      ITEM_WIDTH * 0.4,
    ]);
    return {
      transform: [{ translateX: translate }],
    };
  });
  return (
    <Animated.View
      style={[
        {
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
          marginLeft: id === 0 ? OFFSET : undefined,
          marginRight: id === total - 1 ? OFFSET : undefined,
          overflow: 'hidden',
          borderRadius: 14,
        },
        translateStyle,
      ]}
    >
      <Animated.View style={[translateImageStyle]}>
        <ImageBackground
          source={item.poster}
          style={styles.imageBackgroundStyle}
        >
          <View style={styles.imageBackgoundView}>
            <View style={styles.userImageView}>
              <Image source={item.icon} style={styles.userImage} />
              <View style={styles.titleCardView}>
                <Text style={styles.titleStyle}>{item.title}</Text>
                <Text style={styles.descriptionStyle}>{item.description}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>
    </Animated.View>
  );
};
export default ParallaxCarouselCard;

const styles = StyleSheet.create({
  imageBackgroundStyle: {
    resizeMode: 'cover',
    borderRadius: 14,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
  },
  userImage: {
    width: 30,
    height: 30,
  },
  imageBackgoundView: {
    paddingHorizontal: 15,
    paddingVertical: 25,
    flex: 1,
    justifyContent: 'flex-end',
    gap: 4,
  },
  userImageView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  titleCardView: {
    gap: 2,
  },
  titleStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  descriptionStyle: {
    color: 'white',
    fontSize: 12,
    fontWeight: '400',
  },
});
