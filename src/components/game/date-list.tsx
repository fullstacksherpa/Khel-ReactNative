import { addDays, format } from 'date-fns';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text } from 'react-native';

type DateItem = {
  id: string;
  displayDate: string;
  dayOfWeek: string;
  actualDate: string;
};

type Props = {
  onSelect: (date: string) => void;
  onCloseModal: () => void;
};

export default function DateList({ onSelect, onCloseModal }: Props) {
  const generateDates = (): DateItem[] => {
    return Array.from({ length: 10 }, (_, i) => {
      const date = addDays(new Date(), i);
      let displayDate;

      if (i === 0) {
        displayDate = 'Today';
      } else if (i === 1) {
        displayDate = 'Tomorrow';
      } else if (i === 2) {
        displayDate = 'Day after';
      } else {
        displayDate = format(date, 'do MMMM');
      }

      return {
        id: i.toString(),
        displayDate,
        dayOfWeek: format(date, 'EEEE'),
        actualDate: format(date, 'do MMMM'),
      };
    });
  };

  const dates = generateDates();

  return (
    <FlatList
      horizontal
      data={dates}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => (
        <Pressable
          style={styles.dateItem}
          onPress={() => {
            onSelect(item.actualDate);
            onCloseModal();
          }}
        >
          <Text>{item.displayDate}</Text>
          <Text style={styles.dayText}>{item.dayOfWeek}</Text>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateItem: {
    padding: 10,
    borderRadius: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    color: 'gray',
    marginTop: 8,
  },
});
