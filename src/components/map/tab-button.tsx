import React, { useState } from 'react';
import { type LayoutChangeEvent, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type TabButtonType = {
  title: string;
};

type TabButtonsProps = {
  buttons: TabButtonType[];
  selectedTab: number;
  setSelectedTab: (index: number) => void;
};

// eslint-disable-next-line max-lines-per-function
const TabButtons = ({
  buttons,
  selectedTab,
  setSelectedTab,
}: TabButtonsProps) => {
  const [dimensions, setDimensions] = useState({ height: 9, width: 100 });
  const buttonWidth = dimensions.width / buttons.length;

  const tabPositionX = useSharedValue(0);

  const onTabbarLayout = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const onTabPress = (index: number) => {
    setSelectedTab(index); // Update state first
    tabPositionX.value = withTiming(buttonWidth * index);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });
  return (
    <View
      accessibilityRole="tabbar"
      style={{
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
      }}
    >
      <Animated.View
        style={[
          animatedStyle,
          {
            position: 'absolute',
            backgroundColor: '#fff',
            borderRadius: 15,
            marginHorizontal: 5,
            height: dimensions.height - 10,
            width: buttonWidth - 10,
          },
        ]}
      />
      <View onLayout={onTabbarLayout} style={{ flexDirection: 'row' }}>
        {buttons.map((button, index) => {
          const color = selectedTab === index ? '#000' : '#fff';
          return (
            <Pressable
              onPress={() => onTabPress(index)}
              key={index}
              style={{ flex: 1, paddingVertical: 20 }}
            >
              <Text
                style={{
                  color: color,
                  alignSelf: 'center',
                  fontWeight: '600',
                  fontSize: 14,
                }}
              >
                {button.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default TabButtons;
