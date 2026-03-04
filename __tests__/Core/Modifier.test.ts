import {
  resolveSpacing,
  resolveBorderRadius,
  resolveFontSize,
} from '../../src/Core/Modifier';
import { testThemeConfig } from '../Helpers/testThemeConfig';

const layout = testThemeConfig.layout;
const fonts = testThemeConfig.fonts;

describe('Modifier resolver functions', () => {
  describe('resolveSpacing', () => {
    it('returns number as-is', () => {
      expect(resolveSpacing(16, layout)).toBe(16);
    });

    it('resolves token to number', () => {
      expect(resolveSpacing('md', layout)).toBe(layout.spacing.md);
    });

    it('resolves all spacing tokens', () => {
      expect(resolveSpacing('xs', layout)).toBe(layout.spacing.xs);
      expect(resolveSpacing('sm', layout)).toBe(layout.spacing.sm);
      expect(resolveSpacing('lg', layout)).toBe(layout.spacing.lg);
      expect(resolveSpacing('xl', layout)).toBe(layout.spacing.xl);
    });
  });

  describe('resolveBorderRadius', () => {
    it('returns number as-is', () => {
      expect(resolveBorderRadius(12, layout)).toBe(12);
    });

    it('resolves token to number', () => {
      expect(resolveBorderRadius('md', layout)).toBe(layout.borderRadius.md);
    });

    it('resolves all border radius tokens', () => {
      expect(resolveBorderRadius('sm', layout)).toBe(layout.borderRadius.sm);
      expect(resolveBorderRadius('lg', layout)).toBe(layout.borderRadius.lg);
    });
  });

  describe('resolveFontSize', () => {
    it('returns number as-is', () => {
      expect(resolveFontSize(20, fonts)).toBe(20);
    });

    it('resolves token to number', () => {
      expect(resolveFontSize('title', fonts)).toBe(fonts.size.title);
    });

    it('resolves all font size tokens', () => {
      expect(resolveFontSize('micro', fonts)).toBe(fonts.size.micro);
      expect(resolveFontSize('body', fonts)).toBe(fonts.size.body);
      expect(resolveFontSize('hero', fonts)).toBe(fonts.size.hero);
    });
  });
});
