import { resolveColor, isColorToken } from '../../src/Core/ThemeResolver';
import { normalizeColors } from '../../src/Theme/types';
import { testThemeConfig } from '../Helpers/testThemeConfig';

const colors = testThemeConfig.colors;
const normalized = normalizeColors(colors);

describe('ThemeResolver', () => {
  describe('resolveColor', () => {
    it('resolves a color token to light theme value', () => {
      expect(resolveColor('tint', 'light', colors)).toBe(normalized.light.tint);
    });

    it('resolves a color token to dark theme value', () => {
      expect(resolveColor('tint', 'dark', colors)).toBe(normalized.dark.tint);
    });

    it('passes through raw hex strings unchanged', () => {
      const rawHex = '#FF0000';
      expect(resolveColor(rawHex, 'light', colors)).toBe(rawHex);
      expect(resolveColor(rawHex, 'dark', colors)).toBe(rawHex);
    });

    it('passes through rgba strings unchanged', () => {
      const rawRgba = 'rgba(0,0,0,0.5)';
      expect(resolveColor(rawRgba, 'light', colors)).toBe(rawRgba);
    });

    it('resolves all standard tokens without errors', () => {
      const tokens = Object.keys(normalized.light);
      for (const token of tokens) {
        expect(resolveColor(token, 'light', colors)).toBe(normalized.light[token]);
        expect(resolveColor(token, 'dark', colors)).toBe(normalized.dark[token]);
      }
    });

    it('resolves colors from a single (flat) color config', () => {
      const singleColors = {
        text: '#000000',
        tint: '#007AFF',
        background: '#FFFFFF',
      };
      expect(resolveColor('tint', 'light', singleColors)).toBe('#007AFF');
      expect(resolveColor('tint', 'dark', singleColors)).toBe('#007AFF');
      expect(resolveColor('text', 'dark', singleColors)).toBe('#000000');
    });

    it('passes through unknown tokens with single color config', () => {
      const singleColors = { text: '#000000' };
      expect(resolveColor('#FF0000', 'light', singleColors)).toBe('#FF0000');
    });
  });

  describe('normalizeColors', () => {
    it('returns dual config as-is', () => {
      const dual = { light: { text: '#000' }, dark: { text: '#FFF' } };
      const result = normalizeColors(dual);
      expect(result.light.text).toBe('#000');
      expect(result.dark.text).toBe('#FFF');
    });

    it('duplicates flat config into light and dark', () => {
      const flat = { text: '#333', tint: '#007AFF' };
      const result = normalizeColors(flat);
      expect(result.light.text).toBe('#333');
      expect(result.dark.text).toBe('#333');
      expect(result.light.tint).toBe('#007AFF');
      expect(result.dark.tint).toBe('#007AFF');
    });
  });

  describe('isColorToken', () => {
    it('returns true for valid color tokens', () => {
      expect(isColorToken('tint', normalized.light)).toBe(true);
      expect(isColorToken('card', normalized.light)).toBe(true);
      expect(isColorToken('secondaryText', normalized.light)).toBe(true);
    });

    it('returns false for raw color strings', () => {
      expect(isColorToken('#FF0000', normalized.light)).toBe(false);
      expect(isColorToken('not-a-token', normalized.light)).toBe(false);
    });
  });
});
