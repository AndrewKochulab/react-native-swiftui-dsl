# Primitives

Factory functions that create `ViewBuilder` instances for each supported UI element type. Every function returns a `ViewBuilder`, so all 60+ modifiers are available for chaining on the result.

## Files

| File | Purpose |
|------|---------|
| `Text.ts` | Text display |
| `Containers.ts` | `VStack`, `HStack`, `ZStack` layout containers |
| `Icon.ts` | FontAwesome icon (falls back to text if `@expo/vector-icons` is absent) |
| `Spacer.ts` | Flexible space (`flex: 1`) |
| `Raw.ts` | Escape hatch for embedding arbitrary `React.ReactElement` |
| `SafeArea.ts` | Safe area inset container |
| `ScrollStack.ts` | Scrollable container |
| `TextInput.ts` | Text input field with binding |
| `Spinner.ts` | Activity indicator |
| `LazyList.ts` | Virtualized flat list (`FlatList`) |
| `Image.ts` | Image display |
| `Toggle.ts` | Boolean switch with binding |
| `Button.ts` | Pressable button (filled, outlined, plain) |
| `Divider.ts` | Horizontal separator line |
| `Link.ts` | Pressable hyperlink text |
| `SectionedList.ts` | Virtualized section list (`SectionList`) |
| `Modal.ts` | Modal overlay |
| `ProgressBar.ts` | Determinate progress bar |

## API Reference

### `Text(content)`

Creates a text element.

```ts
function Text(content: string): ViewBuilder
```

```ts
import { Text } from '@/Primitives/Text';
import { Font } from '@/Tokens/Font';
import { Color } from '@/Tokens/Color';
import { Spacing } from '@/Tokens/Layout';

Text('Hello, world!')
  .font(Font.title)
  .bold()
  .foregroundColor(Color.tint)
  .padding(Spacing.md)
  .toElement();
```

### `VStack(...children)`, `HStack(...children)`, `ZStack(...children)`

Layout containers arranged vertically, horizontally, or stacked on the z-axis.

```ts
function VStack(...children: DSLChild[]): ViewBuilder
function HStack(...children: DSLChild[]): ViewBuilder
function ZStack(...children: DSLChild[]): ViewBuilder
```

```ts
import { VStack, HStack } from '@/Primitives/Containers';
import { Text } from '@/Primitives/Text';
import { Icon } from '@/Primitives/Icon';
import { Spacing } from '@/Tokens/Layout';

VStack(
  Text('Top'),
  HStack(
    Icon('star'),
    Text('Rating'),
  ).spacing(8),
  Text('Bottom'),
).spacing(12).padding(Spacing.md).toElement();
```

### `Icon(name, options?)`

Renders a FontAwesome icon. Falls back to plain text if `@expo/vector-icons` is not installed.

```ts
function Icon(
  name: string,
  options?: { size?: number; color?: ColorValue },
): ViewBuilder
```

```ts
import { Icon } from '@/Primitives/Icon';
import { Color } from '@/Tokens/Color';

Icon('heart', { size: 24, color: Color.error }).onTap(() => toggleFavorite());
```

### `Spacer()`

A flexible space that expands to fill available room (`flex: 1`).

```ts
function Spacer(): ViewBuilder
```

```ts
import { HStack } from '@/Primitives/Containers';
import { Text } from '@/Primitives/Text';
import { Spacer } from '@/Primitives/Spacer';

HStack(
  Text('Left'),
  Spacer(),
  Text('Right'),
).toElement();
```

### `Raw(element)`

Wraps an arbitrary `React.ReactElement` so it can participate in the DSL tree and receive modifiers.

```ts
function Raw(element: React.ReactElement): ViewBuilder
```

```ts
import { Raw } from '@/Primitives/Raw';
import { Spacing, Radius } from '@/Tokens/Layout';

Raw(<MyCustomChart data={chartData} />)
  .padding(Spacing.md)
  .cornerRadius(Radius.md)
  .toElement();
```

### `SafeArea(...children)`

A container that respects device safe area insets via `react-native-safe-area-context`.

```ts
function SafeArea(...children: DSLChild[]): ViewBuilder
```

```ts
import { SafeArea } from '@/Primitives/SafeArea';
import { Text } from '@/Primitives/Text';
import { Color } from '@/Tokens/Color';

SafeArea(
  Text('Safe content'),
).edges(['top', 'bottom']).background(Color.background).flex().toElement();
```

### `ScrollStack(...children)`

A scrollable container wrapping `ScrollView`.

```ts
function ScrollStack(...children: DSLChild[]): ViewBuilder
```

