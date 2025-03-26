import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Adjust path to where the CustomHeader component is located

const MyScreen = () => {
  return (
    <View style={styles.container}>
      <Text>
        Hello, this is a plain React Native screen with a custom header!
      </Text>
      {/* Rest of your screen content */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Make sure background is white or any color you prefer
  },
});

export default MyScreen;
