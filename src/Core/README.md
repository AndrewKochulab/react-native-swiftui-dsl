# Core

The engine of the DSL framework. Contains the builder class that exposes 60+ chainable modifiers, the React rendering engine that materializes builders into native components, the modifier type definitions, and the theme-aware color resolver.

## Files

| File | Purpose |
|------|---------|
| `ViewBuilder.ts` | `ViewBuilder` class, `DSLElementType`, `DSLElementProps`, `DSLChild`, `isViewBuilder()` |
| `DSLRenderer.tsx` | React component that converts a `ViewBuilder` tree into React Native elements |
| `Modifier.ts` | `Modifier` discriminated union type, `PaddingEdge`, token resolution helpers |
| `ThemeResolver.ts` | `ColorValue` type, `resolveColor()`, `isColorToken()` |

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
Text('Hello').padding()                  // all edges, default 'md' token
Text('Hello').padding(20)                // all edges, 20pt
Text('Hello').padding('lg', 'horizontal') // horizontal, 'lg' token
Text('Hello').paddingTop('sm')           // top edge, 'sm' token
```

**Margin** -- `.margin()`, `.marginHorizontal()`, `.marginVertical()`, `.marginTop()`, `.marginBottom()`, `.marginLeft()`, `.marginRight()`

```ts
Text('Hello').margin().marginBottom(8)
```

**Layout** -- `.flex()`, `.frame()`, `.spacing()`, `.gap()`, `.justifyContent()`, `.alignItems()`, `.alignment()`, `.flexWrap()`

```ts
VStack(child1, child2).flex().spacing(12)
HStack(child1, child2).justifyContent('spaceBetween').alignItems('center')
VStack(child1).frame({ width: 200, height: 100, alignment: 'center' })
HStack(child1, child2).flexWrap('wrap')
```

**Style** -- `.background()`, `.backgroundAlpha()`, `.foregroundColor()`, `.cornerRadius()`, `.border()`, `.borderStyle()`, `.shadow()`, `.opacity()`

```ts
VStack(child).background('card').cornerRadius('lg').shadow()
Text('Error').foregroundColor('error')
VStack(child).border(1, 'separator').borderStyle('dashed')
VStack(child).backgroundAlpha('tint', 0.1)
```

**Text** -- `.font()`, `.fontWeight()`, `.bold()`, `.semibold()`, `.medium()`, `.light()`, `.thin()`, `.heavy()`, `.black()`, `.caption()`, `.secondary()`, `.textTransform()`, `.letterSpacing()`, `.lineHeight()`, `.textAlign()`, `.lineLimit()`, `.textDecoration()`, `.underline()`, `.strikethrough()`, `.fontStyle()`, `.italic()`, `.fontFamily()`

```ts
Text('Title').font('title').bold()
Text('Caption').caption().secondary()
Text('IMPORTANT').textTransform('uppercase').letterSpacing(2)
Text('Fancy').fontFamily('Georgia').italic()
Text('Deleted').strikethrough()
```

**Scroll** -- `.hideScrollIndicator()`, `.contentPadding()`, `.contentPaddingBottom()`, `.horizontal()`, `.keyboardAvoiding()`, `.keyboardShouldPersistTaps()`, `.bounces()`

```ts
ScrollStack(child1, child2)
  .hideScrollIndicator()
  .contentPadding('lg')
  .keyboardAvoiding()
  .bounces(false)
```

**TextInput** -- `.placeholder()`, `.inputLabel()`, `.inputError()`, `.keyboardType()`, `.multiline()`, `.secureEntry()`, `.autoCapitalize()`, `.returnKeyType()`, `.maxLength()`, `.inputHeight()`

```ts
TextInput(binding)
  .placeholder('Enter email')
  .inputLabel('Email')
  .inputError(errors.email)
  .keyboardType('email-address')
  .autoCapitalize('none')
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

**Position & Layout** -- `.position()`, `.positionEdges()`, `.zIndex()`, `.overflow()`, `.aspectRatio()`, `.alignSelf()`, `.display()`, `.hidden()`

```ts
VStack(child).position('absolute').positionEdges({ top: 0, right: 0 }).zIndex(10)
Image(source).aspectRatio(16 / 9)
Text('Hidden').hidden(true)
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
Modal(isPresented, { animationType: 'fade' },
  Text('Modal content'),
).onDismiss(() => console.log('dismissed'))
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

An alias for `string`. Can be either a theme color token name (e.g., `'tint'`, `'error'`) or a raw CSS color string (e.g., `'#FF0000'`, `'rgba(0,0,0,0.5)'`).

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
