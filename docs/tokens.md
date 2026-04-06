# Token System

Tokens are the foundation of the DSL's design system. They provide type-safe, theme-aware values for colors, spacing, fonts, and border radii.

[<-- Back to README](../README.md)

> For full token implementation details, see [src/Tokens/README.md](../src/Tokens/README.md)

---

## Overview

Instead of raw values scattered throughout your codebase, the DSL uses **token enums** that resolve at render time based on the active theme and color scheme.

```ts
import { Color, Font, Spacing, Radius } from 'react-native-swiftui-dsl';

Text('Hello')
  .font(Font.title)              // resolves to fontSize: 28
  .foregroundColor(Color.tint)   // resolves to '#007AFF' (light) or '#0A84FF' (dark)
  .padding(Spacing.lg)           // resolves to 24
  .cornerRadius(Radius.md)       // resolves to 8
```

## Token Categories

### Color Tokens

Used with `.background()`, `.foregroundColor()`, `.border()`, and other color modifiers.

| Token             | Description                      |
| ----------------- | -------------------------------- |
| `Color.text`      | Primary text color               |
| `Color.background`| Screen background                |
| `Color.tint`      | Accent / brand color             |
| `Color.card`      | Card / surface background        |
| `Color.secondaryText` | Secondary / muted text      |

All color tokens auto-resolve for the current `colorScheme` (light/dark).

### Spacing Tokens

Used with `.padding()`, `.margin()`, `.spacing()`, and gap modifiers.

| Token        | Default Value |
| ------------ | ------------- |
| `Spacing.xs` | 4             |
| `Spacing.sm` | 8             |
| `Spacing.md` | 16            |
| `Spacing.lg` | 24            |
| `Spacing.xl` | 32            |

### Font Tokens

Used with `.font()`.

| Token          | Default Size |
| -------------- | ------------ |
| `Font.micro`   | 10           |
| `Font.small`   | 11           |
| `Font.caption`  | 12          |
| `Font.footnote` | 13          |
| `Font.body`    | 17           |
| `Font.subtitle`| 20           |
| `Font.title2`  | 22           |
| `Font.title`   | 28           |
| `Font.header`  | 34           |
| `Font.hero`    | 40           |

### Border Radius Tokens

Used with `.cornerRadius()`.

| Token       | Default Value |
| ----------- | ------------- |
| `Radius.sm` | 4             |
| `Radius.md` | 8             |
| `Radius.lg` | 16            |

## Custom Tokens

Override any token by providing your own values in `DSLThemeConfig`:

```tsx
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
  {/* Your app */}
</DSLThemeProvider>
```

Token values are resolved by `ThemeResolver` at render time, so changing the theme config or color scheme updates all components automatically.
