



Chainable modifiers • Theme-aware colors • Two-way bindings • Zero JSX • Config-free defaults

---

What if building React Native screens felt as natural as SwiftUI? This framework replaces verbose JSX and scattered `StyleSheet` objects with **chainable, type-safe function calls** that read like a blueprint of your UI.

```ts
VStack(
  Text('Welcome Back').font('title').bold(),
  Text('Track your practice sessions').secondary(),
  Button('Get Started', () => navigate('home'), { style: 'filled' }),
  Spacer(),
)
.padding('lg')
.background('card')
.cornerRadius('md')
.shadow()
```

No angle brackets. No style objects. Just clean, readable, composable code.

---

## Table of Contents

- [Why?](#why)
- [DSL vs JSX](#dsl-vs-jsx)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Config-Free Usage](#config-free-usage)
- [Examples](#examples)
- [API Reference: Primitives](#api-reference-primitives)
- [DSL-to-React-Native Component Mapping](#dsl-to-react-native-component-mapping)
- [API Reference: Modifiers](#api-reference-modifiers)
- [DSL Modifier-to-RN Property Mapping](#dsl-modifier-to-rn-property-mapping)
- [Theme System](#theme-system)
- [Bindings](#bindings)
- [Conditionals](#conditionals)
- [Configuration](#configuration)
- [Rendering](#rendering)
- [Navigation](#navigation)
- [Testing](#testing)
- [Architecture & Documentation](#architecture--documentation)
- [Platform Support](#platform-support)
- [Contributing](#contributing)
- [License](#license)

---

## Why?

Building UIs in React Native often means juggling **three separate concerns** that should be one:


| Pain Point           | Traditional RN                                     | With this DSL                                               |
| -------------------- | -------------------------------------------------- | ----------------------------------------------------------- |
| **Verbose markup**   | Deeply nested `<View>` / `<Text>` JSX              | Flat function calls: `VStack(Text(...))`                    |
| **Scattered styles** | `StyleSheet.create` at the bottom of every file    | Inline chainable modifiers: `.padding('lg').bold()`         |
| **Manual theming**   | `useColorScheme()` + conditional colors everywhere | Token-based: `.background('card')` auto-resolves light/dark |
| **Form boilerplate** | `value` + `onChangeText` on every input            | Two-way bindings: `TextInput($form.email)`                  |
| **Config overhead**  | Theme providers required before anything works     | Built-in defaults: works out of the box with zero config    |


The result? **Less code, fewer bugs, and UIs you can actually read.**

---

## DSL vs JSX

Here's the same profile card built both ways:

**Traditional React Native:**

```tsx
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

function ProfileCard({ user }: { user: User }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.card, { backgroundColor: isDark ? '#1E293B' : '#FFF' }]}>
      <Image
        source={{ uri: user.avatar }}
        style={styles.avatar}
        resizeMode="cover"
      />
      <Text style={[styles.name, { color: isDark ? '#F9FAFB' : '#111827' }]}>
        {user.name}
      </Text>
      <Text style={[styles.bio, { color: isDark ? '#94A3B8' : '#6B7280' }]}>
        {user.bio}
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => navigateToEdit()}
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 24, borderRadius: 12, alignItems: 'center', gap: 12 },
  avatar: { width: 80, height: 80, borderRadius: 20 },
  name: { fontSize: 22, fontWeight: '700' },
  bio: { fontSize: 14, textAlign: 'center' },
  button: { backgroundColor: '#10B981', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  buttonText: { color: '#FFF', fontWeight: '600' },
});
```

**With react-native-swiftui-dsl:**

```ts
import { VStack, Text, Image, Button, DSLRenderer } from 'react-native-swiftui-dsl';

function buildProfileCard(user: User) {
  return VStack(
    Image({ uri: user.avatar }, { resizeMode: 'cover' })
      .frame({ width: 80, height: 80 })
      .cornerRadius('lg'),
    Text(user.name).font('title').bold(),
    Text(user.bio).font('footnote').secondary().textAlign('center'),
    Button('Edit Profile', () => navigateToEdit(), { style: 'filled' }),
  )
  .padding('lg')
  .background('card')
  .cornerRadius('md')
  .alignment('center')
  .spacing(12);
}
```

Same result. **70% less code.** Colors auto-resolve for light and dark mode. No `StyleSheet` needed.

---

## Features

### Layout & Primitives

- **20 built-in primitives** -- VStack, HStack, ZStack, Text, Image, Button, Toggle, TextInput, ScrollStack, LazyList, SectionedList, SafeArea, Spacer, Divider, Icon, Spinner, Link, Raw, Modal, ProgressBar

### Styling

- **60+ chainable modifiers** -- padding, font, background, cornerRadius, shadow, border, opacity, position, zIndex, frame, hidden, fontFamily, italic, underline, strikethrough, and many more
- **Token-based theme** -- Define color, spacing, font, and border-radius tokens once. They auto-resolve for light/dark mode

### Data Flow

- **Two-way bindings** -- SwiftUI-style `createBinding` and `bindForm` for effortless form handling
- **Declarative control flow** -- `If()`, `ForEach()`, `Group()` instead of ternaries and `.map()`

### Developer Experience

- **Full TypeScript support** -- IntelliSense for every modifier, every token, every primitive
- **Zero JSX** -- Build entire screens with pure function calls
- **Config-free defaults** -- Works out of the box without wrapping your app in a theme provider
- **iOS + Android** -- Works with React Native and Expo out of the box

---

## Installation

```bash
npm install react-native-swiftui-dsl
```

**Peer dependencies**

```bash
# Required
npm install react react-native react-native-safe-area-context

# Optional - only needed for specific features
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
import { VStack, Text, Button, DSLRenderer } from 'react-native-swiftui-dsl';

function buildWelcomeScreen() {
  return VStack(
    Text('Hello, World!').font('header').bold(),
    Text('Your first DSL screen').secondary(),
    Button('Continue', () => console.log('Tapped!'), { style: 'filled' }),
  )
  .padding('lg')
  .spacing(16)
  .alignment('center');
}

export default function WelcomeScreen() {
  return <DSLRenderer builder={buildWelcomeScreen()} />;
}
```

That's it. No `DSLThemeProvider`, no `StyleSheet`, no color conditionals, no boilerplate.

When no `DSLThemeProvider` is present, `useDSLTheme()` returns the built-in `defaultThemeConfig` with `colorScheme: 'light'`. All tokens, colors, and modifiers work exactly the same.

### Option B: Custom Theme

Wrap your app root with `DSLThemeProvider` to supply your own design tokens:

```tsx
import { DSLThemeProvider } from 'react-native-swiftui-dsl';

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
      colorScheme="light"
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
Text('Hello').font('title').bold()          // fontSize: 28, fontWeight: '700'
VStack(...).padding('lg')                   // padding: 24
VStack(...).background('card')              // backgroundColor: '#F2F2F7' (light)
VStack(...).cornerRadius('md')              // borderRadius: 8
Button('Go', handler, { style: 'filled' }) // backgroundColor: '#007AFF'
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

---

## Examples

### Simple Stat Card

A styled card showing a single metric -- great for dashboards:

```ts
import { VStack, HStack, Text, Icon, Spacer } from 'react-native-swiftui-dsl';

function buildStatCard(title: string, value: string, icon: string) {
  return VStack(
    HStack(
      Icon(icon, { size: 20, color: 'tint' }),
      Spacer(),
      Text(title).font('caption').secondary(),
    ),
    Text(value).font('header').bold(),
  )
  .padding('lg')
  .background('card')
  .cornerRadius('md')
  .shadow();
}
```

### Modal Dialog

Present content in a modal overlay with binding-driven visibility:

```ts
import { VStack, Text, Button, Modal, createBinding } from 'react-native-swiftui-dsl';

function buildModalExample(isVisible: boolean, setVisible: (v: boolean) => void) {
  const $visible = createBinding(isVisible, setVisible);

  return VStack(
    Button('Show Modal', () => setVisible(true), { style: 'outlined' }),

    Modal($visible, { animationType: 'fade', transparent: true },
      VStack(
        Text('Hello from Modal!').font('title').bold(),
        Text('This is a DSL-powered modal.').secondary(),
        Button('Dismiss', () => setVisible(false), { style: 'filled' }),
      )
      .padding('lg')
      .background('card')
      .cornerRadius('lg')
      .alignment('center'),
    ).onDismiss(() => console.log('dismissed')),
  );
}
```

### Progress Indicator

Display a determinate progress bar with customizable colors:

```ts
import { VStack, Text, ProgressBar } from 'react-native-swiftui-dsl';

function buildProgressExample(progress: number) {
  return VStack(
    Text(`${Math.round(progress * 100)}% complete`).font('caption').secondary(),
    ProgressBar(progress, { trackColor: 'separator', progressColor: 'tint' })
      .cornerRadius('sm'),
  )
  .padding('md')
  .spacing(8);
}
```

### Form with Bindings

Two-way bindings make forms effortless -- no manual `value` / `onChangeText` wiring:

```ts
import { VStack, TextInput, Toggle, Button, bindForm } from 'react-native-swiftui-dsl';

function buildSettingsForm(form: FormData, setForm: Setter) {
  const $form = bindForm(form, (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  });

  return VStack(
    TextInput($form.name)
      .inputLabel('Display Name')
      .placeholder('Enter your name'),

    TextInput($form.email)
      .inputLabel('Email')
      .keyboardType('email-address')
      .autoCapitalize('none'),

    TextInput($form.bio)
      .inputLabel('Bio')
      .multiline(4)
      .maxLength(200),

    Toggle($form.notifications, { label: 'Push Notifications' }),

    Button('Save', () => handleSave(), { style: 'filled' }),
  )
  .padding('lg')
  .spacing(16);
}
```

### Data List with Pull-to-Refresh

Virtualized list with conditional empty states and infinite scroll:

```ts
import {
  SafeArea, VStack, HStack, Text, LazyList, Spacer,
  If, Spinner, Divider,
} from 'react-native-swiftui-dsl';

function buildSessionsList(sessions: Session[], isLoading: boolean) {
  return SafeArea(
    VStack(
      Text('Practice Sessions').font('header').bold(),

      If(isLoading,
        () => Spinner('large'),
        () => LazyList(sessions, {
          keyExtractor: (s) => s.id,
          renderItem: (session) =>
            HStack(
              VStack(
                Text(session.title).font('subtitle').bold(),
                Text(session.date).font('caption').secondary(),
              ),
              Spacer(),
              Text(`${session.shots} shots`).foregroundColor('tint'),
            ).padding('md'),
        })
        .separator(() => Divider())
        .refreshControl(() => reload(), false)
        .onEndReached(() => loadMore(), 0.5)
        .emptyComponent(() =>
          Text('No sessions yet. Start practicing!').secondary().textAlign('center')
        ),
      ),
    ).spacing(16),
  );
}
```

---

## API Reference: Primitives

Every primitive is a factory function that returns a chainable `ViewBuilder`.

### Layout


| Primitive     | Signature                  | Description                                           |
| ------------- | -------------------------- | ----------------------------------------------------- |
| `VStack`      | `VStack(...children)`      | Vertical stack (`flexDirection: column`)              |
| `HStack`      | `HStack(...children)`      | Horizontal stack (`flexDirection: row`)               |
| `ZStack`      | `ZStack(...children)`      | Overlay stack (children layered on top of each other) |
| `Spacer`      | `Spacer()`                 | Flexible space (`flex: 1`)                            |
| `Divider`     | `Divider()`                | Hairline separator                                    |
| `SafeArea`    | `SafeArea(...children)`    | Safe area wrapper with configurable edges             |
| `ScrollStack` | `ScrollStack(...children)` | Scrollable vertical container                         |


### Content


| Primitive     | Signature                      | Description                                                                  |
| ------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| `Text`        | `Text(string)`                 | Text display with rich styling modifiers                                     |
| `Image`       | `Image(source, options?)`      | Image with resize modes and frame control                                    |
| `Icon`        | `Icon(name, options?)`         | FontAwesome icon (falls back to text without `@expo/vector-icons`)           |
| `Spinner`     | `Spinner(size?)`               | Activity indicator (`'small'` or `'large'`)                                  |
| `ProgressBar` | `ProgressBar(value, options?)` | Determinate progress bar (0-1 range) with customizable track and fill colors |


### Input


| Primitive   | Signature                         | Description                                                |
| ----------- | --------------------------------- | ---------------------------------------------------------- |
| `TextInput` | `TextInput(binding)`              | Text field with two-way binding                            |
| `Toggle`    | `Toggle(binding, options?)`       | Boolean switch with two-way binding                        |
| `Button`    | `Button(title, action, options?)` | Pressable button -- `'filled'`, `'outlined'`, or `'plain'` |
| `Link`      | `Link(title, url)`                | Tappable link that opens a URL                             |


### Lists


| Primitive       | Signature                          | Description                                |
| --------------- | ---------------------------------- | ------------------------------------------ |
| `LazyList`      | `LazyList(data, options)`          | Virtualized list (`FlatList`)              |
| `SectionedList` | `SectionedList(sections, options)` | Sectioned virtualized list (`SectionList`) |


### Overlay


| Primitive | Signature                               | Description                                                            |
| --------- | --------------------------------------- | ---------------------------------------------------------------------- |
| `Modal`   | `Modal(binding, options?, ...children)` | Modal overlay with slide/fade animations and binding-driven visibility |


### Utility


| Primitive | Signature           | Description                             |
| --------- | ------------------- | --------------------------------------- |
| `Raw`     | `Raw(reactElement)` | Embed any React element in the DSL tree |


---

## DSL-to-React-Native Component Mapping

Every DSL primitive maps to standard React Native components at render time:


| DSL Primitive   | React Native Component           | SwiftUI Equivalent                |
| --------------- | -------------------------------- | --------------------------------- |
| `VStack`        | `View` (flexDirection: column)   | `VStack`                          |
| `HStack`        | `View` (flexDirection: row)      | `HStack`                          |
| `ZStack`        | `View` (position layering)       | `ZStack`                          |
| `Text`          | `Text`                           | `Text`                            |
| `Image`         | `Image`                          | `Image`                           |
| `Button`        | `Pressable` + `Text`             | `Button`                          |
| `TextInput`     | `TextInput`                      | `TextField`                       |
| `Toggle`        | `Switch`                         | `Toggle`                          |
| `Spacer`        | `View` (flex: 1)                 | `Spacer`                          |
| `Divider`       | `View` (hairlineWidth)           | `Divider`                         |
| `Icon`          | `FontAwesome` / `Text` fallback  | `Image(systemName:)`              |
| `Spinner`       | `ActivityIndicator`              | `ProgressView`                    |
| `ProgressBar`   | `View` (track + fill)            | `ProgressView`                    |
| `ScrollStack`   | `ScrollView`                     | `ScrollView`                      |
| `LazyList`      | `FlatList`                       | `List` / `LazyVStack`             |
| `SectionedList` | `SectionList`                    | `List` with sections              |
| `SafeArea`      | `SafeAreaView`                   | `.ignoresSafeArea()`              |
| `Modal`         | `Modal`                          | `.sheet()` / `.fullScreenCover()` |
| `Link`          | `Pressable` + `Linking.openURL`  | `Link`                            |
| `Raw`           | Passthrough (any `ReactElement`) | `UIViewRepresentable`             |


---

## API Reference: Modifiers

All modifiers are **chainable** and return the same `ViewBuilder` instance. There are 60+ modifiers organized into categories.

### Text Modifiers

```ts
Text('Hello World')
  .font('title')             // FontSizeToken | number
  .fontWeight('bold')        // FontWeightToken
  .bold()                    // shortcut for fontWeight('bold')
  .semibold()                // shortcut for fontWeight('semibold')
  .medium()                  // shortcut for fontWeight('medium')
  .light()                   // shortcut for fontWeight('light')
  .thin()                    // shortcut for fontWeight('thin')
  .heavy()                   // shortcut for fontWeight('heavy')
  .black()                   // shortcut for fontWeight('black')
  .italic()                  // fontStyle: 'italic'
  .underline()               // textDecorationLine: 'underline'
  .strikethrough()           // textDecorationLine: 'line-through'
  .fontFamily('Courier')     // custom font family
  .foregroundColor('tint')   // color token or hex value
  .secondary()               // shortcut for foregroundColor('secondaryText')
  .caption()                 // shortcut for font('caption')
  .textTransform('uppercase')
  .letterSpacing(0.5)
  .lineHeight(24)
  .lineLimit(2)
  .textAlign('center')
```

**Font weight tokens:** `regular` (400), `medium` (500), `semibold` (600), `bold` (700) are required in every theme config. The tokens `thin` (100), `ultralight` (200), `light` (300), `heavy` (800), `black` (900) are optional -- the framework provides built-in fallbacks if your theme config doesn't define them.

### Layout Modifiers

```ts
VStack(/* ... */)
  .padding('md')                      // SpacingToken | number
  .paddingHorizontal('lg')
  .paddingVertical(8)
  .paddingTop(12)
  .paddingBottom(12)
  .paddingLeft(12)
  .paddingRight(12)
  .margin('sm')
  .marginHorizontal('md')
  .marginVertical(8)
  .marginTop(4)
  .marginBottom(4)
  .marginLeft(8)
  .marginRight(8)
  .flex(1)
  .frame({ width: 100, height: 50 })
  .spacing(12)                        // gap between children
  .gap(8)                             // alias for spacing
  .justifyContent('spaceBetween')
  .alignItems('center')
  .alignment('center')                // SwiftUI-style alignment shortcut
  .flexWrap()
  .position('absolute')
  .positionEdges({ top: 0, left: 0 })
  .zIndex(10)
  .overflow('hidden')
  .aspectRatio(1.5)
  .alignSelf('center')
  .display('none')
  .hidden()                           // shortcut for display('none')
```

### Style Modifiers

```ts
VStack(/* ... */)
  .background('card')                 // color token or hex
  .backgroundAlpha('tint', 0.08)      // background with alpha channel
  .foregroundColor('error')
  .cornerRadius('md')                 // BorderRadiusToken | number
  .border(1, 'cardBorder')
  .borderStyle('dashed')              // 'solid' | 'dotted' | 'dashed'
  .shadow()                           // default subtle shadow
  .shadow({ color: 'error', radius: 4, elevation: 2 })
  .opacity(0.5)
```

### Interaction Modifiers

```ts
Text('Tap me')
  .onTap(() => handleTap())
  .onLongPress(() => handleLongPress())
  .disabled()
```

### Accessibility Modifiers

```ts
Text('Important')
  .accessibilityLabel('Important notice')
  .accessibilityRole('header')
  .accessibilityHint('Double tap to expand')
  .testID('notice-text')
```

### Scroll & List Modifiers

```ts
ScrollStack(/* ... */)
  .hideScrollIndicator()
  .contentPadding('md')
  .contentPaddingBottom(32)
  .horizontal()                       // alias for scrollDirection('horizontal')
  .keyboardAvoiding(100)
  .keyboardShouldPersistTaps('handled')
  .bounces(false)
  .refreshControl(onRefresh, isRefreshing)

LazyList(data, { keyExtractor, renderItem })
  .refreshControl(onRefresh, isRefreshing)
  .onEndReached(loadMore, 0.5)
  .separator(() => Divider())
  .numColumns(2)
  .emptyComponent(() => Text('No items'))
```

### TextInput Modifiers

```ts
TextInput(binding)
  .placeholder('Enter text...')
  .inputLabel('Email')
  .inputError('Invalid email')
  .keyboardType('email-address')
  .multiline(4)
  .secureEntry()
  .maxLength(100)
  .autoCapitalize('none')
  .returnKeyType('done')
  .inputHeight(56)
```

### Modal Modifiers

```ts
Modal(binding, { animationType: 'slide' }, ...children)
  .onDismiss(() => console.log('closed'))
```

### Screen Navigation Modifiers

```ts
VStack(/* ... */)
  .screenTitle('Profile')
  .headerRight(() => <SettingsButton />)
  .headerLeft(() => <BackButton />)
```

---

## DSL Modifier-to-RN Property Mapping

Key modifiers and the React Native style properties they resolve to:


| DSL Modifier                     | React Native Style Property                                         | Example                       |
| -------------------------------- | ------------------------------------------------------------------- | ----------------------------- |
| `.padding('md')`                 | `padding: 16`                                                       | Spacing token resolved        |
| `.paddingHorizontal('lg')`       | `paddingHorizontal: 24`                                             | Edge-specific padding         |
| `.margin('sm')`                  | `margin: 8`                                                         | Spacing token resolved        |
| `.background('card')`            | `backgroundColor: '#F2F2F7'`                                        | Color token resolved          |
| `.backgroundAlpha('tint', 0.08)` | `backgroundColor: '#007AFF14'`                                      | Hex + alpha suffix            |
| `.foregroundColor('tint')`       | `color: '#007AFF'`                                                  | Text/icon color               |
| `.cornerRadius('md')`            | `borderRadius: 8`                                                   | Border radius token           |
| `.border(1, 'separator')`        | `borderWidth: 1, borderColor: '#C6C6C8'`                            | Combined border               |
| `.borderStyle('dashed')`         | `borderStyle: 'dashed'`                                             | Direct passthrough            |
| `.shadow()`                      | `shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation` | Platform shadow               |
| `.opacity(0.5)`                  | `opacity: 0.5`                                                      | Direct passthrough            |
| `.font('title')`                 | `fontSize: 28`                                                      | Font size token resolved      |
| `.fontWeight('bold')`            | `fontWeight: '700'`                                                 | Weight token resolved         |
| `.bold()`                        | `fontWeight: '700'`                                                 | Shortcut                      |
| `.light()`                       | `fontWeight: '300'`                                                 | Fallback weight               |
| `.thin()`                        | `fontWeight: '100'`                                                 | Fallback weight               |
| `.heavy()`                       | `fontWeight: '800'`                                                 | Fallback weight               |
| `.black()`                       | `fontWeight: '900'`                                                 | Fallback weight               |
| `.italic()`                      | `fontStyle: 'italic'`                                               | Direct passthrough            |
| `.underline()`                   | `textDecorationLine: 'underline'`                                   | Direct passthrough            |
| `.strikethrough()`               | `textDecorationLine: 'line-through'`                                | Direct passthrough            |
| `.fontFamily('Courier')`         | `fontFamily: 'Courier'`                                             | Direct passthrough            |
| `.frame({ width: 100 })`         | `width: 100`                                                        | Dimension mapping             |
| `.flex(1)`                       | `flex: 1`                                                           | Direct passthrough            |
| `.spacing(12)`                   | `gap: 12`                                                           | Applied as `gap` on container |
| `.alignment('center')`           | `alignItems: 'center'`                                              | SwiftUI-style mapping         |
| `.onTap(handler)`                | Wraps in `Pressable` with `onPress`                                 | Interaction wrapper           |
| `.onLongPress(handler)`          | Wraps in `Pressable` with `onLongPress`                             | Interaction wrapper           |
| `.hidden()`                      | `display: 'none'`                                                   | Visibility toggle             |
| `.disabled()`                    | `disabled: true` on `Pressable` / `Switch`                          | Interaction state             |
| `.position('absolute')`          | `position: 'absolute'`                                              | Direct passthrough            |
| `.zIndex(10)`                    | `zIndex: 10`                                                        | Direct passthrough            |
| `.overflow('hidden')`            | `overflow: 'hidden'`                                                | Direct passthrough            |
| `.aspectRatio(1.5)`              | `aspectRatio: 1.5`                                                  | Direct passthrough            |


---

## Theme System

The DSL uses a **token-based design system**. Define your tokens once in `DSLThemeConfig`, and every modifier resolves them automatically -- including light/dark mode switching.

### Color Tokens

Any color modifier (`.background()`, `.foregroundColor()`, `.border()`) accepts either:

- A **token name** from your config: `'tint'`, `'card'`, `'error'`, `'secondaryText'`
- A **raw value**: `'#FF0000'`, `'rgba(0,0,0,0.5)'`

Tokens resolve to the correct value based on the current `colorScheme` -- no manual `useColorScheme()` checks needed.

### DSLColorConfig Union Type

The `colors` field of `DSLThemeConfig` accepts a `DSLColorConfig` union:

```ts
type DSLColorConfig =
  | { light: DSLColors; dark: DSLColors }  // Dual-scheme: separate palettes
  | DSLColors;                              // Single-scheme: same for both modes
```

When you pass a flat `DSLColors` object, the framework's `normalizeColors()` function mirrors it to both `light` and `dark` automatically.

### Spacing Tokens

Padding and margin modifiers accept: `'xs'` (4), `'sm'` (8), `'md'` (16), `'lg'` (24), `'xl'` (32) -- or raw numbers.

### Font Size Tokens

All available font size tokens:


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


### Font Weight Tokens


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

### Accessing Theme in Custom Components

```tsx
import { useDSLTheme } from 'react-native-swiftui-dsl';

function CustomComponent() {
  const { config, colorScheme } = useDSLTheme();
  const bgColor = config.colors[colorScheme].card;
  // Use bgColor in your custom View...
}
```

If no `DSLThemeProvider` is present, `useDSLTheme()` returns `defaultThemeConfig` with `colorScheme: 'light'` instead of throwing.

---

## Bindings

Inspired by SwiftUI's `$` binding syntax for two-way data flow.

### `createBinding<T>(value, update)`

Creates a single binding for one value:

```ts
const [name, setName] = useState('');
const $name = createBinding(name, setName);

TextInput($name).placeholder('Your name')
```

### `bindForm<T>(data, setter)`

Creates bindings for **all fields** of a form object at once using a Proxy:

```ts
const [form, setForm] = useState({ title: '', notes: '', rating: 0 });

const $form = bindForm(form, (key, value) => {
  setForm((prev) => ({ ...prev, [key]: value }));
});

VStack(
  TextInput($form.title).inputLabel('Title'),
  TextInput($form.notes).inputLabel('Notes').multiline(4),
)
```

Bindings are **cached** -- accessing the same field returns the same `Binding` instance unless the value changes.

---

## Conditionals

### `If(condition, thenBuilder, elseBuilder?)`

```ts
VStack(
  If(isLoggedIn,
    () => Text('Welcome back!'),
    () => Button('Log In', login),
  ),
)
```

### `ForEach(data, keyExtractor, builder)`

```ts
VStack(
  ...ForEach(users, (u) => u.id, (user) =>
    HStack(
      Text(user.name).bold(),
      Spacer(),
      Text(user.role).secondary(),
    )
  ),
)
```

### `Group(...children)`

Groups children without adding a wrapper view (renders as `React.Fragment`):

```ts
Group(
  Text('First'),
  Text('Second'),
)
```

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
const element = VStack(Text('Hello')).padding('md').toElement();
return element;

// Option 2: DSLRenderer component
return <DSLRenderer builder={myBuilder} />;
```

---

## Navigation

For projects using `expo-router`, the framework includes `ScreenConfigRenderer` to configure navigation headers:

```tsx
import { ScreenConfigRenderer } from 'react-native-swiftui-dsl/src/Navigation/ScreenConfigRenderer';

function ProfileScreen() {
  return (
    <ScreenConfigRenderer options={{ title: 'Profile', headerShown: true }}>
      <DSLRenderer builder={buildProfileScreen()} />
    </ScreenConfigRenderer>
  );
}
```

> **Note:** `expo-router` is optional. If it is not installed, screen navigation modifiers (`.screenTitle()`, `.headerRight()`, `.headerLeft()`) are silently ignored -- they will not throw errors.

---

## Testing

The framework works in tests with no special setup, thanks to config-free defaults:

```tsx
import { render } from '@testing-library/react-native';
import { Text } from 'react-native-swiftui-dsl';

it('renders styled text', () => {
  const { getByText } = render(
    Text('Hello').font('title').bold().toElement()
  );
  expect(getByText('Hello')).toBeTruthy();
});
```

For tests that need a specific theme or dark mode, wrap with `DSLThemeProvider`:

```tsx
import { render } from '@testing-library/react-native';
import { DSLThemeProvider } from 'react-native-swiftui-dsl';

export function renderWithDSLTheme(
  ui: React.ReactElement,
  colorScheme: 'light' | 'dark' = 'light',
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <DSLThemeProvider config={yourThemeConfig} colorScheme={colorScheme}>
        {children}
      </DSLThemeProvider>
    ),
  });
}
```

---

## Architecture & Documentation

```
src/
├── Binding/         # Two-way binding system (createBinding, bindForm)
├── Conditionals/    # If, ForEach, Group
├── Config/          # DSLDefaults, defaultThemeConfig
├── Core/            # ViewBuilder, DSLRenderer, Modifier types, ThemeResolver
├── Navigation/      # expo-router ScreenConfigRenderer
├── Primitives/      # 20 primitive factory functions
├── Theme/           # DSLThemeProvider, DSLThemeContext, type definitions
└── index.ts         # Public API — single entry point
```

### Subfolder Documentation

Each module has its own README with in-depth documentation:


| Module           | Path                                                       | Description                                                                               |
| ---------------- | ---------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Binding**      | `[src/Binding/README.md](src/Binding/README.md)`           | Two-way bindings: `createBinding`, `bindForm`, Proxy-based field access, caching          |
| **Conditionals** | `[src/Conditionals/README.md](src/Conditionals/README.md)` | Declarative control flow: `If`, `ForEach`, `Group`                                        |
| **Config**       | `[src/Config/README.md](src/Config/README.md)`             | Centralized defaults, `DSLDefaults`, `defaultThemeConfig`                                 |
| **Core**         | `[src/Core/README.md](src/Core/README.md)`                 | Core rendering engine: `ViewBuilder`, `DSLRenderer`, modifier resolution, `ThemeResolver` |
| **Navigation**   | `[src/Navigation/README.md](src/Navigation/README.md)`     | Screen navigation: `ScreenConfigRenderer`, expo-router integration                        |
| **Primitives**   | `[src/Primitives/README.md](src/Primitives/README.md)`     | All 20 UI component primitives with signatures and examples                               |
| **Theme**        | `[src/Theme/README.md](src/Theme/README.md)`               | Theming system: `DSLThemeProvider`, `DSLColorConfig`, token types                         |


---

## Platform Support


| Platform | Status                           |
| -------- | -------------------------------- |
| iOS      | Fully supported                  |
| Android  | Fully supported                  |
| Web      | Partial (via `react-native-web`) |


---

## Contributing

Contributions are welcome! Feel free to open issues for bug reports, feature requests, or questions.

---

## License

[MIT](./LICENSE)