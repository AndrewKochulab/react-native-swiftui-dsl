# Core

The engine of the DSL framework. Contains the builder class that exposes 60+ chainable modifiers, the React rendering engine that materializes builders into native components, the modifier type definitions, the theme-aware color resolver, the abstract view and modifier base classes, and the environment value system.

## Files

| File | Purpose |
|------|---------|
| `ViewBuilder.ts` | `ViewBuilder` class, `DSLElementType`, `DSLElementProps`, `DSLChild`, `isViewBuilder()` |
| `DSLRenderer.tsx` | React component that converts a `ViewBuilder` tree into React Native elements |
| `Modifier.ts` | `Modifier` discriminated union type, `PaddingEdge`, token resolution helpers |
| `ThemeResolver.ts` | `ColorValue` type, `resolveColor()`, `isColorToken()`, `normalizeColors()` |
| `DSLView.ts` | Abstract base class for reusable view components |
| `ViewModifier.ts` | Abstract base class for reusable view modifiers and `composeModifiers()` |
| `Environment.ts` | Environment values context and `useEnvironment()` hook |
| `ModifierSheet.ts` | Modifier sheet utilities |

## API Reference

### `ViewBuilder`

The central class of the DSL. Every primitive function (e.g., `Text()`, `VStack()`) returns a `ViewBuilder`. Modifiers are chained fluently and accumulated internally. Call `.toElement()` to produce a `React.ReactElement`.

```ts
class ViewBuilder {
  readonly elementType: DSLElementType;
  readonly props: DSLElementProps;
  readonly children: DSLChild[];
  readonly modifiers: Modifier[];

  // Materialize into a React element
  toElement(key?: string | number): React.ReactElement;
}
```

#### Modifier Categories

**Padding** -- `.padding()`, `.paddingHorizontal()`, `.paddingVertical()`, `.paddingTop()`, `.paddingBottom()`, `.paddingLeft()`, `.paddingRight()`

```ts
import { Spacing, Edge } from '@/Tokens/Layout';

Text('Hello').padding()                         // all edges, default Spacing.md token
Text('Hello').padding(20)                       // all edges, 20pt
Text('Hello').padding(Spacing.lg, Edge.horizontal) // horizontal, Spacing.lg token
Text('Hello').paddingTop(Spacing.sm)            // top edge, Spacing.sm token
```

**Margin** -- `.margin()`, `.marginHorizontal()`, `.marginVertical()`, `.marginTop()`, `.marginBottom()`, `.marginLeft()`, `.marginRight()`

```ts
import { Spacing } from '@/Tokens/Layout';

Text('Hello').margin(Spacing.md).marginBottom(8)
```

**Layout** -- `.flex()`, `.frame()`, `.spacing()`, `.gap()`, `.justifyContent()`, `.alignItems()`, `.alignment()`, `.flexWrap()`

```ts
import { Alignment } from '@/Tokens/Style';
import { JustifyContent, AlignItems, FlexWrap } from '@/Tokens/Style';

VStack(child1, child2).flex().spacing(12)
HStack(child1, child2).justifyContent(JustifyContent.spaceBetween).alignItems(AlignItems.center)
VStack(child1).frame({ width: 200, height: 100, alignment: Alignment.center })
HStack(child1, child2).flexWrap(FlexWrap.wrap)
```

**Style** -- `.background()`, `.backgroundAlpha()`, `.foregroundColor()`, `.cornerRadius()`, `.border()`, `.borderStyle()`, `.shadow()`, `.opacity()`

```ts
import { Color } from '@/Tokens/Color';
import { Radius } from '@/Tokens/Layout';
import { BorderStyle } from '@/Tokens/Style';

VStack(child).background(Color.card).cornerRadius(Radius.lg).shadow()
Text('Error').foregroundColor(Color.error)
VStack(child).border(1, Color.separator).borderStyle(BorderStyle.dashed)
VStack(child).backgroundAlpha(Color.tint, 0.1)
```

**Text** -- `.font()`, `.fontWeight()`, `.bold()`, `.semibold()`, `.medium()`, `.light()`, `.thin()`, `.heavy()`, `.black()`, `.caption()`, `.secondary()`, `.textTransform()`, `.letterSpacing()`, `.lineHeight()`, `.textAlign()`, `.lineLimit()`, `.textDecoration()`, `.underline()`, `.strikethrough()`, `.fontStyle()`, `.italic()`, `.fontFamily()`

