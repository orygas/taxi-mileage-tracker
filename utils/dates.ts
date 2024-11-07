import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

export const formatDate = (date: Date) => format(date, 'dd.MM.yyyy');
export const formatMonthYear = (date: Date) => format(date, 'MMMM yyyy');
export const formatMonthDayYear = (date: Date) => format(date, 'MMMM d, yyyy');
export const formatMonthDay = (date: Date) => format(date, 'MMMM d');

export const getMonthRange = (date: Date) => ({
  start: startOfMonth(date),
  end: endOfMonth(date),
});

export const getWeekRange = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return { start, end };
};