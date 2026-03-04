# Binding

Two-way data binding system inspired by SwiftUI's `$` binding syntax. Provides a lightweight mechanism for connecting form inputs to application state with Proxy-based caching for optimal performance.

## Files

| File | Purpose |
|------|---------|
| `Binding.ts` | `Binding<T>` interface, `createBinding()` factory, and `bindForm()` Proxy helper |

## API Reference

### `Binding<T>` (interface)

Represents a two-way binding between a value and its updater.

```ts
interface Binding<T> {
  readonly value: T;
  readonly update: (newValue: T) => void;
}
```

### `createBinding<T>(value, update)`

Creates a single `Binding<T>` from a value and an update callback.

```ts
function createBinding<T>(value: T, update: (newValue: T) => void): Binding<T>
```

**Example:**

```ts
import { createBinding } from 'react-native-swiftui-dsl';

const [name, setName] = useState('');
const nameBinding = createBinding(name, setName);

// Use with TextInput primitive
TextInput(nameBinding).placeholder('Enter your name');
```

### `bindForm<T>(data, setter)`

Creates a `Proxy`-backed map that lazily produces `Binding<T[K]>` for every key in `data`. Bindings are cached and reused as long as the underlying value has not changed, preventing unnecessary re-renders.

```ts
function bindForm<T extends object>(
  data: T,
  setter: (key: keyof T & string, value: unknown) => void,
): { readonly [K in keyof T]: Binding<T[K]> }
```

**Example:**

```ts
import { bindForm, TextInput, VStack } from 'react-native-swiftui-dsl';

interface FormData {
  title: string;
  email: string;
  bio: string;
}

function MyForm({ state, updateField }: {
  state: FormData;
  updateField: (key: keyof FormData, value: unknown) => void;
}) {
  const $form = bindForm(state, updateField);

  return VStack(
    TextInput($form.title)
      .placeholder('Title')
      .inputLabel('Title'),
    TextInput($form.email)
      .placeholder('email@example.com')
      .keyboardType('email-address')
      .inputLabel('Email'),
    TextInput($form.bio)
      .placeholder('Tell us about yourself')
      .multiline(4)
      .inputLabel('Bio'),
  ).spacing(12).toElement();
}
```

### Proxy Caching Behavior

`bindForm` uses a `Map`-based cache internally. When you access `$form.title`, it checks whether the cached binding's `.value` still matches `data.title`. If it does, the same binding object is returned, preserving referential equality and avoiding unnecessary React re-renders. If the value has changed, a fresh binding is created and cached.