```ts
import { Font } from '@/Tokens/Font';
import { TextTransform, TextAlign, FontStyle } from '@/Tokens/Style';

Text('Title').font(Font.title).bold()
Text('Caption').caption().secondary()
Text('IMPORTANT').textTransform(TextTransform.uppercase).letterSpacing(2)
Text('Fancy').fontFamily('Georgia').fontStyle(FontStyle.italic)
Text('Deleted').strikethrough()
Text('Centered').textAlign(TextAlign.center)
```

**Scroll** -- `.hideScrollIndicator()`, `.contentPadding()`, `.contentPaddingBottom()`, `.horizontal()`, `.keyboardAvoiding()`, `.keyboardShouldPersistTaps()`, `.bounces()`

```ts
import { Spacing } from '@/Tokens/Layout';

ScrollStack(child1, child2)
  .hideScrollIndicator()
  .contentPadding(Spacing.lg)
  .keyboardAvoiding()
  .bounces(false)
```

**TextInput** -- `.placeholder()`, `.inputLabel()`, `.inputError()`, `.keyboardType()`, `.multiline()`, `.secureEntry()`, `.autoCapitalize()`, `.returnKeyType()`, `.maxLength()`, `.inputHeight()`

```ts
import { AutoCapitalize } from '@/Tokens/Component';

TextInput(binding)
  .placeholder('Enter email')
  .inputLabel('Email')
  .inputError(errors.email)
  .keyboardType('email-address')
  .autoCapitalize(AutoCapitalize.none)
```

**SafeArea** -- `.edges()`

```ts
SafeArea(child).edges(['top', 'bottom'])
```

**Screen Navigation** -- `.screenTitle()`, `.headerRight()`, `.headerLeft()`

```ts
VStack(child)
  .screenTitle('Settings')
  .headerRight(() => <SaveButton />)
```

**Interaction** -- `.onTap()`, `.onLongPress()`, `.disabled()`

```ts
Text('Tap me').onTap(() => alert('tapped')).onLongPress(() => alert('long press'))
Button('Submit', submit).disabled(isSubmitting)
```

**Gestures** -- `.onSwipe()`, `.onPan()`, `.onPinch()`, `.onRotate()`

```ts
import { SwipeDirection } from '@/Tokens/Interaction';

VStack(child).onSwipe(SwipeDirection.left, () => handleSwipeLeft())
VStack(child).onPan({
  onChanged: (state) => console.log(state.translation),
})
```

**Animation** -- `.animation()`, `.transition()`

```ts
import { Animation } from '@/Animation/presets';
import { Transition, TransitionEdge } from '@/Tokens/Animation';

Text('Hello')
  .opacity(isVisible ? 1 : 0)
  .animation(Animation.spring(), isVisible)

VStack(child).transition({
  effect: Transition.slide,
  edge: TransitionEdge.bottom,
})
```

**Responsive** -- `.responsive()`, `.onCompact()`, `.onRegular()`, `.onLarge()`, `.onIOS()`, `.onAndroid()`

```ts
import { Spacing } from '@/Tokens/Layout';
import { Font } from '@/Tokens/Font';

VStack(child).responsive({
  compact: (v) => v.padding(Spacing.sm).font(Font.body),
  regular: (v) => v.padding(Spacing.lg).font(Font.title),
})
VStack(child).onCompact((v) => v.padding(Spacing.sm))
```

**Environment** -- `.environment()`

```ts
import { Color } from '@/Tokens/Color';

VStack(children).environment('accentColor', Color.tint)
```

**Position & Layout** -- `.position()`, `.positionEdges()`, `.zIndex()`, `.overflow()`, `.aspectRatio()`, `.alignSelf()`, `.display()`, `.hidden()`

```ts
import { Position, Overflow, AlignSelf, Display } from '@/Tokens/Style';

VStack(child).position(Position.absolute).positionEdges({ top: 0, right: 0 }).zIndex(10)
Image(source).aspectRatio(16 / 9)
Text('Hidden').hidden(true)
```