```ts
import { ScrollStack } from '@/Primitives/ScrollStack';
import { Text } from '@/Primitives/Text';
import { Spacing } from '@/Tokens/Layout';

ScrollStack(
  Text('Item 1'),
  Text('Item 2'),
  Text('Item 3'),
)
.hideScrollIndicator()
.contentPadding(Spacing.lg)
.keyboardAvoiding()
.toElement();
```

### `TextInput(binding)`

A text input field connected to a `Binding<string>` for two-way data flow.

```ts
function TextInput(binding: Binding<string>): ViewBuilder
```

```ts
import { TextInput } from '@/Primitives/TextInput';
import { createBinding } from '@/Binding/Binding';
import { AutoCapitalize } from '@/Tokens/Component';

const nameBinding = createBinding(name, setName);

TextInput(nameBinding)
  .placeholder('Your name')
  .inputLabel('Full Name')
  .inputError(errors.name)
  .autoCapitalize(AutoCapitalize.words)
  .maxLength(50)
  .toElement();
```

### `Spinner(size?)`

An activity indicator.

```ts
function Spinner(size?: 'small' | 'large'): ViewBuilder
```

```ts
import { Spinner } from '@/Primitives/Spinner';
import { SpinnerSize } from '@/Tokens/Component';
import { Spacing } from '@/Tokens/Layout';

Spinner(SpinnerSize.small).padding(Spacing.md).toElement();
```

### `LazyList<T>(data, options)`

A virtualized list backed by `FlatList`. Suitable for large data sets.

```ts
interface LazyListOptions<T> {
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ViewBuilder;
  listHeader?: ViewBuilder;
  stickyHeader?: boolean;
}

function LazyList<T>(
  data: ReadonlyArray<T>,
  options: LazyListOptions<T>,
): ViewBuilder
```

```ts
import { LazyList } from '@/Primitives/LazyList';
import { HStack } from '@/Primitives/Containers';
import { Text } from '@/Primitives/Text';
import { Spacer } from '@/Primitives/Spacer';
import { Divider } from '@/Primitives/Divider';
import { Font } from '@/Tokens/Font';
import { Spacing } from '@/Tokens/Layout';

LazyList(users, {
  keyExtractor: (u) => u.id,
  renderItem: (u) => HStack(
    Text(u.name).bold(),
    Spacer(),
    Text(u.role).secondary(),
  ).padding(Spacing.md),
  listHeader: Text('All Users').font(Font.title).bold().padding(Spacing.md),
  stickyHeader: true,
})
.refreshControl(onRefresh, isRefreshing)
.onEndReached(loadMore)
.separator(() => Divider().marginHorizontal())
.emptyComponent(() => Text('No users found').secondary().padding(Spacing.md))
.toElement();
```

### `Image(source, options?)`

Displays an image from a local asset or remote URI.

```ts
type ImageSource = ImageSourcePropType | { uri: string };

function Image(
  source: ImageSource,
  options?: { resizeMode?: 'cover' | 'contain' | 'stretch' | 'center'; alt?: string },
): ViewBuilder
```

```ts
import { Image } from '@/Primitives/Image';
import { ImageResize } from '@/Tokens/Component';
import { Radius } from '@/Tokens/Layout';

Image({ uri: 'https://example.com/photo.jpg' }, { alt: 'Profile photo' })
  .frame({ width: 100, height: 100 })
  .cornerRadius(Radius.lg)
  .toElement();

Image(require('./assets/banner.png'), { resizeMode: ImageResize.contain })
  .frame({ height: 200 })
  .toElement();
```

### `Toggle(binding, options?)`

A boolean switch connected to a `Binding<boolean>`.

```ts
function Toggle(
  binding: Binding<boolean>,
  options?: { trackColor?: ColorValue; thumbColor?: ColorValue },
): ViewBuilder
```

```ts
import { Toggle } from '@/Primitives/Toggle';
import { HStack } from '@/Primitives/Containers';
import { Text } from '@/Primitives/Text';
import { Spacer } from '@/Primitives/Spacer';
import { createBinding } from '@/Binding/Binding';
import { Color } from '@/Tokens/Color';
import { Spacing } from '@/Tokens/Layout';

const notifBinding = createBinding(notificationsEnabled, setNotificationsEnabled);

HStack(
  Text('Notifications'),
  Spacer(),
  Toggle(notifBinding, { trackColor: Color.success }),
).padding(Spacing.md).toElement();
```

### `Button(title, action, options?)`

A pressable button with three style variants.

