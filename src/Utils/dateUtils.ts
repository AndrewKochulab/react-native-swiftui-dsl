/**
 * Date and time formatting utilities.
 */

export interface DateFormatLabels {
  today: string;
  yesterday: string;
  daysAgo: (days: number) => string;
}

export interface DurationLabels {
  hourShort: string;
  minuteShort: string;
}

const defaultDateLabels: DateFormatLabels = {
  today: 'Today',
  yesterday: 'Yesterday',
  daysAgo: (days: number) => `${days} days ago`,
};

const defaultDurationLabels: DurationLabels = {
  hourShort: 'h',
  minuteShort: 'm',
};

/**
 * Formats a date using Intl.DateTimeFormat.
 *
 * @example
 * ```ts
 * formatDate(new Date(), { month: 'short', day: 'numeric' }) // "Jan 15"
 * ```
 */
export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions,
  locale?: string,
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

/**
 * Formats a date relative to today (Today, Yesterday, N days ago, or absolute).
 */
export function formatRelativeDate(
  date: Date,
  labels: DateFormatLabels = defaultDateLabels,
): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return labels.today;
  if (diffDays === 1) return labels.yesterday;
  if (diffDays < 7) return labels.daysAgo(diffDays);

  return formatDate(date, { month: 'short', day: 'numeric', year: 'numeric' });
}

/**
 * Returns the start of the current week (Monday).
 */
export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Returns today's date as an ISO string (YYYY-MM-DD).
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Formats a duration in minutes to a human-readable string.
 *
 * @example
 * ```ts
 * formatDuration(90)  // "1h 30m"
 * formatDuration(45)  // "45m"
 * formatDuration(120) // "2h 0m"
 * ```
 */
export function formatDuration(
  minutes: number,
  labels: DurationLabels = defaultDurationLabels,
): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}${labels.minuteShort}`;
  return `${hours}${labels.hourShort} ${mins}${labels.minuteShort}`;
}
