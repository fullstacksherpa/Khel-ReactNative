import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const PlainScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Hello, this is a plain React Native screen!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    color: '#333',
  },
});

export default PlainScreen;