**Transform** -- `.offset()`, `.rotation()`, `.scale()`

```ts
Text('Shifted').offset({ x: 10, y: 5 })
Icon('star').rotation(45)
VStack(child).scale(0.9)
```

**Accessibility** -- `.accessibilityLabel()`, `.accessibilityRole()`, `.accessibilityHint()`, `.testID()`

```ts
Button('Save', save).accessibilityLabel('Save changes').accessibilityHint('Saves your edits')
VStack(child).testID('main-container')
```

**List** -- `.refreshControl()`, `.onEndReached()`, `.separator()`, `.numColumns()`, `.emptyComponent()`

```ts
LazyList(data, opts)
  .refreshControl(onRefresh, isRefreshing)
  .onEndReached(loadMore, 0.3)
  .separator(() => Divider().marginHorizontal())
  .emptyComponent(() => Text('No items'))
```

**Modal** -- `.onDismiss()`

```ts
import { ModalAnimation } from '@/Tokens/Component';

Modal(isPresented, { animationType: ModalAnimation.fade },
  Text('Modal content'),
).onDismiss(() => console.log('dismissed'))
```

**Custom Modifiers** -- `.modifier()`

```ts
Text('Hello').modifier(new CardModifier())
Text('Hello').modifier((v) => v.padding(Spacing.lg).shadow())
```

### `DSLElementType`

Union of all supported element types:

```ts
type DSLElementType =
  | 'text' | 'vstack' | 'hstack' | 'zstack' | 'icon'
  | 'spacer' | 'raw' | 'fragment' | 'safearea' | 'scroll'
  | 'textinput' | 'spinner' | 'lazylist' | 'image' | 'toggle'
  | 'button' | 'divider' | 'link' | 'sectionlist' | 'modal'
  | 'progressbar';
```

### `DSLChild`

The type accepted by containers as children:

```ts
type DSLChild = ViewBuilder | React.ReactElement | string | number | null | undefined | boolean;
```

### `isViewBuilder(value)`

Type guard that checks whether a value is a `ViewBuilder` instance using a well-known `Symbol`.

```ts
function isViewBuilder(value: unknown): value is ViewBuilder
```

---

### `DSLRenderer`

A React component that takes a `ViewBuilder` and renders it into React Native elements. It reads the current theme via `useDSLTheme()` and resolves color tokens automatically.

```ts
function DSLRenderer({ builder }: { builder: ViewBuilder }): React.ReactElement
```

You typically do not use `DSLRenderer` directly -- call `builder.toElement()` instead, which creates a `DSLRenderer` element internally.

---

### `DSLView`

Abstract base class for defining reusable view components. Follows SwiftUI's `View` protocol pattern with a `body()` method.

```ts
abstract class DSLView<Props extends Record<string, unknown> = Record<string, never>> {
  protected readonly props: Props;
  abstract body(): ViewBuilder;
  static build<P>(props: P): ViewBuilder;
}
```

**Example:**

```ts
import { DSLView } from '@/Core/DSLView';
import { VStack } from '@/Primitives/Containers';
import { Text } from '@/Primitives/Text';
import { Font } from '@/Tokens/Font';
import { Spacing } from '@/Tokens/Layout';
import { Alignment } from '@/Tokens/Style';

class ProfileCard extends DSLView<{ name: string; bio: string }> {
  body(): ViewBuilder {
    return VStack(
      Text(this.props.name).font(Font.title).bold(),
      Text(this.props.bio).font(Font.footnote).secondary(),
    )
    .modifier(new CardModifier())
    .alignment(Alignment.center);
  }
}

// Usage -- returns ViewBuilder, fully chainable:
ProfileCard.build({ name: 'John', bio: 'Developer' }).padding(Spacing.lg)
```

---

### `ViewModifier`

Abstract base class for reusable view modifiers. Follows SwiftUI's `ViewModifier` protocol pattern.

```ts
abstract class ViewModifier {
  abstract body(content: ViewBuilder): ViewBuilder;
}

type ViewModifierFn = (view: ViewBuilder) => ViewBuilder;
```

**Example:**

