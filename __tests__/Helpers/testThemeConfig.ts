import type { DSLThemeConfig, DSLColors } from '@/Theme/types';

/**
 * Self-contained test theme configuration for DSL framework tests.
 * This file has no external dependencies, allowing the framework
 * tests to run independently of any project.
 */
export const testThemeConfig: DSLThemeConfig = {
  colors: {
    light: {
      text: '#111827',
      background: '#F9FAFB',
      tint: '#10B981',
      card: '#FFFFFF',
      cardBorder: '#E5E7EB',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      secondaryText: '#6B7280',
      inputBackground: '#F3F4F6',
      inputBorder: '#D1D5DB',
      accent: '#0EA5E9',
      separator: '#E5E7EB',
      white: '#FFFFFF',
      black: '#000000',
      link: '#2e78b7',
      cardShadow: 'rgba(0, 0, 0, 0.08)',
    },
    dark: {
      text: '#F9FAFB',
      background: '#0F172A',
      tint: '#34D399',
      card: '#1E293B',
      cardBorder: '#334155',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      secondaryText: '#94A3B8',
      inputBackground: '#1E293B',
      inputBorder: '#475569',
      accent: '#38BDF8',
      separator: '#334155',
      white: '#FFFFFF',
      black: '#000000',
      link: '#38BDF8',
      cardShadow: 'rgba(0, 0, 0, 0.3)',
    },
  },
  fonts: {
    size: {
      micro: 10,
      small: 11,
      caption: 12,
      footnote: 14,
      body: 15,
      subtitle: 17,
      title2: 20,
      title: 22,
      header: 28,
      hero: 34,
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: 16,
      normal: 20,
      relaxed: 22,
      loose: 28,
    },
  },
  layout: {
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    borderRadius: {
      sm: 8,
      md: 12,
      lg: 20,
    },
  },
};

/**
 * Pre-narrowed colors for test assertions.
 * Avoids TypeScript DSLColorConfig union narrowing issues.
 */
export const testColors = testThemeConfig.colors as { light: DSLColors; dark: DSLColors };
