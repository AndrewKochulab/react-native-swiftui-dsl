# API Reference: Primitives

Every primitive is a factory function that returns a chainable `ViewBuilder`. The DSL provides **21 built-in primitives** that map to standard React Native components at render time.

[<-- Back to README](../README.md)

> For implementation details, see [src/Primitives/README.md](../src/Primitives/README.md)
> See [examples/01-basic-usage.tsx](../examples/01-basic-usage.tsx)

---

## Layout

| Primitive     | Signature                  | Description                                           |
| ------------- | -------------------------- | ----------------------------------------------------- |
| `VStack`      | `VStack(...children)`      | Vertical stack (`flexDirection: column`)              |
| `HStack`      | `HStack(...children)`      | Horizontal stack (`flexDirection: row`)               |
| `ZStack`      | `ZStack(...children)`      | Overlay stack (children layered on top of each other) |
| `Spacer`      | `Spacer()`                 | Flexible space (`flex: 1`)                            |
| `Divider`     | `Divider()`                | Hairline separator                                    |
| `SafeArea`    | `SafeArea(...children)`    | Safe area wrapper with configurable edges             |
| `ScrollStack` | `ScrollStack(...children)` | Scrollable vertical container                         |

## Content

| Primitive     | Signature                      | Description                                                                  |
| ------------- | ------------------------------ | ---------------------------------------------------------------------------- |
| `Text`        | `Text(string)`                 | Text display with rich styling modifiers                                     |
| `Image`       | `Image(source, options?)`      | Image with resize modes and frame control                                    |
| `Icon`        | `Icon(name, options?)`         | FontAwesome icon (falls back to text without `@expo/vector-icons`)           |
| `Spinner`     | `Spinner(size?)`               | Activity indicator (`'small'` or `'large'`)                                  |
| `ProgressBar` | `ProgressBar(value, options?)` | Determinate progress bar (0-1 range) with customizable track and fill colors |

## Input

| Primitive   | Signature                         | Description                                                |
| ----------- | --------------------------------- | ---------------------------------------------------------- |
| `TextInput` | `TextInput(binding)`              | Text field with two-way binding                            |
| `Toggle`    | `Toggle(binding, options?)`       | Boolean switch with two-way binding                        |
| `Button`    | `Button(title, action, options?)` | Pressable button -- `ButtonVariant.filled`, `ButtonVariant.outlined`, or `ButtonVariant.plain` |
| `Link`      | `Link(title, url)`                | Tappable link that opens a URL                             |

## Lists

| Primitive       | Signature                          | Description                                |
| --------------- | ---------------------------------- | ------------------------------------------ |
| `LazyList`      | `LazyList(data, options)`          | Virtualized list (`FlatList`)              |
| `SectionedList` | `SectionedList(sections, options)` | Sectioned virtualized list (`SectionList`) |

## Overlay

| Primitive | Signature                               | Description                                                            |
| --------- | --------------------------------------- | ---------------------------------------------------------------------- |
| `Modal`   | `Modal(binding, options?, ...children)` | Modal overlay with slide/fade animations and binding-driven visibility |

## Navigation

| Primitive | Signature                    | Description                                               |
| --------- | ---------------------------- | --------------------------------------------------------- |
| `TabView` | `TabView(...tabs)`           | Bottom tab bar container with configurable animations     |
| `Tab`     | `Tab(options, content)`      | Tab item factory — icon, title, badge, or custom renderer |

> See the dedicated [TabView documentation](./tab-view.md) for full API reference.

## Utility

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
| `TabView`       | Custom `View` (tab bar + content)| `TabView`                         |
| `Raw`           | Passthrough (any `ReactElement`) | `UIViewRepresentable`             |
