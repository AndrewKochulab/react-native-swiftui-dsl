# Tokens

Type-safe enum constants that eliminate raw strings throughout the framework. Every design token, element type, modifier type, interaction constant, and style value is defined here as a TypeScript enum. Import and use these enums in all code examples and application code instead of raw string literals.

## Files

| File | Purpose |
|------|---------|
| `Color.ts` | `Color` enum -- theme color token constants |
| `Font.ts` | `Font` enum (sizes), `Weight` enum (weights) |
| `Layout.ts` | `Spacing` enum, `Radius` enum, `Edge` enum, breakpoint types |
| `Style.ts` | `TextAlign`, `TextTransform`, `FontStyle`, `BorderStyle`, `Position`, `Overflow`, `Display`, `FlexWrap`, `FlexDirection`, `JustifyContent`, `AlignItems`, `AlignSelf`, `Alignment` enums |
| `Animation.ts` | `Easing`, `AnimationType`, `Transition`, `TransitionEdge` enums |
| `Component.ts` | `ButtonVariant`, `SpinnerSize`, `ModalAnimation`, `ImageResize`, `AutoCapitalize`, `KeyboardBehavior`, `KeyboardPersistTaps`, `ScrollDirection`, `AccessibilityRole` enums |
| `Interaction.ts` | `SwipeDirection`, `SizeClass`, `Orientation`, `ColorScheme`, `DSLPlatform` enums |
| `ElementType.ts` | `ElementType`, `GestureType`, `ModifierType` enums |
| `RNStyle.ts` | `RNAlign`, `RNDisplay`, `RNColor`, `RNTransform`, `RNTextAlignVertical`, `RNPointerEvents`, `ApplyEdgePrefix`, `RNKey` enums |
| `TypeGuards.ts` | `JSType` enum, type guard functions (`isNumber`, `isString`, `isBoolean`, `isObject`, `isNil`), `ColorSchemeField` enum |

## API Reference

### `Color` (`Color.ts`)

Theme color token constants. Used with `.foregroundColor()`, `.background()`, `.border()`, and any modifier that accepts a `ColorValue`.

```ts
enum Color {
  text = 'text',
  background = 'background',
  tint = 'tint',
  card = 'card',
  secondaryText = 'secondaryText',
  separator = 'separator',
  error = 'error',
  success = 'success',
  warning = 'warning',
  inputBackground = 'inputBackground',
  buttonText = 'buttonText',
  cardShadow = 'cardShadow',
}
```

**Example:**

```ts
import { Color } from '@/Tokens/Color';

Text('Error message').foregroundColor(Color.error)
VStack(child).background(Color.card)
VStack(child).border(1, Color.separator)
VStack(child).backgroundAlpha(Color.tint, 0.1)
```

---

### `Font` and `Weight` (`Font.ts`)

Font size and weight token constants.

```ts
enum Font {
  micro = 'micro',     // 10pt
  small = 'small',     // 11pt
  caption = 'caption', // 12pt
  footnote = 'footnote', // 13pt
  body = 'body',       // 17pt
  subtitle = 'subtitle', // 20pt
  title2 = 'title2',   // 22pt
  title = 'title',     // 28pt
  header = 'header',   // 34pt
  hero = 'hero',       // 40pt
}

enum Weight {
  regular = 'regular',     // 400
  medium = 'medium',       // 500
  semibold = 'semibold',   // 600
  bold = 'bold',           // 700
  thin = 'thin',           // optional
  ultralight = 'ultralight', // optional
  light = 'light',         // optional
  heavy = 'heavy',         // optional
  black = 'black',         // optional
}
```

**Example:**

```ts
import { Font, Weight } from '@/Tokens/Font';

Text('Title').font(Font.title).fontWeight(Weight.bold)
Text('Caption').font(Font.caption).fontWeight(Weight.medium)
Text('Hero').font(Font.hero)
```

---

### `Spacing`, `Radius`, and `Edge` (`Layout.ts`)

Layout token constants for spacing, border radius, and padding/margin edges.

```ts
enum Spacing {
  xs = 'xs',   // 4pt
  sm = 'sm',   // 8pt
  md = 'md',   // 16pt
  lg = 'lg',   // 24pt
  xl = 'xl',   // 32pt
}

enum Radius {
  sm = 'sm',   // 4pt
  md = 'md',   // 8pt
  lg = 'lg',   // 16pt
}

enum Edge {
  all = 'all',
  horizontal = 'horizontal',
  vertical = 'vertical',
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right',
}
```

**Example:**

```ts
import { Spacing, Radius, Edge } from '@/Tokens/Layout';

VStack(child).padding(Spacing.lg)
VStack(child).padding(Spacing.sm, Edge.horizontal)
VStack(child).cornerRadius(Radius.md)
VStack(child).margin(Spacing.lg, Edge.vertical)
```

Also exports breakpoint types:

```ts
interface BreakpointRange { min: number; max: number; }
interface BreakpointDefinition { compact: BreakpointRange; regular: BreakpointRange; large: BreakpointRange; }
interface CustomBreakpoint { name: string; minWidth: number; maxWidth: number; }
```

---

### Style Enums (`Style.ts`)

Style-related token constants for text, layout, and visual properties.

#### `TextAlign`

```ts
import { TextAlign } from '@/Tokens/Style';

Text('Centered').textAlign(TextAlign.center)
Text('Right-aligned').textAlign(TextAlign.right)
```

#### `TextTransform`

```ts
import { TextTransform } from '@/Tokens/Style';

Text('uppercase').textTransform(TextTransform.uppercase)
Text('capitalize').textTransform(TextTransform.capitalize)
```

#### `FontStyle`

