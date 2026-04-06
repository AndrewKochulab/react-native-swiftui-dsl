# Global Imports

Import once in your app entry point, use everywhere without individual imports.

[<-- Back to README](../README.md)

> See [examples/06-globals-import.tsx](../examples/06-globals-import.tsx)

---

## Setup

```ts
// App.tsx (once):
import 'react-native-swiftui-dsl/globals';
```

## Usage

```ts
// Any file -- no imports needed:
function buildScreen() {
  return VStack(
    Text('Hello').font(Font.title).bold(),
    Button('Go', () => navigate(), { style: ButtonVariant.filled }),
  ).padding(Spacing.lg);
}
```

## Explicit Imports

Named imports still work for teams that prefer explicit imports:

```ts
import { VStack, Text, Button } from 'react-native-swiftui-dsl';
```

Global imports register all primitives, tokens, modifiers, and utility functions on the global scope. This is optional and purely a convenience -- the two approaches can be mixed freely.
