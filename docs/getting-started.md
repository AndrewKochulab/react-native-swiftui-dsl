# Getting Started

Quick setup guide for `react-native-swiftui-dsl` -- from installation to your first screen.

[<-- Back to README](../README.md)

> For implementation details, see [src/Config/README.md](../src/Config/README.md)
> See [examples/01-basic-usage.tsx](../examples/01-basic-usage.tsx)

---

## Installation

```bash
npm install react-native-swiftui-dsl
```

### Peer Dependencies

```bash
# Required
npm install react react-native react-native-safe-area-context

# Optional -- only needed for specific features
npm install @expo/vector-icons   # For Icon primitive (FontAwesome icons)
npm install expo-router           # For ScreenConfigRenderer navigation
```

| Dependency                       | Version   | Required | Notes                                                                           |
| -------------------------------- | --------- | -------- | ------------------------------------------------------------------------------- |
| `react`                          | >= 18.0.0 | Yes      |                                                                                 |
| `react-native`                   | >= 0.72.0 | Yes      |                                                                                 |
| `react-native-safe-area-context` | >= 4.0.0  | Yes      | For `SafeArea` primitive                                                        |
| `@expo/vector-icons`             | >= 14.0.0 | **No**   | For `Icon` primitive. Without it, icons render as text fallback.                |
| `expo-router`                    | *any*     | **No**   | For `ScreenConfigRenderer`. Without it, screen navigation modifiers are no-ops. |

---

## Quick Start

### Option A: Config-Free (zero setup)

The framework ships with **built-in defaults** based on the iOS Human Interface Guidelines. No provider needed:

```tsx
import { VStack, Text, Button, DSLRenderer, Font, Spacing, ButtonVariant, Alignment } from 'react-native-swiftui-dsl';

function buildWelcomeScreen() {
  return VStack(
    Text('Hello, World!').font(Font.header).bold(),
    Text('Your first DSL screen').secondary(),
    Button('Continue', () => console.log('Tapped!'), { style: ButtonVariant.filled }),
  )
  .padding(Spacing.lg)
  .spacing(16)
  .alignment(Alignment.center);
}

export default function WelcomeScreen() {
  return <DSLRenderer builder={buildWelcomeScreen()} />;
}
```

That's it. No `DSLThemeProvider`, no `StyleSheet`, no color conditionals, no boilerplate.

When no `DSLThemeProvider` is present, `useDSLTheme()` returns the built-in `defaultThemeConfig` with `colorScheme: ColorSchemeValue.light`. All tokens, colors, and modifiers work exactly the same.

### Option B: Custom Theme

Wrap your app root with `DSLThemeProvider` to supply your own design tokens:

```tsx
import { DSLThemeProvider, ColorScheme as ColorSchemeValue } from 'react-native-swiftui-dsl';

export default function App() {
  return (
    <DSLThemeProvider
      config={{
        colors: {
          light: { text: '#111827', background: '#F9FAFB', tint: '#10B981', card: '#FFF', secondaryText: '#6B7280' },
          dark:  { text: '#F9FAFB', background: '#0F172A', tint: '#34D399', card: '#1E293B', secondaryText: '#94A3B8' },
        },
        fonts: {
          size: { micro: 10, small: 11, caption: 12, footnote: 13, body: 17, subtitle: 20, title2: 22, title: 28, header: 34, hero: 40 },
          weight: { regular: '400', medium: '500', semibold: '600', bold: '700' },
          lineHeight: { tight: 16, normal: 22, relaxed: 28, loose: 34 },
        },
        layout: {
          spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
          borderRadius: { sm: 4, md: 8, lg: 16 },
        },
      }}
      colorScheme={ColorSchemeValue.light}
    >
      {/* Your app content */}
    </DSLThemeProvider>
  );
}
```

---

## Config-Free Usage

`DSLThemeProvider` is **fully optional**. The framework includes a complete `defaultThemeConfig` that provides sensible defaults for every token:

```ts
// These tokens resolve automatically -- no provider needed:
Text('Hello').font(Font.title).bold()                // fontSize: 28, fontWeight: '700'
VStack(...).padding(Spacing.lg)                      // padding: 24
VStack(...).background(Color.card)                   // backgroundColor: '#F2F2F7' (light)
VStack(...).cornerRadius(Radius.md)                  // borderRadius: 8
Button('Go', handler, { style: ButtonVariant.filled }) // backgroundColor: '#007AFF'
```

The built-in defaults use iOS system colors and standard spacing scales. You can override any or all of them by adding a `DSLThemeProvider` whenever you're ready.

### Single Color Scheme Support

The `DSLColorConfig` type is a union that accepts either a dual-scheme object or a single flat palette:

```ts
import { DSLThemeConfig } from 'react-native-swiftui-dsl';

// Dual scheme (light + dark):
const dualConfig: DSLThemeConfig = {
  colors: {
    light: { text: '#000', background: '#FFF', tint: '#007AFF', /* ... */ },
    dark:  { text: '#FFF', background: '#000', tint: '#0A84FF', /* ... */ },
  },
  // ...
};

// Single scheme (same colors for both modes):
const singleConfig: DSLThemeConfig = {
  colors: {
    text: '#000',
    background: '#FFF',
    tint: '#007AFF',
    // ...
  },
  // ...
};
```

When a single `DSLColors` object is provided (no `light`/`dark` keys), `normalizeColors()` automatically mirrors it to both schemes.
