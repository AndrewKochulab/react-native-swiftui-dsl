import { formatDate, formatRelativeDate, getWeekStart, getTodayISO, formatDuration } from '@/Utils/dateUtils';

describe('dateUtils', () => {
  describe('formatDate', () => {
    it('formats a date with options', () => {
      const date = new Date(2025, 0, 15);
      const result = formatDate(date, { month: 'short', day: 'numeric' });
      expect(result).toContain('15');
    });
  });

  describe('formatRelativeDate', () => {
    it('returns Today for current date', () => {
      expect(formatRelativeDate(new Date())).toBe('Today');
    });

    it('returns Yesterday for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(formatRelativeDate(yesterday)).toBe('Yesterday');
    });

    it('returns N days ago for recent dates', () => {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      expect(formatRelativeDate(threeDaysAgo)).toBe('3 days ago');
    });

    it('supports custom labels', () => {
      const labels = { today: 'Heute', yesterday: 'Gestern', daysAgo: (d: number) => `vor ${d} Tagen` };
      expect(formatRelativeDate(new Date(), labels)).toBe('Heute');
    });
  });

  describe('getWeekStart', () => {
    it('returns a Monday', () => {
      const start = getWeekStart();
      expect(start.getDay()).toBe(1); // Monday
    });

    it('returns midnight', () => {
      const start = getWeekStart();
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
    });
  });

  describe('getTodayISO', () => {
    it('returns ISO date string', () => {
      const iso = getTodayISO();
      expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('formatDuration', () => {
    it('formats minutes only', () => {
      expect(formatDuration(45)).toBe('45m');
    });

    it('formats hours and minutes', () => {
      expect(formatDuration(90)).toBe('1h 30m');
    });

    it('formats exact hours', () => {
      expect(formatDuration(120)).toBe('2h 0m');
    });

    it('supports custom labels', () => {
      expect(formatDuration(90, { hourShort: ' hr', minuteShort: ' min' })).toBe('1 hr 30 min');
    });
  });
});
