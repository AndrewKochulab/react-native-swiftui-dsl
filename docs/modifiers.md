# API Reference: Modifiers

All modifiers are **chainable** and return the same `ViewBuilder` instance. There are **70+ modifiers** organized into categories.

[<-- Back to README](../README.md)

> For implementation details, see [src/Core/README.md](../src/Core/README.md)
> See [examples/02-view-modifiers.tsx](../examples/02-view-modifiers.tsx)

---

## Text Modifiers

```ts
Text('Hello World')
  .font(Font.title)          // FontSizeToken | number
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
  .foregroundColor(Color.tint)   // color token or hex value
  .secondary()               // shortcut for foregroundColor(Color.secondaryText)
  .caption()                 // shortcut for font(Font.caption)
  .textTransform('uppercase')
  .letterSpacing(0.5)
  .lineHeight(24)
  .lineLimit(2)
  .textAlign(TextAlign.center)
```

**Font weight tokens:** `regular` (400), `medium` (500), `semibold` (600), `bold` (700) are required in every theme config. The tokens `thin` (100), `ultralight` (200), `light` (300), `heavy` (800), `black` (900) are optional -- the framework provides built-in fallbacks if your theme config doesn't define them.

## Layout Modifiers

```ts
VStack(/* ... */)
  .padding(Spacing.md)                // SpacingToken | number
  .paddingHorizontal(Spacing.lg)
  .paddingVertical(8)
  .paddingTop(12)
  .paddingBottom(12)
  .paddingLeft(12)
  .paddingRight(12)
  .margin(Spacing.sm)
  .marginHorizontal(Spacing.md)
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
  .alignment(Alignment.center)        // SwiftUI-style alignment shortcut
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

## Style Modifiers

```ts
VStack(/* ... */)
  .background(Color.card)             // color token or hex
  .backgroundAlpha('tint', 0.08)      // background with alpha channel
  .foregroundColor(Color.error)
  .cornerRadius(Radius.md)            // BorderRadiusToken | number
  .border(1, 'cardBorder')
  .borderStyle('dashed')              // 'solid' | 'dotted' | 'dashed'
  .shadow()                           // default subtle shadow
  .shadow({ color: 'error', radius: 4, elevation: 2 })
  .opacity(0.5)
```

## Interaction Modifiers

```ts
Text('Tap me')
  .onTap(() => handleTap())
  .onLongPress(() => handleLongPress())
  .disabled()
```

## Accessibility Modifiers

```ts
Text('Important')
  .accessibilityLabel('Important notice')
  .accessibilityRole('header')
  .accessibilityHint('Double tap to expand')
  .testID('notice-text')
```

## Scroll & List Modifiers

```ts
ScrollStack(/* ... */)
  .hideScrollIndicator()
  .contentPadding(Spacing.md)
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

## TextInput Modifiers

```ts
TextInput(binding)
  .placeholder('Enter text...')
  .inputLabel('Email')
  .inputError('Invalid email')
  .keyboardType('email-address')
  .multiline(4)
  .secureEntry()
  .maxLength(100)
  .autoCapitalize(AutoCapitalize.none)
  .returnKeyType('done')
  .inputHeight(56)
```

## Modal Modifiers

```ts
Modal(binding, { animationType: 'slide' }, ...children)
  .onDismiss(() => console.log('closed'))
```

## Tab Bar Modifiers

```ts
TabView(/* tabs */)
  .tabBarTintColor(Color.tint)                  // active item color
  .tabBarInactiveTintColor(Color.secondaryText)  // inactive item color
  .tabBarBackgroundColor(Color.card)             // bar background
  .tabBarBorderColor(Color.separator)            // bar top border
  .tabBarAnimation(TabBarAnimation.spring)       // animation preset or custom config
  .tabBarLabelFontSize(Font.small)               // label font size
  .tabBarLabelFontWeight('semibold')             // label font weight
  .tabBarIconSize(24)                            // default icon size
  .tabBarHeight(84)                              // bar height in points
```

> See the dedicated [TabView documentation](./tab-view.md) for animation presets, custom animations, and tab item configuration.

## Screen Navigation Modifiers

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
| `.padding(Spacing.md)`           | `padding: 16`                                                       | Spacing token resolved        |
| `.paddingHorizontal(Spacing.lg)` | `paddingHorizontal: 24`                                             | Edge-specific padding         |
| `.margin(Spacing.sm)`            | `margin: 8`                                                         | Spacing token resolved        |
| `.background(Color.card)`        | `backgroundColor: '#F2F2F7'`                                        | Color token resolved          |
| `.backgroundAlpha('tint', 0.08)` | `backgroundColor: '#007AFF14'`                                      | Hex + alpha suffix            |
| `.foregroundColor(Color.tint)`   | `color: '#007AFF'`                                                  | Text/icon color               |
| `.cornerRadius(Radius.md)`       | `borderRadius: 8`                                                   | Border radius token           |
| `.border(1, 'separator')`        | `borderWidth: 1, borderColor: '#C6C6C8'`                            | Combined border               |
| `.borderStyle('dashed')`         | `borderStyle: 'dashed'`                                             | Direct passthrough            |
| `.shadow()`                      | `shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation` | Platform shadow               |
| `.opacity(0.5)`                  | `opacity: 0.5`                                                      | Direct passthrough            |
| `.font(Font.title)`              | `fontSize: 28`                                                      | Font size token resolved      |
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
| `.alignment(Alignment.center)`   | `alignItems: 'center'`                                              | SwiftUI-style mapping         |
| `.onTap(handler)`                | Wraps in `Pressable` with `onPress`                                 | Interaction wrapper           |
| `.onLongPress(handler)`          | Wraps in `Pressable` with `onLongPress`                             | Interaction wrapper           |
| `.hidden()`                      | `display: 'none'`                                                   | Visibility toggle             |
| `.disabled()`                    | `disabled: true` on `Pressable` / `Switch`                          | Interaction state             |
| `.position('absolute')`          | `position: 'absolute'`                                              | Direct passthrough            |
| `.zIndex(10)`                    | `zIndex: 10`                                                        | Direct passthrough            |
| `.overflow('hidden')`            | `overflow: 'hidden'`                                                | Direct passthrough            |
| `.aspectRatio(1.5)`              | `aspectRatio: 1.5`                                                  | Direct passthrough            |
| `.tabBarTintColor(Color.tint)`   | Active tab item color                                                | Tab bar styling               |
| `.tabBarAnimation('spring')`     | Tab bar item transition animation                                    | Animation preset or custom    |
| `.tabBarHeight(84)`              | Tab bar height in points                                             | Layout dimension              |
