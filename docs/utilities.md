# Utilities

Helper modules for platform detection, logging, screen state, and common utility functions.

[<-- Back to README](../README.md)

> For implementation details, see source files in [src/Utils/](../src/Utils/), [src/Logger/](../src/Logger/), and [src/ScreenState/](../src/ScreenState/)

---

## PlatformInfo

Detect the current platform for conditional logic:

```ts
import { PlatformInfo } from 'react-native-swiftui-dsl';

if (PlatformInfo.isIOS) {
  // iOS-specific logic
}
```

## assertNever

Exhaustive type checking for switch statements:

```ts
import { assertNever } from 'react-native-swiftui-dsl';

function handleStatus(status: 'active' | 'inactive') {
  switch (status) {
    case 'active': return doActive();
    case 'inactive': return doInactive();
    default: assertNever(status);
  }
}
```

## Date & ID Utilities

Common helpers for generating unique IDs and formatting dates.

## Logger

Structured logging utility for development:

```ts
import { Logger } from 'react-native-swiftui-dsl';

Logger.debug('Component rendered');
Logger.warn('Deprecated modifier used');
Logger.error('Failed to resolve token', error);
```

## ScreenState

Manage loading, error, and success states for screens:

```ts
import { ScreenState } from 'react-native-swiftui-dsl';
```
