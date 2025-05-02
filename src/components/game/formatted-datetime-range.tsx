// components/FormattedDateTimeRange.tsx
import { formatInTimeZone } from 'date-fns-tz';
import { Text, type TextProps } from 'react-native';

interface DateTimeRangeProps extends TextProps {
  startUtc: string;
  endUtc: string;
}

const FormattedDateTimeRange: React.FC<DateTimeRangeProps> = ({
  startUtc,
  endUtc,
  ...textProps
}) => {
  const formatDate = (date: string) =>
    formatInTimeZone(date, 'Asia/Kathmandu', 'EEEE  d MMM,');

  const formatTime = (date: string) =>
    formatInTimeZone(date, 'Asia/Kathmandu', 'h:mm a');

  return (
    <Text {...textProps}>
      {formatDate(startUtc)} {formatTime(startUtc)} -{' '}
      {startUtc.slice(0, 10) === endUtc.slice(0, 10)
        ? formatTime(endUtc)
        : `${formatDate(endUtc)}, ${formatTime(endUtc)}`}
    </Text>
  );
};

export default FormattedDateTimeRange;
