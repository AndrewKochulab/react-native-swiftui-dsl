# Navigation

Integration with `expo-router` for screen navigation configuration.

[<-- Back to README](../README.md)

> For implementation details, see [src/Navigation/README.md](../src/Navigation/README.md)

---

## ScreenConfigRenderer

For projects using `expo-router`, the framework includes `ScreenConfigRenderer` to configure navigation headers:

```tsx
import { ScreenConfigRenderer } from 'react-native-swiftui-dsl/src/Navigation/ScreenConfigRenderer';

function ProfileScreen() {
  return (
    <ScreenConfigRenderer options={{ title: 'Profile', headerShown: true }}>
      <DSLRenderer builder={buildProfileScreen()} />
    </ScreenConfigRenderer>
  );
}
```

## Screen Navigation Modifiers

```ts
VStack(/* ... */)
  .screenTitle('Profile')
  .headerRight(() => <SettingsButton />)
  .headerLeft(() => <BackButton />)
```

## Optional Dependency

`expo-router` is optional. If it is not installed, screen navigation modifiers (`.screenTitle()`, `.headerRight()`, `.headerLeft()`) are silently ignored -- they will not throw errors.
