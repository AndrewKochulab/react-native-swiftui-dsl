/**
 * Example 6: Global Registration
 *
 * Demonstrates using `import 'react-native-swiftui-dsl/globals'`
 * so all DSL types are available globally without individual imports.
 *
 * Setup: Add this import once in your app entry point (App.tsx or index.ts):
 *
 *   import 'react-native-swiftui-dsl/globals';
 *
 * Then in any file — no imports needed.
 */

// In your App.tsx (once):
// import 'react-native-swiftui-dsl/globals';

// Note: This example uses explicit imports for clarity,
// but with globals registered, they would not be needed.

import React from 'react';
import {
  VStack, HStack, Text, Button, Spacer, Divider, Image,
  ViewModifier, ViewBuilder, DSLView,
  createModifiers, composeModifiers,
  DSLRenderer, DSLThemeProvider, defaultThemeConfig,
  Color, Font, Weight, Spacing, Radius, ButtonVariant,
  ColorScheme as ColorSchemeValue,
} from 'react-native-swiftui-dsl';

// With globals, the code below would work without the import above:

class AppCardModifier extends ViewModifier {
  body(content: ViewBuilder): ViewBuilder {
    return content
      .padding(Spacing.lg)
      .background(Color.card)
      .cornerRadius(Radius.md)
      .shadow();
  }
}

const appStyles = createModifiers({
  screenTitle: v => v.font(Font.header).bold(),
  sectionTitle: v => v.font(Font.subtitle).semibold(),
  bodyText: v => v.font(Font.body),
  mutedText: v => v.font(Font.footnote).secondary(),
});

class FeatureCard extends DSLView<{ title: string; description: string; icon: string }> {
  body(): ViewBuilder {
    return HStack(
      Text(this.props.icon).font(Font.title),
      VStack(
        Text(this.props.title).apply(appStyles.sectionTitle),
        Text(this.props.description).apply(appStyles.mutedText),
      ).spacing(4),
    )
      .modifier(new AppCardModifier())
      .spacing(12);
  }
}

function buildHomeScreen() {
  return VStack(
    Text('Home').apply(appStyles.screenTitle),

    FeatureCard.build({
      title: 'ViewModifier',
      description: 'Reusable, composable style modifiers',
      icon: '🎨',
    }),

    FeatureCard.build({
      title: 'Responsive',
      description: 'Adaptive layouts for any screen size',
      icon: '📱',
    }),

    FeatureCard.build({
      title: 'Animations',
      description: 'Spring, timing, and transition effects',
      icon: '✨',
    }),

    FeatureCard.build({
      title: 'Gestures',
      description: 'Swipe, pan, pinch, and rotation',
      icon: '👆',
    }),
  )
    .padding(Spacing.lg)
    .spacing(16);
}

export default function GlobalImportDemo() {
  return (
    <DSLThemeProvider config={defaultThemeConfig} colorScheme={ColorSchemeValue.light}>
      <DSLRenderer builder={buildHomeScreen()} />
    </DSLThemeProvider>
  );
}
