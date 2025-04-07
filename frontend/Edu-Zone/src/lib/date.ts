import { format, formatDistance, formatRelative, parseISO } from "date-fns";

export const dateFormats = {
  short: "MMM d, yyyy",
  medium: "MMMM d, yyyy",
  long: "MMMM d, yyyy h:mm a",
  full: "EEEE, MMMM d, yyyy h:mm:ss a",
  time: "h:mm a",
  timeWithSeconds: "h:mm:ss a",
} as const;

export function formatDate(
  date: Date | string,
  formatStr: keyof typeof dateFormats = "medium"
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return format(dateObj, dateFormats[formatStr]);
}

export function formatRelativeDate(
  date: Date | string,
  baseDate: Date = new Date()
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatRelative(dateObj, baseDate);
}

export function formatDistanceToNow(
  date: Date | string,
  addSuffix: boolean = true
): string {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  return formatDistance(dateObj, new Date(), { addSuffix });
}

export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

export function isYesterday(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    dateObj.getDate() === yesterday.getDate() &&
    dateObj.getMonth() === yesterday.getMonth() &&
    dateObj.getFullYear() === yesterday.getFullYear()
  );
}

export function isThisWeek(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - dateObj.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= 7;
}

export function isThisMonth(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const today = new Date();
  return (
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

export function isThisYear(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? parseISO(date) : date;
  const today = new Date();
  return dateObj.getFullYear() === today.getFullYear();
}
