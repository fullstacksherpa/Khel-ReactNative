// Import  global CSS file
import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { APIProvider } from '@/api';
import { hydrateAuth } from '@/lib';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(app)',
};

hydrateAuth();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

export default function RootLayout() {
  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="email-verification"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="request-reset-password"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="reset-password-screen"
          options={{ headerShown: false }}
        />
        <Stack.Screen name="venue-details" />
        <Stack.Screen name="owner-dashboard" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GestureHandlerRootView style={styles.container}>
      <KeyboardProvider>
        <APIProvider>
          <BottomSheetModalProvider>
            {children}
            <FlashMessage position="top" />
          </BottomSheetModalProvider>
        </APIProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
