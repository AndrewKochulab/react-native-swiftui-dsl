# Theme

A lightweight theming system supporting light/dark color schemes, design tokens for fonts, spacing, and border radii, and React context-based propagation. The theme is consumed automatically by `DSLRenderer` and all primitives.

## Files

| File | Purpose |
|------|---------|
| `types.ts` | All theme-related TypeScript types and the `normalizeColors` utility |
| `DSLThemeContext.ts` | React context definition and `useDSLTheme()` hook |
| `DSLThemeProvider.tsx` | React context provider component |

## API Reference

### Types (`types.ts`)

#### `ColorScheme`

```ts
type ColorScheme = 'light' | 'dark';
```

#### `SpacingToken`

```ts
type SpacingToken = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
```

#### `BorderRadiusToken`

```ts
type BorderRadiusToken = 'sm' | 'md' | 'lg';
```

#### `FontSizeToken`

```ts
type FontSizeToken =
  | 'micro' | 'small' | 'caption' | 'footnote' | 'body'
  | 'subtitle' | 'title2' | 'title' | 'header' | 'hero';
```

#### `FontWeightToken`

```ts
type RequiredFontWeightToken = 'regular' | 'medium' | 'semibold' | 'bold';
type OptionalFontWeightToken = 'thin' | 'ultralight' | 'light' | 'heavy' | 'black';
type FontWeightToken = RequiredFontWeightToken | OptionalFontWeightToken;
```

Required weight tokens must be present in every theme config. Optional weight tokens have framework-provided fallback values in `DSLDefaults.fontWeightFallbacks`.

#### `DSLFonts`

```ts
interface DSLFonts {
  size: Record<FontSizeToken, number>;
  weight: Record<RequiredFontWeightToken, string> & Partial<Record<OptionalFontWeightToken, string>>;
  lineHeight: Record<string, number>;
}
```

#### `DSLLayout`

```ts
interface DSLLayout {
  spacing: Record<SpacingToken, number>;
  borderRadius: Record<BorderRadiusToken, number>;
}
```

#### `DSLColors`

A flat dictionary mapping color token names to CSS color strings.

```ts
interface DSLColors {
  [key: string]: string;
}
```

#### `DSLColorConfig`

Colors can be provided as a single flat palette (used for both light and dark) or as separate `light` and `dark` palettes.

```ts
type DSLColorConfig = { light: DSLColors; dark: DSLColors } | DSLColors;
```

#### `normalizeColors(colors)`

Normalizes a `DSLColorConfig` into the `{ light, dark }` form. If a single flat palette is given, it is used for both schemes.

```ts
function normalizeColors(colors: DSLColorConfig): { light: DSLColors; dark: DSLColors }
```

**Example:**

```ts
import { normalizeColors } from 'react-native-swiftui-dsl';

// Single palette -- used for both light and dark
const normalized = normalizeColors({ text: '#000', background: '#FFF' });
// => { light: { text: '#000', background: '#FFF' }, dark: { text: '#000', background: '#FFF' } }

// Dual palette -- passed through as-is
const dual = normalizeColors({
  light: { text: '#000', background: '#FFF' },
  dark: { text: '#FFF', background: '#000' },
});
```

#### `DSLThemeConfig`

The complete theme configuration object.

```ts
interface DSLThemeConfig {
  colors: DSLColorConfig;
  fonts: DSLFonts;
  layout: DSLLayout;
}
```

---

### `DSLThemeContext` and `useDSLTheme()` (`DSLThemeContext.ts`)

#### `DSLThemeContextValue`

```ts
interface DSLThemeContextValue {
  config: DSLThemeConfig;
  colorScheme: ColorScheme;
}
```

#### `DSLThemeContext`

The raw React context. You normally do not need to use this directly.

```ts
const DSLThemeContext: React.Context<DSLThemeContextValue | null>
```

#### `useDSLTheme()`

Hook that returns the current theme configuration and color scheme. If no `DSLThemeProvider` is present in the tree, it returns a fallback value using `defaultThemeConfig` with `'light'` color scheme instead of throwing an error.

```ts
function useDSLTheme(): DSLThemeContextValue
```

**Example:**

```ts
import { useDSLTheme } from 'react-native-swiftui-dsl';

function MyCustomComponent() {
  const { config, colorScheme } = useDSLTheme();

  return (
    <View style={{ padding: config.layout.spacing.md }}>
      <Text style={{ fontSize: config.fonts.size.body }}>
        Current scheme: {colorScheme}
      </Text>
    </View>
  );
}
```

---

### `DSLThemeProvider` (`DSLThemeProvider.tsx`)

A React context provider that supplies theme configuration and color scheme to all DSL components in the subtree.

```ts
interface Props {
  config: DSLThemeConfig;
  colorScheme: ColorScheme;
  children: React.ReactNode;
}

function DSLThemeProvider({ config, colorScheme, children }: Props): JSX.Element
```

**Example -- basic setup:**

```tsx
import { DSLThemeProvider } from 'react-native-swiftui-dsl';
import { useColorScheme } from 'react-native';

const themeConfig: DSLThemeConfig = {
  colors: {
    light: { text: '#000', background: '#FFF', tint: '#007AFF', /* ... */ },
    dark:  { text: '#FFF', background: '#000', tint: '#0A84FF', /* ... */ },
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
};

export default function App() {
  const scheme = useColorScheme() ?? 'light';

  return (
    <DSLThemeProvider config={themeConfig} colorScheme={scheme}>
      {/* All DSL components inside here will use the theme */}
    </DSLThemeProvider>
  );
}
```

**Example -- without a provider (zero-config):**

```ts
import { Text } from 'react-native-swiftui-dsl';

// This works out of the box using defaultThemeConfig + 'light' scheme
export default function App() {
  return Text('No provider needed').font('title').toElement();
}
```
