import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import React, { useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

type DateTimeProps = {
  onStartDateChange: (date: Date) => void;
  onEndTimeChange: (date: Date) => void;
};

// eslint-disable-next-line max-lines-per-function
export function DateTimeSelector({
  onStartDateChange,
  onEndTimeChange,
}: DateTimeProps) {
  // 1) Defaults
  const now = new Date();
  const [startDate, setStartDate] = useState<Date>(now);
  const [endTime, setEndTime] = useState<Date>(
    new Date(now.getTime() + 2 * 3600_000)
  );

  // 2) Picker UI state
  const [showPicker, setShowPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [target, setTarget] = useState<'date' | 'start' | 'end'>('date');

  const maxDate = new Date(now.getTime() + 10 * 24 * 3600_000);

  function openPicker(mode: 'date' | 'time', which: 'date' | 'start' | 'end') {
    setPickerMode(mode);
    setTarget(which);
    setShowPicker(true);
  }

  function onChange(e: DateTimePickerEvent, selected?: Date) {
    // auto‐hide on Android
    setShowPicker(Platform.OS === 'ios');

    if (!selected) return;

    if (pickerMode === 'date') {
      // update date for both start and end
      const d = selected;
      const s = new Date(d);
      s.setHours(startDate.getHours(), startDate.getMinutes());
      setStartDate(s);
      onStartDateChange(s);

      const eT = new Date(d);
      eT.setHours(endTime.getHours(), endTime.getMinutes());
      setEndTime(eT);
      onEndTimeChange(eT);
    } else if (target === 'start') {
      const s = new Date(startDate);
      s.setHours(selected.getHours(), selected.getMinutes());
      setStartDate(s);
      onStartDateChange(s);
    } else {
      const eT = new Date(endTime);
      eT.setHours(selected.getHours(), selected.getMinutes());
      setEndTime(eT);
      onEndTimeChange(eT);
    }
  }

  return (
    <View style={{ marginVertical: 12 }}>
      <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 8 }}>
        Select Date & Time
      </Text>

      {/* Date */}
      <TouchableOpacity
        onPress={() => openPicker('date', 'date')}
        style={{
          padding: 12,
          borderWidth: 1,
          borderRadius: 6,
          marginBottom: 8,
        }}
      >
        <Text>{format(startDate, 'dd MMM yyyy')}</Text>
      </TouchableOpacity>

      {/* Start Time */}
      <TouchableOpacity
        onPress={() => openPicker('time', 'start')}
        style={{
          padding: 12,
          borderWidth: 1,
          borderRadius: 6,
          marginBottom: 8,
        }}
      >
        <Text>Start: {format(startDate, 'h:mm a')}</Text>
      </TouchableOpacity>

      {/* End Time */}
      <TouchableOpacity
        onPress={() => openPicker('time', 'end')}
        style={{ padding: 12, borderWidth: 1, borderRadius: 6 }}
      >
        <Text>End: {format(endTime, 'h:mm a')}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={
            pickerMode === 'date'
              ? startDate
              : target === 'start'
                ? startDate
                : endTime
          }
          mode={pickerMode}
          display="default"
          is24Hour={false}
          minuteInterval={30}
          onChange={onChange}
          minimumDate={pickerMode === 'date' ? now : undefined}
          maximumDate={pickerMode === 'date' ? maxDate : undefined}
        />
      )}
    </View>
  );
}
