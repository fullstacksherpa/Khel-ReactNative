import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';

const CustomHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <LinearGradient colors={['#1a8e2d', '#146922']} style={styles.header}>
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight || 0, // Custom padding to account for the status bar
    paddingBottom: 9,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
});

export default CustomHeader;
