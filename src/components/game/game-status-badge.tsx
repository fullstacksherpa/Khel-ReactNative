import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  status: 'active' | 'cancelled' | 'completed';
};

const STATUS_COLORS: Record<string, string> = {
  active: '#4ba143',
  cancelled: '#ae0000',
  completed: '#9a4eae',
};

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const backgroundColor = STATUS_COLORS[status] ?? '#999'; // fallback color

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'flex-start', // so it doesn't stretch
  },
  text: {
    paddingHorizontal: 2,
    textAlign: 'center',
    color: 'white',
    textTransform: 'capitalize',
  },
});
