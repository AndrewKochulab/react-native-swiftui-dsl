/**
 * Example 2: ViewModifier Protocol
 *
 * Demonstrates class-based modifiers, function-based modifiers,
 * createModifiers, composeModifiers, and the .if() conditional.
 */
import React from 'react';
import {
  VStack, HStack, Text, Button, Spacer, Divider,
  ViewModifier, ViewBuilder, ViewModifierFn,
  composeModifiers, createModifiers,
  DSLRenderer, DSLThemeProvider, defaultThemeConfig,
  Color, Font, Weight, Spacing, Radius, ButtonVariant,
  Alignment, JustifyContent, ColorScheme as ColorSchemeValue,
} from 'react-native-swiftui-dsl';
import type { SpacingToken, BorderRadiusToken } from 'react-native-swiftui-dsl';

// --- Class-based modifier (SwiftUI pattern) ---

class CardModifier extends ViewModifier {
  private radius: BorderRadiusToken;
  private spacing: SpacingToken;

  constructor(options?: { radius?: BorderRadiusToken; spacing?: SpacingToken }) {
    super();
    this.radius = options?.radius ?? Radius.md;
    this.spacing = options?.spacing ?? Spacing.lg;
  }

  body(content: ViewBuilder): ViewBuilder {
    return content
      .padding(this.spacing)
      .background(Color.card)
      .cornerRadius(this.radius)
      .shadow();
  }
}

class ElevatedModifier extends ViewModifier {
  body(content: ViewBuilder): ViewBuilder {
    return content.shadow({ radius: 12, elevation: 6 });
  }
}

// --- Function-based modifiers (quick & simple) ---

const titleStyle: ViewModifierFn = v => v.font(Font.title).bold();
const captionStyle: ViewModifierFn = v => v.font(Font.caption).secondary();

// --- Grouped modifiers (like StyleSheet.create) ---

const styles = createModifiers({
  card: v => v.padding(Spacing.lg).background(Color.card).cornerRadius(Radius.md),
  header: v => v.font(Font.header).bold().foregroundColor(Color.text),
  badge: v => v.paddingHorizontal(Spacing.sm).paddingVertical(Spacing.xs).background(Color.tint).cornerRadius(Radius.lg),
  centered: v => v.alignment(Alignment.center).justifyContent(JustifyContent.center),
});

// --- Composed modifiers ---

const elevatedCard = composeModifiers(
  new CardModifier(),
  new ElevatedModifier(),
);

// --- Usage ---

function buildModifierDemo(isOnSale: boolean, isFeatured: boolean) {
  return VStack(
    // Class-based modifier
    Text('Class-Based Modifier')
      .apply(titleStyle)
      .modifier(new CardModifier({ radius: Radius.lg, spacing: Spacing.md })),

    Divider(),

    // Function-based modifier
    Text('Function-Based Modifier')
      .apply(captionStyle),

    Divider(),

    // Grouped modifiers
    VStack(
      Text('Grouped Styles').apply(styles.header),
      Text('Using createModifiers').apply(styles.badge),
    ).apply(styles.card),

    Divider(),

    // Composed modifiers
    Text('Composed: Card + Elevated')
      .font(Font.body)
      .modifier(elevatedCard),

    Divider(),

    // Conditional modifiers
    Text('$29.99')
      .font(Font.title)
      .if(isOnSale, v => v.foregroundColor(Color.error).strikethrough())
      .if(isFeatured, v => v.bold().font(Font.hero)),

    // Multiple conditions
    Button('Buy Now', () => {}, { style: ButtonVariant.filled })
      .if(!isOnSale, v => v.opacity(0.5).disabled()),
  )
    .padding(Spacing.lg)
    .spacing(16);
}

export default function ViewModifierDemo() {
  return (
    <DSLThemeProvider config={defaultThemeConfig} colorScheme={ColorSchemeValue.light}>
      <DSLRenderer builder={buildModifierDemo(true, false)} />
    </DSLThemeProvider>
  );
}
