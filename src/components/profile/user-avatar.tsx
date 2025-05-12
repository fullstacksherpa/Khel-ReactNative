import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { useCurrentUser } from '@/api/auth/use-current-user';

export function UserAvatar() {
  const { data: user, isLoading } = useCurrentUser();

  // Default size for avatar
  const size = 40;

  // While loading or no user, show placeholder
  if (isLoading || !user) {
    return (
      <View
        style={[
          styles.placeholder,
          { width: size, height: size, borderRadius: 15 },
        ]}
      />
    );
  }

  const { profile_picture_url: url, first_name } = user;
  const initial = first_name?.charAt(0).toUpperCase() ?? '';

  if (url) {
    return (
      <Image
        source={{ uri: url }}
        style={[styles.image, { width: size, height: size, borderRadius: 15 }]}
      />
    );
  }

  return (
    <View
      style={[
        styles.placeholder,
        { width: size, height: size, borderRadius: 15 },
      ]}
    >
      <Text style={[styles.initial, { fontSize: size * 0.5 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    resizeMode: 'cover',
  },
  initial: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
