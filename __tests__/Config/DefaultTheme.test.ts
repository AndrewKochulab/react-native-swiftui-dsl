import { defaultThemeConfig } from '@/Config/Defaults';

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
const RGBA_REGEX = /^rgba\(\d{1,3},\d{1,3},\d{1,3},[\d.]+\)$/;

function isValidColorValue(value: string): boolean {
  return HEX_COLOR_REGEX.test(value) || RGBA_REGEX.test(value);
}

describe('defaultThemeConfig', () => {
  it('is defined and is an object', () => {
    expect(defaultThemeConfig).toBeDefined();
    expect(typeof defaultThemeConfig).toBe('object');
  });

  describe('top-level structure', () => {
    it('has colors, fonts, and layout keys', () => {
      expect(defaultThemeConfig).toHaveProperty('colors');
      expect(defaultThemeConfig).toHaveProperty('fonts');
      expect(defaultThemeConfig).toHaveProperty('layout');
    });
  });

  describe('color schemes', () => {
    const colors = defaultThemeConfig.colors as {
      light: Record<string, string>;
      dark: Record<string, string>;
    };

    it('has light color scheme', () => {
      expect(colors.light).toBeDefined();
      expect(typeof colors.light).toBe('object');
    });

    it('has dark color scheme', () => {
      expect(colors.dark).toBeDefined();
      expect(typeof colors.dark).toBe('object');
    });

    it('light and dark have the same keys', () => {
      const lightKeys = Object.keys(colors.light).sort();
      const darkKeys = Object.keys(colors.dark).sort();
      expect(lightKeys).toEqual(darkKeys);
    });

    const requiredColorTokens = [
      'text',
      'background',
      'tint',
      'card',
      'secondaryText',
      'separator',
      'error',
      'success',
      'warning',
      'inputBackground',
      'buttonText',
      'cardShadow',
    ];

    it.each(requiredColorTokens)('light has required color token "%s"', (token) => {
      expect(colors.light).toHaveProperty(token);
    });

    it.each(requiredColorTokens)('dark has required color token "%s"', (token) => {
      expect(colors.dark).toHaveProperty(token);
    });

    it('has exactly 12 color tokens per scheme', () => {
      expect(Object.keys(colors.light).length).toBe(12);
      expect(Object.keys(colors.dark).length).toBe(12);
    });

    it('all light color values are valid hex or rgba', () => {
      for (const [key, value] of Object.entries(colors.light)) {
        expect(isValidColorValue(value)).toBe(true);
      }
    });

    it('all dark color values are valid hex or rgba', () => {
      for (const [key, value] of Object.entries(colors.dark)) {
        expect(isValidColorValue(value)).toBe(true);
      }
    });

    it('light text is black and dark text is white', () => {
      expect(colors.light.text).toBe('#000000');
      expect(colors.dark.text).toBe('#FFFFFF');
    });

    it('light background is white and dark background is black', () => {
      expect(colors.light.background).toBe('#FFFFFF');
      expect(colors.dark.background).toBe('#000000');
    });

    it('light and dark have different tint colors', () => {
      expect(colors.light.tint).toBe('#007AFF');
      expect(colors.dark.tint).toBe('#0A84FF');
      expect(colors.light.tint).not.toBe(colors.dark.tint);
    });

    it('cardShadow uses rgba format', () => {
      expect(RGBA_REGEX.test(colors.light.cardShadow)).toBe(true);
      expect(RGBA_REGEX.test(colors.dark.cardShadow)).toBe(true);
    });
  });

  describe('font sizes', () => {
    const sizes = defaultThemeConfig.fonts.size as Record<string, number>;

    const requiredFontSizes = [
      'micro',
      'small',
      'caption',
      'footnote',
      'body',
      'subtitle',
      'title2',
      'title',
      'header',
      'hero',
    ];

    it.each(requiredFontSizes)('has font size "%s"', (size) => {
      expect(sizes).toHaveProperty(size);
    });

    it('has exactly 10 font sizes', () => {
      expect(Object.keys(sizes).length).toBe(10);
    });

    it('all font sizes are positive numbers', () => {
      for (const [, value] of Object.entries(sizes)) {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      }
    });

    it('font sizes increase from micro to hero', () => {
      expect(sizes.micro).toBeLessThan(sizes.small);
      expect(sizes.small).toBeLessThan(sizes.caption);
      expect(sizes.caption).toBeLessThan(sizes.footnote);
      expect(sizes.footnote).toBeLessThan(sizes.body);
      expect(sizes.body).toBeLessThan(sizes.subtitle);
      expect(sizes.subtitle).toBeLessThan(sizes.title2);
      expect(sizes.title2).toBeLessThan(sizes.title);
      expect(sizes.title).toBeLessThan(sizes.header);
      expect(sizes.header).toBeLessThan(sizes.hero);
    });

    it('has correct specific values', () => {
      expect(sizes.micro).toBe(10);
      expect(sizes.body).toBe(17);
      expect(sizes.title).toBe(28);
      expect(sizes.hero).toBe(40);
    });
  });

  describe('font weights', () => {
    const weights = defaultThemeConfig.fonts.weight as Record<string, string>;

    const requiredWeights = ['regular', 'medium', 'semibold', 'bold'];

    it.each(requiredWeights)('has required font weight "%s"', (weight) => {
      expect(weights).toHaveProperty(weight);
    });

    it('has exactly 4 font weights', () => {
      expect(Object.keys(weights).length).toBe(4);
    });

    it('all font weights are numeric strings', () => {
      for (const [, value] of Object.entries(weights)) {
        expect(typeof value).toBe('string');
        expect(Number(value)).toBeGreaterThanOrEqual(100);
        expect(Number(value)).toBeLessThanOrEqual(900);
      }
    });

    it('weights increase from regular to bold', () => {
      expect(Number(weights.regular)).toBeLessThan(Number(weights.medium));
      expect(Number(weights.medium)).toBeLessThan(Number(weights.semibold));
      expect(Number(weights.semibold)).toBeLessThan(Number(weights.bold));
    });

    it('has correct specific values', () => {
      expect(weights.regular).toBe('400');
      expect(weights.medium).toBe('500');
      expect(weights.semibold).toBe('600');
      expect(weights.bold).toBe('700');
    });
  });

  describe('font line heights', () => {
    const lineHeights = defaultThemeConfig.fonts.lineHeight as Record<string, number>;

    it('has tight, normal, relaxed, and loose', () => {
      expect(lineHeights).toHaveProperty('tight');
      expect(lineHeights).toHaveProperty('normal');
      expect(lineHeights).toHaveProperty('relaxed');
      expect(lineHeights).toHaveProperty('loose');
    });

    it('has exactly 4 line heights', () => {
      expect(Object.keys(lineHeights).length).toBe(4);
    });

    it('all line heights are positive numbers', () => {
      for (const [, value] of Object.entries(lineHeights)) {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      }
    });

    it('line heights increase from tight to loose', () => {
      expect(lineHeights.tight).toBeLessThan(lineHeights.normal);
      expect(lineHeights.normal).toBeLessThan(lineHeights.relaxed);
      expect(lineHeights.relaxed).toBeLessThan(lineHeights.loose);
    });

    it('has correct specific values', () => {
      expect(lineHeights.tight).toBe(16);
      expect(lineHeights.normal).toBe(22);
      expect(lineHeights.relaxed).toBe(28);
      expect(lineHeights.loose).toBe(34);
    });
  });

  describe('layout spacing', () => {
    const spacing = defaultThemeConfig.layout.spacing as Record<string, number>;

    const requiredSpacing = ['xs', 'sm', 'md', 'lg', 'xl'];

    it.each(requiredSpacing)('has spacing value "%s"', (key) => {
      expect(spacing).toHaveProperty(key);
    });

    it('has exactly 5 spacing values', () => {
      expect(Object.keys(spacing).length).toBe(5);
    });

    it('all spacing values are positive numbers', () => {
      for (const [, value] of Object.entries(spacing)) {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      }
    });

    it('spacing values increase from xs to xl', () => {
      expect(spacing.xs).toBeLessThan(spacing.sm);
      expect(spacing.sm).toBeLessThan(spacing.md);
      expect(spacing.md).toBeLessThan(spacing.lg);
      expect(spacing.lg).toBeLessThan(spacing.xl);
    });

    it('has correct specific values', () => {
      expect(spacing.xs).toBe(4);
      expect(spacing.sm).toBe(8);
      expect(spacing.md).toBe(16);
      expect(spacing.lg).toBe(24);
      expect(spacing.xl).toBe(32);
    });
  });

  describe('layout border radius', () => {
    const borderRadius = defaultThemeConfig.layout.borderRadius as Record<string, number>;

    const requiredRadius = ['sm', 'md', 'lg'];

    it.each(requiredRadius)('has border radius value "%s"', (key) => {
      expect(borderRadius).toHaveProperty(key);
    });

    it('has exactly 3 border radius values', () => {
      expect(Object.keys(borderRadius).length).toBe(3);
    });

    it('all border radius values are positive numbers', () => {
      for (const [, value] of Object.entries(borderRadius)) {
        expect(typeof value).toBe('number');
        expect(value).toBeGreaterThan(0);
      }
    });

    it('border radius values increase from sm to lg', () => {
      expect(borderRadius.sm).toBeLessThan(borderRadius.md);
      expect(borderRadius.md).toBeLessThan(borderRadius.lg);
    });

    it('has correct specific values', () => {
      expect(borderRadius.sm).toBe(4);
      expect(borderRadius.md).toBe(8);
      expect(borderRadius.lg).toBe(16);
    });
  });
});