```ts
import { ViewModifier } from '@/Core/ViewModifier';
import { Spacing, Radius } from '@/Tokens/Layout';
import { Color } from '@/Tokens/Color';

class CardModifier extends ViewModifier {
  body(content: ViewBuilder): ViewBuilder {
    return content
      .padding(Spacing.lg)
      .background(Color.card)
      .cornerRadius(Radius.md)
      .shadow();
  }
}

Text('Hello').modifier(new CardModifier())
```

### `composeModifiers(...modifiers)`

Composes multiple modifiers (class instances or functions) into a single function. Modifiers are applied left-to-right.

```ts
import { composeModifiers } from '@/Core/ViewModifier';
import { Spacing } from '@/Tokens/Layout';

const styled = composeModifiers(
  new CardModifier(),
  (v) => v.shadow(),
  new PaddedModifier(Spacing.lg),
);

Text('Hello').modifier(styled)
```

---

### `Environment`

Environment values context that allows parent views to pass values down the tree without prop drilling.

```ts
export type EnvironmentValues = Record<string, unknown>;
export const EnvironmentCtx: React.Context<EnvironmentValues>;
export function useEnvironment<T>(key: string, defaultValue?: T): T | undefined;
```

**Example:**

```ts
import { useEnvironment } from '@/Core/Environment';
import { Color } from '@/Tokens/Color';

// Parent sets environment value:
VStack(children).environment('accentColor', Color.tint)

// Child reads environment value:
const color = useEnvironment<string>('accentColor', Color.tint);
```

---

### `Modifier` (type)

A large discriminated union representing every possible modifier. Each variant has a `type` field used as discriminant. Used internally by `ViewBuilder` and `DSLRenderer`.

```ts
type Modifier =
  | { type: 'padding'; value: number | SpacingToken; edge: PaddingEdge }
  | { type: 'margin'; value: number | SpacingToken; edge: PaddingEdge }
  | { type: 'background'; color: ColorValue }
  // ... 40+ additional variants
```

### `PaddingEdge`

```ts
type PaddingEdge = 'all' | 'horizontal' | 'vertical' | 'top' | 'bottom' | 'left' | 'right';
```

### `resolveSpacing(value, layout)`

Resolves a spacing token or raw number into a pixel value using the layout config.

```ts
function resolveSpacing(value: number | SpacingToken, layout: DSLLayout): number
```

### `resolveBorderRadius(value, layout)`

Resolves a border radius token or raw number into a pixel value.

```ts
function resolveBorderRadius(value: number | BorderRadiusToken, layout: DSLLayout): number
```

### `resolveFontSize(value, fonts)`

Resolves a font size token or raw number into a pixel value.

```ts
function resolveFontSize(value: FontSizeToken | number, fonts: DSLFonts): number
```

---

### `ColorValue`

An alias for `string`. Can be either a theme color token name (e.g., `Color.tint`, `Color.error`) or a raw CSS color string (e.g., `'#FF0000'`, `'rgba(0,0,0,0.5)'`).

```ts
type ColorValue = string;
```

### `resolveColor(value, theme, colors)`

Resolves a `ColorValue` against the current color scheme and color configuration. If the value matches a token name in the light palette, the corresponding value for the active scheme is returned. Otherwise, the raw string is passed through.

```ts
function resolveColor(
  value: ColorValue,
  theme: ColorScheme,
  colors: DSLColorConfig,
): string
```

### `isColorToken(value, colors)`

Checks whether a string is a known color token in the given palette.

```ts
function isColorToken(value: string, colors: DSLColors): boolean
```

### `normalizeColors(colors)`

Normalizes a `DSLColorConfig` into the `{ light, dark }` form. If a single flat palette is given, it is used for both schemes. Moved here from `Theme/types.ts` so that `types.ts` remains pure type definitions.

```ts
import { normalizeColors } from '@/Core/ThemeResolver';

function normalizeColors(colors: DSLColorConfig): { light: DSLColors; dark: DSLColors }
```

**Example:**

```ts
// Single palette -- used for both light and dark
const normalized = normalizeColors({ text: '#000', background: '#FFF' });
// => { light: { text: '#000', background: '#FFF' }, dark: { text: '#000', background: '#FFF' } }

// Dual palette -- passed through as-is
const dual = normalizeColors({
  light: { text: '#000', background: '#FFF' },
  dark: { text: '#FFF', background: '#000' },
});
```
