/* eslint-disable react/no-unstable-nested-components */
import AntDesign from '@expo/vector-icons/AntDesign';
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useCallback, useEffect } from 'react';

import { useAuth, useIsFirstTime } from '@/lib';

// eslint-disable-next-line max-lines-per-function
export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();

  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name="home"
              size={focused ? 30 : 24} // Increase size when focused
              color={color}
            />
          ),
          tabBarActiveTintColor: '#74c365',
          tabBarInactiveTintColor: 'gray',
          tabBarButtonTestID: 'style-tab',
        }}
      />
      <Tabs.Screen
        name="game"
        options={{
          title: 'Game',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name="addusergroup"
              size={focused ? 30 : 24} // Increase size when focused
              color={color}
            />
          ),
          tabBarActiveTintColor: '#74c365',
          tabBarInactiveTintColor: 'gray',
          tabBarButtonTestID: 'style-tab',
        }}
      />

      <Tabs.Screen
        name="venues"
        options={{
          title: 'Venue',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name="creditcard"
              size={focused ? 30 : 24} // Increase size when focused
              color={color}
            />
          ),
          tabBarActiveTintColor: '#74c365',
          tabBarInactiveTintColor: 'gray',
          tabBarButtonTestID: 'style-tab',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <AntDesign
              name="setting"
              size={focused ? 30 : 24} // Increase size when focused
              color={color}
            />
          ),
          tabBarActiveTintColor: '#74c365',
          tabBarInactiveTintColor: 'gray',
          tabBarButtonTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}
