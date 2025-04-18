import React from 'react';
import { Image, StyleSheet, Text, View, type ViewStyle } from 'react-native';

import { type apartmentData } from '@/mock';

type ApartmentListItemType = {
  apartment: (typeof apartmentData)[0];
  containerStyle?: ViewStyle;
};

const ApartmentListItem = ({
  apartment,
  containerStyle,
}: ApartmentListItemType) => {
  return (
    <View style={[styles.card, containerStyle]}>
      <Image source={{ uri: apartment.image }} style={styles.image} />
      <View style={styles.rightContainer}>
        <Text style={styles.title}>{apartment.title}</Text>
        <Text style={styles.description}>
          Stay at this apartment for an affordable price
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>$ {apartment.price} night</Text>
          <Text style={styles.price}>
            ★ {apartment.rating} ({apartment.numberOfStars})
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',

    flexDirection: 'row',
    borderRadius: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  image: {
    width: 150,
    aspectRatio: 1,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  rightContainer: {
    padding: 10,
    flex: 1,
  },
  title: {
    fontFamily: 'InterBold',
    marginBottom: 10,
    fontSize: 16,
  },
  description: {
    color: 'gray',
  },
  price: {
    fontFamily: 'InterBold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
});

export default ApartmentListItem;
