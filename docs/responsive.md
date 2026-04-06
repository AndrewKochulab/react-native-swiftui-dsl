# Responsive System

Breakpoint-based responsive layout for phones and tablets.

[<-- Back to README](../README.md)

> For implementation details, see [src/Responsive/README.md](../src/Responsive/README.md)
> See [examples/04-responsive-layout.tsx](../examples/04-responsive-layout.tsx)

---

## Basic Usage

```ts
Text('Hello')
  .responsive({
    compact: v => v.font(Font.body).padding(Spacing.sm),
    regular: v => v.font(Font.title).padding(Spacing.md),
    large: v => v.font(Font.header).padding(Spacing.lg),
  })
```

## Individual Breakpoint Modifiers

```ts
VStack(...)
  .onCompact(v => v.padding(Spacing.sm).spacing(8))
  .onRegular(v => v.padding(Spacing.md).spacing(12))
  .onLarge(v => v.padding(Spacing.xl).spacing(24))
```

## Default Breakpoints

| Size Class | Width Range | Typical Devices            |
| ---------- | ----------- | -------------------------- |
| `compact`  | 0--599px    | Phones (portrait)          |
| `regular`  | 600--1023px | Phones (landscape), small tablets |
| `large`    | 1024px+     | Tablets, iPad Pro          |

## Custom Breakpoints

```ts
const theme: DSLThemeConfig = {
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
```

## ResponsiveProvider

`ResponsiveProvider` is the standalone responsive context provider. `DSLThemeProvider` wraps it internally, but you can use it independently when you need responsive features without theming.

```tsx
import { ResponsiveProvider } from 'react-native-swiftui-dsl';

// Standalone -- no theme provider needed
<ResponsiveProvider>
  {Text('Hello').responsive({
    compact: (v) => v.font(Font.body),
    regular: (v) => v.font(Font.title),
  }).toElement()}
</ResponsiveProvider>

// With custom breakpoints
<ResponsiveProvider
  breakpointOverrides={{ compact: { min: 0, max: 430 } }}
  customBreakpoints={[{ name: 'smallPhone', minWidth: 0, maxWidth: 375 }]}
>
  {children}
</ResponsiveProvider>
```

## Hooks

```ts
import { useSizeClass, useResponsiveContext } from 'react-native-swiftui-dsl';

const sizeClass = useSizeClass(); // 'compact' | 'regular' | 'large'
const ctx = useResponsiveContext(); // { sizeClass, orientation, width, height, scale }
```
