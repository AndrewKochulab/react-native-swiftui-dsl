# Architecture & Documentation

Overview of the project structure and module organization.

[<-- Back to README](../README.md)

---

## Project Structure

```
src/
+-- Animation/       # Animation presets, transitions, withAnimation
+-- Binding/         # Two-way binding system (createBinding, bindForm)
+-- Conditionals/    # If, ForEach, Group
+-- Config/          # DSLDefaults, defaultThemeConfig
+-- Core/            # ViewBuilder, DSLRenderer, Modifier types, ThemeResolver
+-- Gesture/         # Swipe, Pan, Pinch, Rotation gesture handlers
+-- Logger/          # Structured logging utility
+-- Navigation/      # expo-router ScreenConfigRenderer
+-- Primitives/      # 20 primitive factory functions
+-- Responsive/      # Breakpoint system, ResponsiveProvider, hooks
+-- ScreenState/     # Screen state management (loading, error, success)
+-- Theme/           # DSLThemeProvider, DSLThemeContext, type definitions
+-- Tokens/          # Color, Font, Spacing, Radius token enums
+-- Utils/           # PlatformInfo, assertNever, date/ID utilities
+-- globals.ts       # Global import registration
+-- globals.d.ts     # TypeScript declarations for globals
+-- index.ts         # Public API -- single entry point
```

## Module Documentation

Each module has its own README with in-depth documentation:

| Module           | Path                                                             | Description                                                                               |
| ---------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Animation**    | [src/Animation/README.md](../src/Animation/README.md)            | Animation presets, transitions, withAnimation                                             |
| **Binding**      | [src/Binding/README.md](../src/Binding/README.md)                | Two-way bindings: `createBinding`, `bindForm`, Proxy-based field access, caching          |
| **Conditionals** | [src/Conditionals/README.md](../src/Conditionals/README.md)      | Declarative control flow: `If`, `ForEach`, `Group`                                        |
| **Config**       | [src/Config/README.md](../src/Config/README.md)                  | Centralized defaults, `DSLDefaults`, `defaultThemeConfig`                                 |
| **Core**         | [src/Core/README.md](../src/Core/README.md)                      | Core rendering engine: `ViewBuilder`, `DSLRenderer`, modifier resolution, `ThemeResolver` |
| **Gesture**      | [src/Gesture/README.md](../src/Gesture/README.md)                | Gesture handlers: swipe, pan, pinch, rotation                                             |
| **Navigation**   | [src/Navigation/README.md](../src/Navigation/README.md)          | Screen navigation: `ScreenConfigRenderer`, expo-router integration                        |
| **Primitives**   | [src/Primitives/README.md](../src/Primitives/README.md)          | All 20 UI component primitives with signatures and examples                               |
| **Responsive**   | [src/Responsive/README.md](../src/Responsive/README.md)          | Breakpoint system, size classes, responsive modifiers                                     |
| **Theme**        | [src/Theme/README.md](../src/Theme/README.md)                    | Theming system: `DSLThemeProvider`, `DSLColorConfig`, token types                         |
| **Tokens**       | [src/Tokens/README.md](../src/Tokens/README.md)                  | Token enums: Color, Font, Spacing, Radius                                                 |

## Examples

| Example | File | Topics |
| ------- | ---- | ------ |
| Basic Usage | [examples/01-basic-usage.tsx](../examples/01-basic-usage.tsx) | Primitives, layout, theming |
| View Modifiers | [examples/02-view-modifiers.tsx](../examples/02-view-modifiers.tsx) | Modifiers, ViewModifier protocol |
| DSLView | [examples/03-dsl-view.tsx](../examples/03-dsl-view.tsx) | Reusable views, composition |
| Responsive Layout | [examples/04-responsive-layout.tsx](../examples/04-responsive-layout.tsx) | Breakpoints, size classes |
| Animations & Gestures | [examples/05-animations-gestures.tsx](../examples/05-animations-gestures.tsx) | Animation presets, transitions, gestures |
| Global Imports | [examples/06-globals-import.tsx](../examples/06-globals-import.tsx) | Zero-import usage |
| Transforms & Environment | [examples/07-transforms-environment.tsx](../examples/07-transforms-environment.tsx) | Transforms, environment values |
