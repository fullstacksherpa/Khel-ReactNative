import {
  addDays,
  addMinutes,
  format,
  isBefore,
  isEqual,
  parse,
  parseISO,
  startOfDay,
} from 'date-fns';
import { enUS } from 'date-fns/locale';
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz';

const KATHMANDU_TIMEZONE = 'Asia/Kathmandu';
export interface DateItem {
  dayNum: string;
  dayLabel: string;
  fullDate: string;
}

/**
 * Generate an array of dates from today up to `numDays` ahead in Kathmandu timezone
 */
export const generateDatesArray = (numDays = 10): DateItem[] => {
  const dates: DateItem[] = [];
  const today = new Date();
  for (let i = 0; i <= numDays; i++) {
    const dateObj = addDays(today, i);
    const dayStart = startOfDay(dateObj);
    dates.push({
      dayNum: formatInTimeZone(dayStart, KATHMANDU_TIMEZONE, 'dd'),
      dayLabel: formatInTimeZone(dayStart, KATHMANDU_TIMEZONE, 'EEE'),
      fullDate: dayStart.toISOString(),
    });
  }
  return dates;
};

export const generateTimeSlots = (openTime = '06:00', closeTime = '21:00') => {
  const slots: string[] = [];
  const refDate = new Date();
  const open = parse(openTime, 'HH:mm', refDate);
  const close = parse(closeTime, 'HH:mm', refDate);

  let current = open;
  while (isBefore(current, close) || isEqual(current, close)) {
    slots.push(format(current, 'hh:mm aa'));
    current = addMinutes(current, 30);
  }
  return slots;
};

// ======================== Core Conversions ========================

/**
 * Convert UTC date to Kathmandu time
 * @param utcDate ISO string or Date object
 * @returns Date in Kathmandu timezone
 */
export function utcToKathmandu(utcDate: string | Date): Date {
  const date = typeof utcDate === 'string' ? parseISO(utcDate) : utcDate;
  return toZonedTime(date, KATHMANDU_TIMEZONE);
}

/**
 * Convert Kathmandu time to UTC date
 * @param kathmanduDate Date in Kathmandu timezone
 * @returns Date in UTC
 */
export function kathmanduToUtc(kathmanduDate: Date): Date {
  return fromZonedTime(kathmanduDate, KATHMANDU_TIMEZONE);
}

// ======================== Formatting Helpers ========================

/**
 * Format date in Kathmandu timezone to 'Sat, 9 Aug, 9:30 PM' format
 * @param date Input date (UTC or local)
 * @returns Formatted date string
 */
export function formatClientDateTime(date: Date | string): string {
  return formatInTimeZone(date, KATHMANDU_TIMEZONE, 'EEE, d MMM, h:mm a', {
    locale: enUS,
  });
}

/**
 * Format date to ISO string in Kathmandu timezone
 * @param date Input date
 * @returns ISO string with Kathmandu offset
 */
export function toKathmanduISOString(date: Date): string {
  return formatInTimeZone(date, KATHMANDU_TIMEZONE, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

// ======================== Common Formats ========================

export const DateFormats = {
  dateTime: 'EEE, d MMM, h:mm a', // Sat, 9 Aug, 9:30 PM
  shortDate: 'dd MMM yyyy', // 09 Aug 2024
  longDate: 'EEEE, MMMM d, yyyy', // Saturday, August 9, 2024
  time: 'h:mm a', // 9:30 PM
  iso: "yyyy-MM-dd'T'HH:mm:ssXXX", // 2024-08-09T21:30:00+05:45
};

/**
 * Generic date formatter for Kathmandu timezone
 * @param date Input date
 * @param formatStr Date format string
 * @returns Formatted date string
 */
export function formatKathmandu(
  date: Date | string,
  formatStr: string = DateFormats.dateTime
): string {
  return formatInTimeZone(date, KATHMANDU_TIMEZONE, formatStr, {
    locale: enUS,
  });
}

// ======================== Helpers ========================

/**
 * Get current time in Kathmandu
 * @returns Current date in Kathmandu timezone
 */
export function currentKathmanduTime(): Date {
  return toZonedTime(new Date(), KATHMANDU_TIMEZONE);
}

/**
 * Convert any date to UTC ISO string
 * @param date Input date (local or zoned)
 * @returns UTC ISO string
 */
export function toUtcISOString(date: Date): string {
  return format(date, "yyyy-MM-dd'T'HH:mm:ssXXX");
}

/**
 * Validate if a timezone string is valid
 * @param timeZone IANA timezone string
 * @returns true if valid
 */
export function isValidTimeZone(timeZone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch (e) {
    return false;
  }
}

// ======================== Example Usage ========================
/*
// For a server UTC time:
const serverDate = '2024-08-09T15:45:00Z';

// Convert to Kathmandu time
const kathmanduDate = utcToKathmandu(serverDate);

// Format for display
const displayDate = formatClientDateTime(kathmanduDate); // "Sat, 9 Aug, 9:30 PM"

// Convert local input back to UTC
const userInputDate = new Date('2024-08-09T21:30:00+05:45');
const utcDate = kathmanduToUtc(userInputDate);
*/

export const formatDateTimeRangeString = (
  startUtc: string,
  endUtc: string
): string => {
  const formatDate = (date: string) =>
    formatInTimeZone(date, 'Asia/Kathmandu', 'EEE, d MMM');

  const formatTime = (date: string) =>
    formatInTimeZone(date, 'Asia/Kathmandu', 'h:mm a');

  const formattedStart = `${formatDate(startUtc)}, ${formatTime(startUtc)}`;
  const formattedEnd =
    startUtc.slice(0, 10) === endUtc.slice(0, 10)
      ? formatTime(endUtc)
      : `${formatDate(endUtc)}, ${formatTime(endUtc)}`;

  return `${formattedStart} - ${formattedEnd}`;
};
