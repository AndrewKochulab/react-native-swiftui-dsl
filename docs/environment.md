# Environment Values

Pass values down the view tree without prop drilling -- inspired by SwiftUI's environment system.

[<-- Back to README](../README.md)

> For implementation details, see [src/Core/README.md](../src/Core/README.md)
> See [examples/07-transforms-environment.tsx](../examples/07-transforms-environment.tsx)

---

## Setting Environment Values

```ts
// Parent sets values:
VStack(children)
  .environment('accentColor', 'tint')
  .environment('density', 'compact')
```

## Reading Environment Values

```ts
// Child reads values (in a React component):
import { useEnvironment } from 'react-native-swiftui-dsl';

const color = useEnvironment<string>('accentColor', 'tint');
```

The second argument is a default value used when the key is not found in the environment.

## Use Cases

- Pass theme overrides to subtrees without a full provider
- Share configuration like density, accent colors, or layout modes
- Avoid prop drilling through deeply nested view hierarchies
