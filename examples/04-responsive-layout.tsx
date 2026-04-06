/**
 * Example 4: Responsive Layout
 *
 * Demonstrates breakpoint-based responsive modifiers for phones, tablets,
 * and custom breakpoints.
 */
import React from 'react';
import {
  VStack, HStack, Text, Image, Button, Spacer,
  DSLRenderer, DSLThemeProvider, ResponsiveProvider,
  DSLThemeConfig, defaultThemeConfig,
  Color, Font, Spacing, Radius, ColorScheme as ColorSchemeValue,
} from 'react-native-swiftui-dsl';

// --- Custom theme with breakpoints ---

const responsiveTheme: DSLThemeConfig = {
  ...defaultThemeConfig,
  responsive: {
    breakpoints: {
      compact: { min: 0, max: 430 },
      regular: { min: 431, max: 834 },
      large: { min: 835, max: Infinity },
    },
    customBreakpoints: [
      { name: 'smallPhone', minWidth: 0, maxWidth: 375 },
      { name: 'largeTablet', minWidth: 1024, maxWidth: Infinity },
    ],
  },
};

// --- Responsive card grid ---

function buildResponsiveGrid() {
  const card = (title: string, desc: string) =>
    VStack(
      Text(title).font(Font.subtitle).bold(),
      Text(desc).font(Font.footnote).secondary(),
    )
      .padding(Spacing.md)
      .background(Color.card)
      .cornerRadius(Radius.md)
      .shadow()
      .responsive({
        compact: v => v.frame({ maxWidth: Infinity }),
        regular: v => v.frame({ maxWidth: 300 }),
        large: v => v.frame({ maxWidth: 400 }),
      });

  return VStack(
    // Header adapts font size
    Text('Dashboard')
      .bold()
      .responsive({
        compact: v => v.font(Font.title),
        regular: v => v.font(Font.header),
        large: v => v.font(Font.hero),
      }),

    // Cards
    VStack(
      card('Sessions', '12 this week'),
      card('Streak', '5 days'),
      card('Goals', '3 of 5 complete'),
    )
      .onCompact(v => v.spacing(12))
      .onRegular(v => v.spacing(16))
      .onLarge(v => v.spacing(24)),

    // Content padding adapts
    Text('Recent Activity')
      .font(Font.subtitle)
      .bold()
      .responsive({
        compact: v => v.padding(Spacing.sm),
        regular: v => v.padding(Spacing.md),
        large: v => v.padding(Spacing.lg),
      }),
  )
    .padding(Spacing.lg)
    .spacing(20);
}

// ResponsiveProvider can also be used independently of DSLThemeProvider
// to supply only responsive breakpoints without full theming:
//
//   <ResponsiveProvider breakpoints={responsiveTheme.responsive!.breakpoints}>
//     <DSLRenderer builder={buildResponsiveGrid()} />
//   </ResponsiveProvider>

export default function ResponsiveDemo() {
  return (
    <DSLThemeProvider config={responsiveTheme} colorScheme={ColorSchemeValue.light}>
      <DSLRenderer builder={buildResponsiveGrid()} />
    </DSLThemeProvider>
  );
}
