# Documentation

Comprehensive documentation for `react-native-swiftui-dsl`.

[<-- Back to README](../README.md)

---

## Getting Started

| Topic | Description |
| ----- | ----------- |
| [Getting Started](./getting-started.md) | Installation, quick start, config-free usage |

---

## Core Concepts

| Topic | Description | Source | Example |
| ----- | ----------- | ------ | ------- |
| [Primitives](./primitives.md) | 20 built-in UI components and component mapping | [src/Primitives/](../src/Primitives/README.md) | [01-basic-usage.tsx](../examples/01-basic-usage.tsx) |
| [Modifiers](./modifiers.md) | 60+ chainable modifiers and RN property mapping | [src/Core/](../src/Core/README.md) | [02-view-modifiers.tsx](../examples/02-view-modifiers.tsx) |
| [Theme System](./theme-system.md) | Token-based theming, color schemes, configuration | [src/Theme/](../src/Theme/README.md) | [01-basic-usage.tsx](../examples/01-basic-usage.tsx) |
| [Tokens](./tokens.md) | Color, Font, Spacing, Radius token enums | [src/Tokens/](../src/Tokens/README.md) | -- |

---

## Advanced Features

| Topic | Description | Source | Example |
| ----- | ----------- | ------ | ------- |
| [ViewModifier](./view-modifier.md) | Reusable modifier protocol (class & function-based) | [src/Core/](../src/Core/README.md) | [02-view-modifiers.tsx](../examples/02-view-modifiers.tsx) |
| [DSLView](./dsl-view.md) | Reusable view components with body() pattern | [src/Core/](../src/Core/README.md) | [03-dsl-view.tsx](../examples/03-dsl-view.tsx) |
| [Responsive](./responsive.md) | Breakpoint-based responsive layouts | [src/Responsive/](../src/Responsive/README.md) | [04-responsive-layout.tsx](../examples/04-responsive-layout.tsx) |
| [Animation](./animation.md) | Animation presets, transitions, withAnimation | [src/Animation/](../src/Animation/README.md) | [05-animations-gestures.tsx](../examples/05-animations-gestures.tsx) |
| [Gestures](./gestures.md) | Swipe, pan, pinch, rotation gestures | [src/Gesture/](../src/Gesture/README.md) | [05-animations-gestures.tsx](../examples/05-animations-gestures.tsx) |
| [Transforms](./transforms.md) | Offset, rotation, scale, blur, overlay | [src/Core/](../src/Core/README.md) | [07-transforms-environment.tsx](../examples/07-transforms-environment.tsx) |

---

## Integration

| Topic | Description | Source | Example |
| ----- | ----------- | ------ | ------- |
| [Bindings](./bindings.md) | Two-way data flow, createBinding, bindForm | [src/Binding/](../src/Binding/README.md) | [01-basic-usage.tsx](../examples/01-basic-usage.tsx) |
| [Environment](./environment.md) | Pass values down the view tree | [src/Core/](../src/Core/README.md) | [07-transforms-environment.tsx](../examples/07-transforms-environment.tsx) |
| [Navigation](./navigation.md) | expo-router ScreenConfigRenderer | [src/Navigation/](../src/Navigation/README.md) | -- |
| [Global Imports](./global-imports.md) | Zero-import usage across your app | -- | [06-globals-import.tsx](../examples/06-globals-import.tsx) |

---

## Utilities & Testing

| Topic | Description | Source |
| ----- | ----------- | ------ |
| [Utilities](./utilities.md) | PlatformInfo, assertNever, Logger, ScreenState | [src/Utils/](../src/Utils/), [src/Logger/](../src/Logger/) |
| [Testing](./testing.md) | Testing setup, renderWithDSLTheme helper | [src/Core/](../src/Core/README.md) |

---

## Architecture

| Topic | Description |
| ----- | ----------- |
| [Architecture](./architecture.md) | Project structure, module docs, example index |