```ts
type ButtonStyle = 'filled' | 'outlined' | 'plain';

function Button(
  title: string,
  action: () => void,
  options?: { style?: ButtonStyle; icon?: string },
): ViewBuilder
```

```ts
import { Button } from '@/Primitives/Button';
import { ButtonVariant } from '@/Tokens/Component';
import { Color } from '@/Tokens/Color';

Button('Save', handleSave)
  .toElement();

Button('Delete', handleDelete, { style: ButtonVariant.outlined, icon: 'trash' })
  .foregroundColor(Color.error)
  .toElement();

Button('Cancel', handleCancel, { style: ButtonVariant.plain })
  .toElement();
```

### `Divider()`

A thin horizontal separator line.

```ts
function Divider(): ViewBuilder
```

```ts
import { Divider } from '@/Primitives/Divider';
import { VStack } from '@/Primitives/Containers';
import { Text } from '@/Primitives/Text';

VStack(
  Text('Section 1'),
  Divider().marginHorizontal(),
  Text('Section 2'),
).toElement();
```

### `Link(title, url)`

A pressable text that opens a URL via `Linking.openURL()`.

```ts
function Link(title: string, url: string): ViewBuilder
```

```ts
import { Link } from '@/Primitives/Link';
import { Font } from '@/Tokens/Font';

Link('Visit our website', 'https://example.com')
  .font(Font.body)
  .toElement();
```

### `SectionedList<T>(sections, options)`

A virtualized section list backed by `SectionList`.

```ts
interface SectionData<T> {
  title: string;
  data: ReadonlyArray<T>;
}

interface SectionedListOptions<T> {
  keyExtractor: (item: T) => string;
  renderItem: (item: T) => ViewBuilder;
  renderSectionHeader?: (title: string) => ViewBuilder;
}

function SectionedList<T>(
  sections: ReadonlyArray<SectionData<T>>,
  options: SectionedListOptions<T>,
): ViewBuilder
```

```ts
import { SectionedList } from '@/Primitives/SectionedList';
import { Text } from '@/Primitives/Text';
import { Font } from '@/Tokens/Font';
import { Spacing } from '@/Tokens/Layout';

SectionedList(
  [
    { title: 'Fruits', data: [{ id: '1', name: 'Apple' }, { id: '2', name: 'Banana' }] },
    { title: 'Vegetables', data: [{ id: '3', name: 'Carrot' }] },
  ],
  {
    keyExtractor: (item) => item.id,
    renderItem: (item) => Text(item.name).padding(Spacing.md),
    renderSectionHeader: (title) => Text(title).font(Font.subtitle).bold().padding(Spacing.sm),
  },
).toElement();
```

### `Modal(isPresented, options?, ...children)`

A modal overlay controlled by a `Binding<boolean>`.

```ts
type ModalAnimationType = 'none' | 'slide' | 'fade';

function Modal(
  isPresented: Binding<boolean>,
  options?: { animationType?: ModalAnimationType; transparent?: boolean },
  ...children: DSLChild[]
): ViewBuilder
```

```ts
import { Modal } from '@/Primitives/Modal';
import { VStack, HStack } from '@/Primitives/Containers';
import { Text } from '@/Primitives/Text';
import { Button } from '@/Primitives/Button';
import { createBinding } from '@/Binding/Binding';
import { ModalAnimation, ButtonVariant } from '@/Tokens/Component';
import { Font } from '@/Tokens/Font';
import { Color } from '@/Tokens/Color';
import { Spacing, Radius } from '@/Tokens/Layout';

const showModal = createBinding(isModalVisible, setIsModalVisible);

Modal(showModal, { animationType: ModalAnimation.fade, transparent: true },
  VStack(
    Text('Are you sure?').font(Font.title).bold(),
    HStack(
      Button('Cancel', () => showModal.update(false), { style: ButtonVariant.plain }),
      Button('Confirm', handleConfirm),
    ).spacing(12),
  ).padding(Spacing.lg).background(Color.card).cornerRadius(Radius.lg),
).onDismiss(() => console.log('Modal dismissed')).toElement();
```

### `ProgressBar(value, options?)`

A determinate progress bar. The `value` is clamped to `[0, 1]`.

```ts
function ProgressBar(
  value: number,
  options?: { trackColor?: ColorValue; progressColor?: ColorValue },
): ViewBuilder
```

```ts
import { ProgressBar } from '@/Primitives/ProgressBar';
import { Color } from '@/Tokens/Color';
import { Radius } from '@/Tokens/Layout';

ProgressBar(0.65, { progressColor: Color.success })
  .cornerRadius(Radius.sm)
  .marginVertical()
  .toElement();
```