```ts
import { FontStyle } from '@/Tokens/Style';

Text('Italic').fontStyle(FontStyle.italic)
```

#### `BorderStyle`

```ts
import { BorderStyle } from '@/Tokens/Style';

VStack(child).border(1, Color.separator).borderStyle(BorderStyle.dashed)
```

#### `Position`

```ts
import { Position } from '@/Tokens/Style';

VStack(child).position(Position.absolute).positionEdges({ top: 0, right: 0 })
```

#### `Overflow`

```ts
import { Overflow } from '@/Tokens/Style';

VStack(child).overflow(Overflow.hidden)
```

#### `Display`

```ts
import { Display } from '@/Tokens/Style';

VStack(child).display(Display.none) // equivalent to .hidden(true)
```

#### `FlexWrap` and `FlexDirection`

```ts
import { FlexWrap } from '@/Tokens/Style';

HStack(child1, child2, child3).flexWrap(FlexWrap.wrap)
```

#### `JustifyContent` and `AlignItems`

```ts
import { JustifyContent, AlignItems } from '@/Tokens/Style';

HStack(child1, child2)
  .justifyContent(JustifyContent.spaceBetween)
  .alignItems(AlignItems.center)
```

#### `AlignSelf`

```ts
import { AlignSelf } from '@/Tokens/Style';

Text('Centered').alignSelf(AlignSelf.center)
```

#### `Alignment`

```ts
import { Alignment } from '@/Tokens/Style';

VStack(child).alignment(Alignment.center)
VStack(child).frame({ width: 200, alignment: Alignment.leading })
```

---

### Animation Enums (`Animation.ts`)

```ts
enum Easing { linear, easeIn, easeOut, easeInOut, spring }
enum AnimationType { timing, spring }
enum Transition { opacity, slide, scale, move }
enum TransitionEdge { top, bottom, leading, trailing }
```

**Example:**

```ts
import { Transition, TransitionEdge } from '@/Tokens/Animation';

VStack(child).transition({
  effect: Transition.slide,
  edge: TransitionEdge.bottom,
})
```

---

### Component Enums (`Component.ts`)

Component-specific token constants.

```ts
enum ButtonVariant { filled, outlined, plain }
enum SpinnerSize { small, large }
enum ModalAnimation { none, slide, fade }
enum ImageResize { cover, contain, stretch, center }
enum AutoCapitalize { none, sentences, words, characters }
enum KeyboardBehavior { padding, height, position }
enum KeyboardPersistTaps { always, never, handled }
enum ScrollDirection { horizontal, vertical }
enum AccessibilityRole { button, link, progressbar, image, text, none }
```

**Example:**

```ts
import { ButtonVariant, ModalAnimation, ImageResize, AutoCapitalize, SpinnerSize } from '@/Tokens/Component';

Button('Save', save, { style: ButtonVariant.filled })
Button('Cancel', cancel, { style: ButtonVariant.plain })
Modal(binding, { animationType: ModalAnimation.fade })
Image(source, { resizeMode: ImageResize.contain })
TextInput(binding).autoCapitalize(AutoCapitalize.none)
Spinner(SpinnerSize.large)
```

---

### Interaction Enums (`Interaction.ts`)

Interaction and platform token constants.

```ts
enum SwipeDirection { left, right, up, down }
enum SizeClass { compact, regular, large }
enum Orientation { portrait, landscape }
enum ColorScheme { light, dark }
enum DSLPlatform { ios, android }
```

**Example:**

```ts
import { SwipeDirection } from '@/Tokens/Interaction';
import { SizeClass } from '@/Tokens/Interaction';

VStack(child).onSwipe(SwipeDirection.left, () => handleDelete())

// In responsive hooks:
if (sizeClass === SizeClass.compact) { /* phone layout */ }
```

---

### Element and Modifier Types (`ElementType.ts`)

Internal type discriminants used by `ViewBuilder` and `DSLRenderer`.

```ts
enum ElementType { text, vstack, hstack, zstack, icon, spacer, raw, fragment, safearea, scroll, textinput, spinner, lazylist, image, toggle, button, divider, link, sectionlist, modal, progressbar }
enum GestureType { swipe, pan, pinch, rotation }
enum ModifierType { padding, margin, background, /* ... 60+ variants */ }
```

These are primarily for internal use. Application code rarely needs to reference them directly.

---

### React Native Style Constants (`RNStyle.ts`)

Low-level React Native style constants used internally by the renderer.

```ts
enum RNAlign { center, flexStart, flexEnd, stretch, baseline, spaceBetween, spaceAround, spaceEvenly, auto }
enum RNDisplay { none, flex }
enum RNColor { transparent, inherit }
enum RNTransform { translateX, translateY }
enum RNTextAlignVertical { top, center, bottom, auto }
enum RNPointerEvents { boxNone, none, boxOnly, auto }
enum ApplyEdgePrefix { padding, margin }
enum RNKey { icon, text, label, input, error }
```

These are primarily for internal use by the renderer.

---

### Type Guards (`TypeGuards.ts`)

Utility type guard functions and constants that eliminate raw `typeof` checks throughout the framework.

```ts
enum JSType { string, number, boolean, object, function, symbol, undefined }

function isNumber(value: unknown): value is number
function isString(value: unknown): value is string
function isBoolean(value: unknown): value is boolean
function isSymbol(value: unknown): value is symbol
function isObject(value: unknown): value is Record<string, unknown>
function isNil(value: unknown): value is null | undefined
function toString(value: unknown): string
```

**Example:**

```ts
import { isString, isNumber } from '@/Tokens/TypeGuards';

if (isString(value)) {
  // value is typed as string
}

if (isNumber(spacing)) {
  // use raw pixel value
}
```
