import { determineSizeClass, determineOrientation, resolveBreakpoints } from '@responsive';

describe('Responsive utilities', () => {
  describe('determineSizeClass', () => {
    const breakpoints = {
      compact: { min: 0, max: 599 },
      regular: { min: 600, max: 1023 },
      large: { min: 1024, max: Infinity },
    };

    it('returns compact for phone width', () => {
      expect(determineSizeClass(375, breakpoints)).toBe('compact');
      expect(determineSizeClass(430, breakpoints)).toBe('compact');
    });

    it('returns regular for small tablet width', () => {
      expect(determineSizeClass(600, breakpoints)).toBe('regular');
      expect(determineSizeClass(768, breakpoints)).toBe('regular');
    });

    it('returns large for tablet width', () => {
      expect(determineSizeClass(1024, breakpoints)).toBe('large');
      expect(determineSizeClass(1366, breakpoints)).toBe('large');
    });

    it('returns compact for zero width', () => {
      expect(determineSizeClass(0, breakpoints)).toBe('compact');
    });
  });

  describe('determineOrientation', () => {
    it('returns portrait when height > width', () => {
      expect(determineOrientation(375, 812)).toBe('portrait');
    });

    it('returns landscape when width > height', () => {
      expect(determineOrientation(812, 375)).toBe('landscape');
    });

    it('returns portrait when equal (width is not greater than height)', () => {
      expect(determineOrientation(500, 500)).toBe('portrait');
    });
  });

  describe('resolveBreakpoints', () => {
    it('returns defaults when no overrides', () => {
      const breakpoints = resolveBreakpoints();
      expect(breakpoints.compact).toEqual({ min: 0, max: 599 });
      expect(breakpoints.regular).toEqual({ min: 600, max: 1023 });
    });

    it('merges partial overrides', () => {
      const breakpoints = resolveBreakpoints({
        compact: { min: 0, max: 430 },
      });
      expect(breakpoints.compact).toEqual({ min: 0, max: 430 });
      expect(breakpoints.regular).toEqual({ min: 600, max: 1023 });
    });
  });
});
