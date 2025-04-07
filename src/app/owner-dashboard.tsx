import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useIsVenueOwner } from '@/api/venues/venues';

export default function HelloScreen() {
  const { data, isLoading } = useIsVenueOwner();
  if (isLoading) {
    return null;
  }
  const isOwner = data?.data?.is_owner ?? false;
  return (
    <View style={styles.container}>
      {isOwner && (
        <View>
          <Text>hello boss</Text>
        </View>
      )}
      {!isOwner && (
        <View>
          <Text>Submit your request to become venue owner</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
