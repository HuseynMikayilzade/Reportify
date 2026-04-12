// Utility: Date helpers
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

export function formatTimestamp(ts: number): string {
  const date = new Date(ts);
  if (isToday(date)) return `Today, ${format(date, 'HH:mm')}`;
  if (isYesterday(date)) return `Yesterday, ${format(date, 'HH:mm')}`;
  return format(date, 'dd MMM yyyy, HH:mm');
}

export function formatDate(ts: number): string {
  return format(new Date(ts), 'dd MMM yyyy');
}

export function formatTime(ts: number): string {
  return format(new Date(ts), 'HH:mm');
}

export function timeAgo(ts: number): string {
  return formatDistanceToNow(new Date(ts), { addSuffix: true });
}

export function startOfTodayMs(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function endOfTodayMs(): number {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

export function todayLabel(): string {
  return format(new Date(), 'EEEE, d MMMM yyyy');
}

export function greetingByHour(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}
