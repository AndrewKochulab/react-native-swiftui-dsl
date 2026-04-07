# TabView

A bottom tab bar navigation primitive inspired by SwiftUI's `TabView`. Supports icons, titles, badges, custom tab items, and configurable animations.

[<-- Back to README](../README.md)

> For implementation details, see [src/Primitives/TabView.ts](../src/Primitives/TabView.ts)
> See [examples/08-tab-view.tsx](../examples/08-tab-view.tsx)

---

## Basic Usage

```ts
import {
  TabView, Tab, Text, VStack,
  TabBarAnimation, Color, Font, Spacing,
} from 'react-native-swiftui-dsl';

TabView(
  Tab({ title: 'Home', icon: 'home' }, buildHomeScreen()),
  Tab({ title: 'Search', icon: 'search' }, buildSearchScreen()),
  Tab({ title: 'Profile', icon: 'user' }, buildProfileScreen()),
)
  .tabBarTintColor(Color.tint)
  .tabBarAnimation(TabBarAnimation.spring)
```

---

## Tab Items

Each tab is created with the `Tab(options, content)` factory. There are three ways to configure a tab:

### Icon + Title

```ts
Tab({ title: 'Home', icon: 'home' }, HomeScreen())
```

### Icon Only

```ts
Tab({ icon: 'home' }, HomeScreen())
```

### Title Only

```ts
Tab({ title: 'Home' }, HomeScreen())
```

### With Badge

```ts
Tab({ title: 'Inbox', icon: 'envelope', badge: '5' }, InboxScreen())
```

### Per-Tab Icon Customization

```ts
Tab({
  title: 'Settings',
  icon: 'cog-outline',
  activeIcon: 'cog',
  iconSize: 26,
  iconColor: Color.secondaryText,
  activeIconColor: Color.tint,
}, SettingsScreen())
```

### Custom Tab Bar Item

Full control over the tab bar item rendering:

```ts
Tab({
  customItem: (isActive) =>
    VStack(
      Icon(isActive ? 'home' : 'home-outline')
        .foregroundColor(isActive ? Color.tint : Color.secondaryText),
      Text('Home').font(Font.micro),
    ),
}, HomeScreen())
```

---

## Tab Options Reference

| Property          | Type                              | Description                                |
| ----------------- | --------------------------------- | ------------------------------------------ |
| `title`           | `string`                          | Tab bar label text                         |
| `icon`            | `string`                          | Icon name (FontAwesome)                    |
| `activeIcon`      | `string`                          | Alternate icon when tab is active          |
| `iconSize`        | `number`                          | Override default icon size for this tab    |
| `iconColor`       | `ColorValue`                      | Inactive icon color for this tab           |
| `activeIconColor` | `ColorValue`                      | Active icon color for this tab             |
| `badge`           | `string`                          | Badge text displayed on the tab            |
| `testID`          | `string`                          | Test identifier                            |
| `customItem`      | `(isActive: boolean) => ViewBuilder` | Custom render function for the tab item |

> At least one of `title`, `icon`, or `customItem` must be provided.

---

## Tab Bar Modifiers

All modifiers are chainable on the `TabView` result:

```ts
TabView(/* tabs */)
  .tabBarTintColor(Color.tint)                 // Active item color
  .tabBarInactiveTintColor(Color.secondaryText) // Inactive item color
  .tabBarBackgroundColor(Color.card)            // Bar background
  .tabBarBorderColor(Color.separator)           // Bar top border color
  .tabBarAnimation(TabBarAnimation.spring)      // Animation preset
  .tabBarLabelFontSize(Font.small)              // Label font size
  .tabBarLabelFontWeight('semibold')            // Label font weight
  .tabBarIconSize(24)                           // Default icon size
  .tabBarHeight(84)                             // Bar height in points
```

| Modifier                       | Type                         | Description               |
| ------------------------------ | ---------------------------- | ------------------------- |
| `.tabBarTintColor(color)`      | `ColorValue`                 | Active tab item color     |
| `.tabBarInactiveTintColor(color)` | `ColorValue`              | Inactive tab item color   |
| `.tabBarBackgroundColor(color)` | `ColorValue`                | Tab bar background        |
| `.tabBarBorderColor(color)`    | `ColorValue`                 | Top border color          |
| `.tabBarAnimation(config)`     | `TabBarAnimationConfig`      | Animation preset or custom |
| `.tabBarLabelFontSize(size)`   | `FontSizeToken \| number`    | Label font size           |
| `.tabBarLabelFontWeight(weight)` | `FontWeightToken`          | Label font weight         |
| `.tabBarIconSize(size)`        | `number`                     | Default icon size         |
| `.tabBarHeight(height)`        | `number`                     | Bar height in points      |

---

## Animations

### Preset Animations

The `TabBarAnimation` enum provides four built-in animation presets:

| Preset                    | Description                           |
| ------------------------- | ------------------------------------- |
| `TabBarAnimation.spring`  | Spring physics with bounce (scale 1.15, 300ms) |
| `TabBarAnimation.scale`   | Simple scale effect (scale 1.12, 200ms) |
| `TabBarAnimation.fade`    | Opacity transition (inactive at 0.4 opacity) |
| `TabBarAnimation.none`    | No animation (default)                |

```ts
TabView(/* tabs */)
  .tabBarAnimation(TabBarAnimation.spring)
```

### Custom Animation

Pass a `TabBarCustomAnimation` object for full control:

```ts
TabView(/* tabs */)
  .tabBarAnimation({
    scale: 1.2,
    duration: 200,
    useSpring: true,
    damping: 8,
    stiffness: 150,
    inactiveOpacity: 0.6,
  })
```

| Property          | Type      | Description                                 |
| ----------------- | --------- | ------------------------------------------- |
| `scale`           | `number`  | Scale multiplier during active transition   |
| `duration`        | `number`  | Duration in milliseconds                    |
| `useSpring`       | `boolean` | Whether to use spring physics               |
| `damping`         | `number`  | Spring damping (lower = more bouncy)        |
| `stiffness`       | `number`  | Spring stiffness                            |
| `inactiveOpacity` | `number`  | Opacity for inactive items (0-1)            |

---

## Defaults

The framework provides sensible defaults via `DSLDefaults.tabView`:

| Property           | Default Value |
| ------------------ | ------------- |
| `iconSize`         | 22            |
| `labelFontSize`    | `Font.small`  |
| `labelFontWeight`  | `'semibold'`  |
| `barHeight`        | 84            |
| `barBorderWidth`   | 0.5           |
| `animation`        | `'none'`      |

Badge defaults are also preconfigured (border radius, min width, height, font size, etc.).

---

## DSL-to-React-Native Mapping

| DSL                      | React Native                              | SwiftUI Equivalent |
| ------------------------ | ----------------------------------------- | ------------------ |
| `TabView(...tabs)`       | Custom `View` with tab bar and content    | `TabView`          |
| `Tab(options, content)`  | Tab item configuration object             | `.tabItem {}`      |
| `.tabBarTintColor()`     | Active tint color on bar items            | `.accentColor()`   |
| `.tabBarAnimation()`     | Animated tab transitions                  | `.animation()`     |
