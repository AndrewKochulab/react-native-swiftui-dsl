# Config

Centralized default values and fallback theme configuration for the DSL framework. All magic numbers and hard-coded values are consolidated here so they can be referenced and overridden from a single location.

## Files

| File | Purpose |
|------|---------|
| `Defaults.ts` | `DSLDefaults` constant object and `defaultThemeConfig` (iOS HIG-based theme) |

## API Reference

### `DSLDefaults`

A frozen constant object containing every default value used across the framework. Modifiers and renderers reference these values instead of inline magic numbers.

```ts
const DSLDefaults: {
  spacing: 'md';                          // Default spacing token
  edge: 'all';                            // Default padding/margin edge
  flex: 1;                                // Default flex value
  keyboardAvoidingOffset: 100;            // KeyboardAvoidingView offset (pt)
  keyboardShouldPersistTaps: 'handled';   // ScrollView keyboard behavior
  bounces: true;                          // ScrollView bounce default
  shadow: {                               // Default shadow configuration
    color: 'cardShadow';
    offset: { width: 0; height: 2 };
    opacity: 1;
    radius: 8;
    elevation: 3;
  };
  input: {                                // TextInput styling defaults
    borderRadius: 8;
    paddingHorizontal: 12;
    paddingVertical: 10;
    minHeight: 44;
    labelMarginBottom: 6;
    errorMarginTop: 4;
    wrapperMarginBottom: 12;
  };
  iconSize: 18;                           // Default icon size (pt)
  pressedOpacity: 0.9;                    // Pressed-state opacity
  fullOpacity: 1;                         // Normal-state opacity
  buttonHeight: 48;                       // Default button height (pt)
  buttonCornerRadius: 12;                 // Default button corner radius (pt)
  buttonPaddingHorizontal: 16;            // Default button horizontal padding (pt)
  buttonIconSpacing: 8;                   // Spacing between button icon and text (pt)
  buttonFontSize: 'body';                 // Default button font size token
  buttonBorderWidth: 1.5;                 // Outlined button border width
  imageResizeMode: 'cover';               // Default Image resize mode
  dividerColor: 'separator';              // Default Divider color token
  linkColor: 'tint';                      // Default Link color token
  onEndReachedThreshold: 0.5;             // LazyList onEndReached threshold
  fontWeightFallbacks: Record<string, string>; // Fallback weights for optional tokens
  progressBarHeight: 4;                   // Default ProgressBar height (pt)
  progressBarCornerRadius: 2;             // Default ProgressBar corner radius (pt)
}
```

**Example -- referencing defaults in custom code:**

```ts
import { DSLDefaults } from 'react-native-swiftui-dsl';

// Use the framework's default button height in your own component
const myButtonHeight = DSLDefaults.buttonHeight; // 48
```

### `defaultThemeConfig`

The fallback `DSLThemeConfig` used when no `DSLThemeProvider` wraps the component tree. Based on iOS Human Interface Guidelines system colors.

```ts
const defaultThemeConfig: DSLThemeConfig
```

**Light colors:** `text` (#000000), `background` (#FFFFFF), `tint` (#007AFF), `card` (#F2F2F7), `secondaryText` (#8E8E93), `separator` (#C6C6C8), `error` (#FF3B30), `success` (#34C759), `warning` (#FF9500), `inputBackground` (#F2F2F7), `buttonText` (#FFFFFF), `cardShadow` (rgba(0,0,0,0.1)).

**Dark colors:** `text` (#FFFFFF), `background` (#000000), `tint` (#0A84FF), `card` (#1C1C1E), `secondaryText` (#8E8E93), `separator` (#38383A), `error` (#FF453A), `success` (#30D158), `warning` (#FF9F0A), `inputBackground` (#1C1C1E), `buttonText` (#FFFFFF), `cardShadow` (rgba(0,0,0,0.3)).

**Font sizes:** `micro` (10), `small` (11), `caption` (12), `footnote` (13), `body` (17), `subtitle` (20), `title2` (22), `title` (28), `header` (34), `hero` (40).

**Font weights:** `regular` (400), `medium` (500), `semibold` (600), `bold` (700).

**Line heights:** `tight` (16), `normal` (22), `relaxed` (28), `loose` (34).

**Layout spacing:** `xs` (4), `sm` (8), `md` (16), `lg` (24), `xl` (32).

**Border radius:** `sm` (4), `md` (8), `lg` (16).

**Example -- using without a provider:**

```ts
import { Text } from 'react-native-swiftui-dsl';

// Works out of the box -- defaultThemeConfig is used automatically
export default function App() {
  return Text('Hello, world!').font('title').bold().padding().toElement();
}
```

**Example -- overriding with a provider:**

```ts
import { DSLThemeProvider, defaultThemeConfig } from 'react-native-swiftui-dsl';

const myConfig = {
  ...defaultThemeConfig,
  colors: {
    light: { ...defaultThemeConfig.colors.light, tint: '#FF6600' },
    dark: { ...defaultThemeConfig.colors.dark, tint: '#FF8800' },
  },
};

export default function App() {
  return (
    <DSLThemeProvider config={myConfig} colorScheme="light">
      {Text('Branded App').font('title').toElement()}
    </DSLThemeProvider>
  );
}
```
