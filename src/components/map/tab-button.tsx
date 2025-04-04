import React from 'react';
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
  const [buttonWidth, setButtonWidth] = React.useState(0); // Store button width
  const tabPositionX = useSharedValue(0);

  // Get the tab bar width and calculate button width when layout changes
  const onTabbarLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setButtonWidth(width / buttons.length); // Calculate width for each button
  };

  // Handle tab press and trigger animation
  const onTabPress = (index: number) => {
    setSelectedTab(index);
    tabPositionX.value = withTiming(buttonWidth * index); // Animate tab position
  };

  // Animated style for the tab position
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
            height: 40, // You can replace this with dynamic height if needed
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
