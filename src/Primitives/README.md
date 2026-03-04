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
Text('Hello, world!')
  .font('title')
  .bold()
  .foregroundColor('tint')
  .padding()
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
VStack(
  Text('Top'),
  HStack(
    Icon('star'),
    Text('Rating'),
  ).spacing(8),
  Text('Bottom'),
).spacing(12).padding().toElement();
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
Icon('heart', { size: 24, color: 'error' }).onTap(() => toggleFavorite());
```

### `Spacer()`

A flexible space that expands to fill available room (`flex: 1`).

```ts
function Spacer(): ViewBuilder
```

```ts
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
Raw(<MyCustomChart data={chartData} />)
  .padding()
  .cornerRadius('md')
  .toElement();
```

### `SafeArea(...children)`

A container that respects device safe area insets via `react-native-safe-area-context`.

```ts
function SafeArea(...children: DSLChild[]): ViewBuilder
```

```ts
SafeArea(
  Text('Safe content'),
).edges(['top', 'bottom']).background('background').flex().toElement();
```

### `ScrollStack(...children)`

A scrollable container wrapping `ScrollView`.

```ts
function ScrollStack(...children: DSLChild[]): ViewBuilder
```

```ts
ScrollStack(
  Text('Item 1'),
  Text('Item 2'),
  Text('Item 3'),
)
.hideScrollIndicator()
.contentPadding('lg')
.keyboardAvoiding()
.toElement();
```

### `TextInput(binding)`

A text input field connected to a `Binding<string>` for two-way data flow.

```ts
function TextInput(binding: Binding<string>): ViewBuilder
```

```ts
const nameBinding = createBinding(name, setName);

TextInput(nameBinding)
  .placeholder('Your name')
  .inputLabel('Full Name')
  .inputError(errors.name)
  .autoCapitalize('words')
  .maxLength(50)
  .toElement();
```

### `Spinner(size?)`

An activity indicator.

```ts
function Spinner(size?: 'small' | 'large'): ViewBuilder
```

```ts
Spinner('small').padding().toElement();
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
LazyList(users, {
  keyExtractor: (u) => u.id,
  renderItem: (u) => HStack(
    Text(u.name).bold(),
    Spacer(),
    Text(u.role).secondary(),
  ).padding(),
  listHeader: Text('All Users').font('title').bold().padding(),
  stickyHeader: true,
})
.refreshControl(onRefresh, isRefreshing)
.onEndReached(loadMore)
.separator(() => Divider().marginHorizontal())
.emptyComponent(() => Text('No users found').secondary().padding())
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
Image({ uri: 'https://example.com/photo.jpg' }, { alt: 'Profile photo' })
  .frame({ width: 100, height: 100 })
  .cornerRadius(50)
  .toElement();

Image(require('./assets/banner.png'), { resizeMode: 'contain' })
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
const notifBinding = createBinding(notificationsEnabled, setNotificationsEnabled);

HStack(
  Text('Notifications'),
  Spacer(),
  Toggle(notifBinding, { trackColor: 'success' }),
).padding().toElement();
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
Button('Save', handleSave)
  .toElement();

Button('Delete', handleDelete, { style: 'outlined', icon: 'trash' })
  .foregroundColor('error')
  .toElement();

Button('Cancel', handleCancel, { style: 'plain' })
  .toElement();
```

### `Divider()`

A thin horizontal separator line.

```ts
function Divider(): ViewBuilder
```

```ts
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
Link('Visit our website', 'https://example.com')
  .font('body')
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
SectionedList(
  [
    { title: 'Fruits', data: [{ id: '1', name: 'Apple' }, { id: '2', name: 'Banana' }] },
    { title: 'Vegetables', data: [{ id: '3', name: 'Carrot' }] },
  ],
  {
    keyExtractor: (item) => item.id,
    renderItem: (item) => Text(item.name).padding(),
    renderSectionHeader: (title) => Text(title).font('subtitle').bold().padding('sm'),
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
const showModal = createBinding(isModalVisible, setIsModalVisible);

Modal(showModal, { animationType: 'fade', transparent: true },
  VStack(
    Text('Are you sure?').font('title').bold(),
    HStack(
      Button('Cancel', () => showModal.update(false), { style: 'plain' }),
      Button('Confirm', handleConfirm),
    ).spacing(12),
  ).padding().background('card').cornerRadius('lg'),
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
ProgressBar(0.65, { progressColor: 'success' })
  .cornerRadius('sm')
  .marginVertical()
  .toElement();
```
