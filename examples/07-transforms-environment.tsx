/**
 * Example 7: Transforms & Environment Values
 *
 * Demonstrates transform modifiers (offset, rotation, scale, blur, overlay)
 * and the environment value system for passing data down the tree.
 */
import React from 'react';
import {
  VStack, HStack, ZStack, Text, Image, Spacer, Divider,
  DSLRenderer, DSLThemeProvider, defaultThemeConfig,
  Color, Font, Spacing, Radius, ColorScheme as ColorSchemeValue,
} from 'react-native-swiftui-dsl';

// --- Transform examples ---

function buildTransformDemo() {
  return VStack(
    Text('Transform Modifiers').font(Font.title).bold(),

    Divider(),

    // Offset
    Text('Offset (10, -5)')
      .font(Font.body)
      .offset(10, -5)
      .background(Color.card)
      .padding(Spacing.sm),

    // Rotation
    Text('Rotated 15 degrees')
      .font(Font.body)
      .rotation(15)
      .background(Color.card)
      .padding(Spacing.sm),

    // Scale
    Text('Scaled 1.2x')
      .font(Font.body)
      .scale(1.2)
      .background(Color.card)
      .padding(Spacing.sm),

    // Scale with alias
    Text('Scale Effect')
      .font(Font.body)
      .scaleEffect(0.9, 1.1)
      .background(Color.card)
      .padding(Spacing.sm),

    // Combined transforms
    Text('Combined: offset + rotate + scale')
      .font(Font.caption)
      .offset(5, 0)
      .rotation(-5)
      .scale(1.1)
      .background(Color.tint)
      .foregroundColor(Color.background)
      .padding(Spacing.sm)
      .cornerRadius(Radius.sm),

    // Overlay
    ZStack(
      Image({ uri: 'https://example.com/cover.jpg' })
        .frame({ width: 200, height: 150 })
        .cornerRadius(Radius.md)
        .overlay(() =>
          VStack(
            Spacer(),
            Text('Featured')
              .font(Font.caption)
              .bold()
              .foregroundColor(Color.background)
              .padding(Spacing.xs)
              .background(Color.tint)
              .cornerRadius(Radius.sm),
          ).padding(Spacing.sm),
        ),
    ),

    // Blur (requires @react-native-community/blur)
    Text('Blurred text')
      .font(Font.body)
      .blur(5),
  )
    .padding(Spacing.lg)
    .spacing(20);
}

// --- Environment values ---

function buildEnvironmentDemo() {
  return VStack(
    Text('Environment Values').font(Font.title).bold(),

    Divider(),

    // Parent sets environment values
    VStack(
      Text('This section has accent color from environment').font(Font.body),
      Text('Child views can read these values').font(Font.footnote).secondary(),
    )
      .environment('accentColor', Color.tint)
      .environment('spacing', Spacing.sm)
      .padding(Spacing.lg)
      .background(Color.card)
      .cornerRadius(Radius.md),

    // Nested environment overrides
    VStack(
      Text('Outer environment').font(Font.body),
      VStack(
        Text('Inner environment (overridden)').font(Font.body),
      )
        .environment('accentColor', Color.error)
        .padding(Spacing.md)
        .background(Color.card)
        .cornerRadius(Radius.sm),
    )
      .environment('accentColor', Color.tint)
      .padding(Spacing.lg),
  )
    .padding(Spacing.lg)
    .spacing(16);
}

export default function TransformsEnvironmentDemo() {
  return (
    <DSLThemeProvider config={defaultThemeConfig} colorScheme={ColorSchemeValue.light}>
      <DSLRenderer
        builder={VStack(
          buildTransformDemo(),
          Divider(),
          buildEnvironmentDemo(),
        ).spacing(24)}
      />
    </DSLThemeProvider>
  );
}
