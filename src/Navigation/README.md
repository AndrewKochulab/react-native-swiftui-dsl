# Navigation

Optional integration with `expo-router` for declarative screen configuration. This module is loaded lazily and only when `expo-router` is installed, so it does not add a hard dependency to the framework.

## Files

| File | Purpose |
|------|---------|
| `ScreenConfigRenderer.tsx` | Renders `expo-router` `Stack.Screen` options alongside DSL content |

## API Reference

### `ScreenConfigRenderer`

A React component that renders an `expo-router` `Stack.Screen` element with the given options, followed by its children. This is used internally by `ViewBuilder.toElement()` when screen navigation modifiers (`.screenTitle()`, `.headerRight()`, `.headerLeft()`) are present.

```ts
interface ScreenConfigRendererProps {
  options: Record<string, unknown>;
  children: React.ReactNode;
}

function ScreenConfigRenderer({ options, children }: ScreenConfigRendererProps): JSX.Element
```

**How it works:**

When you use screen navigation modifiers on a `ViewBuilder`, calling `.toElement()` detects the screen options and wraps the rendered output in a `ScreenConfigRenderer`. If `expo-router` is not installed, the import fails silently and the modifiers are no-ops.

**Example:**

```ts
import { VStack, Text } from 'react-native-swiftui-dsl';

export default function SettingsScreen() {
  return VStack(
    Text('Settings content'),
  )
  .screenTitle('Settings')
  .headerRight(() => <SaveButton />)
  .padding()
  .toElement();
}
```

This produces the equivalent of:

```tsx
<>
  <Stack.Screen options={{ title: 'Settings', headerRight: () => <SaveButton /> }} />
  <View style={{ padding: 16 }}>
    <Text>Settings content</Text>
  </View>
</>
```

## Optional Dependency

This module requires `expo-router` as a peer dependency. If it is not installed:

- The `.screenTitle()`, `.headerRight()`, and `.headerLeft()` modifiers are silently ignored.
- No runtime error is thrown.
- The rest of the DSL works normally.
