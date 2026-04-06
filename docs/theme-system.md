# Theme System

The DSL uses a **token-based design system**. Define your tokens once in `DSLThemeConfig`, and every modifier resolves them automatically -- including light/dark mode switching.

[<-- Back to README](../README.md)

> For implementation details, see [src/Theme/README.md](../src/Theme/README.md) and [src/Config/README.md](../src/Config/README.md)

---

## Color Tokens

Any color modifier (`.background()`, `.foregroundColor()`, `.border()`) accepts either:

- A **token name** from your config: `'tint'`, `'card'`, `'error'`, `'secondaryText'`
- A **raw value**: `'#FF0000'`, `'rgba(0,0,0,0.5)'`

Tokens resolve to the correct value based on the current `colorScheme` -- no manual `useColorScheme()` checks needed.

## DSLColorConfig Union Type

The `colors` field of `DSLThemeConfig` accepts a `DSLColorConfig` union:

```ts
type DSLColorConfig =
  | { light: DSLColors; dark: DSLColors }  // Dual-scheme: separate palettes
  | DSLColors;                              // Single-scheme: same for both modes
```

When you pass a flat `DSLColors` object, the framework's `normalizeColors()` function mirrors it to both `light` and `dark` automatically.

## Spacing Tokens

Padding and margin modifiers accept: `'xs'` (4), `'sm'` (8), `'md'` (16), `'lg'` (24), `'xl'` (32) -- or raw numbers.

## Font Size Tokens

| Token      | Default Size |
| ---------- | ------------ |
| `micro`    | 10           |
| `small`    | 11           |
| `caption`  | 12           |
| `footnote` | 13           |
| `body`     | 17           |
| `subtitle` | 20           |
| `title2`   | 22           |
| `title`    | 28           |
| `header`   | 34           |
| `hero`     | 40           |

## Font Weight Tokens

| Token        | Weight Value | Required               |
| ------------ | ------------ | ---------------------- |
| `regular`    | 400          | Yes                    |
| `medium`     | 500          | Yes                    |
| `semibold`   | 600          | Yes                    |
| `bold`       | 700          | Yes                    |
| `thin`       | 100          | No (fallback provided) |
| `ultralight` | 200          | No (fallback provided) |
| `light`      | 300          | No (fallback provided) |
| `heavy`      | 800          | No (fallback provided) |
| `black`      | 900          | No (fallback provided) |

Optional weight tokens (`thin`, `ultralight`, `light`, `heavy`, `black`) have built-in fallbacks in `DSLDefaults.fontWeightFallbacks`, so they work even if your theme config only defines the four required weights.

## Accessing Theme in Custom Components

```tsx
import { useDSLTheme } from 'react-native-swiftui-dsl';

function CustomComponent() {
  const { config, colorScheme } = useDSLTheme();
  const bgColor = config.colors[colorScheme].card;
  // Use bgColor in your custom View...
}
```

If no `DSLThemeProvider` is present, `useDSLTheme()` returns `defaultThemeConfig` with `colorScheme: ColorSchemeValue.light` instead of throwing.

---

## Configuration

All framework defaults are centralized in `DSLDefaults`:

| Default                   | Value     | Description                             |
| ------------------------- | --------- | --------------------------------------- |
| `spacing`                 | `'md'`    | Default spacing token                   |
| `edge`                    | `'all'`   | Default padding/margin edge             |
| `flex`                    | `1`       | Default flex value                      |
| `buttonHeight`            | `48`      | Default button height (px)              |
| `buttonCornerRadius`      | `12`      | Default button corner radius (px)       |
| `iconSize`                | `18`      | Default icon size (px)                  |
| `pressedOpacity`          | `0.9`     | Button pressed state opacity            |
| `imageResizeMode`         | `'cover'` | Default image resize mode               |
| `onEndReachedThreshold`   | `0.5`     | Infinite scroll trigger threshold       |
| `progressBarHeight`       | `4`       | Default progress bar height (px)        |
| `progressBarCornerRadius` | `2`       | Default progress bar corner radius (px) |

You can also import the full default theme:

```ts
import { defaultThemeConfig } from 'react-native-swiftui-dsl';
```

This is the same config used automatically when no `DSLThemeProvider` is present.

---

## Rendering

Every `ViewBuilder` has a `.toElement()` method that materializes the builder tree into React elements:

```tsx
// Option 1: Inline
const element = VStack(Text('Hello')).padding(Spacing.md).toElement();
return element;

// Option 2: DSLRenderer component
return <DSLRenderer builder={myBuilder} />;
```
