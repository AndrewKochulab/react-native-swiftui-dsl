# Responsive

Responsive layout system supporting breakpoint-based adaptation for phones, tablets, and custom device categories. Provides React hooks, context, and modifier resolution for size-class-aware UI.

## Files

| File | Purpose |
|------|---------|
| `types.ts` | All responsive-related TypeScript types: `ResponsiveContext`, `ResponsiveConfig`, `ResponsiveModifierFn` |
| `useResponsive.ts` | `useResponsive()` hook and size class/orientation determination utilities |
| `ResponsiveContext.ts` | React context (`ResponsiveCtx`), `useResponsiveContext()`, and `useSizeClass()` hooks |
| `ResponsiveProvider.tsx` | React context provider component for responsive layout |
| `resolveResponsiveModifiers.ts` | Modifier resolution engine that expands responsive modifiers into concrete modifiers |

## API Reference

### Types (`types.ts`)

#### `ResponsiveContext`

The context value provided by the responsive system.

```ts
import { SizeClassToken, OrientationToken } from '@/Tokens/Interaction';

interface ResponsiveContext {
  sizeClass: SizeClassToken;    // SizeClass.compact | SizeClass.regular | SizeClass.large
  orientation: OrientationToken; // Orientation.portrait | Orientation.landscape
  width: number;
  height: number;
  scale: number;
}
```

#### `ResponsiveConfig`

Configuration object passed to the `.responsive()` modifier.

```ts
type ResponsiveModifierFn = (builder: ViewBuilder) => ViewBuilder;

interface ResponsiveConfig {
  compact?: ResponsiveModifierFn;
  regular?: ResponsiveModifierFn;
  large?: ResponsiveModifierFn;
  custom?: Record<string, ResponsiveModifierFn>;
}
```

---

### `useResponsive(breakpointOverrides?, customBreakpoints?)`

React hook that provides the current responsive context. Listens for dimension changes and updates automatically.

```ts
function useResponsive(
  breakpointOverrides?: Partial<BreakpointDefinition>,
  customBreakpoints?: CustomBreakpoint[],
): ResponsiveContext
```

**Example:**

```ts
import { useResponsive } from '@/Responsive/useResponsive';
import { SizeClass } from '@/Tokens/Interaction';
import { Font } from '@/Tokens/Font';
import { Spacing } from '@/Tokens/Layout';

function MyComponent() {
  const { sizeClass, orientation, width } = useResponsive();

  const fontSize = sizeClass === SizeClass.compact ? Font.body : Font.title;
  const padding = sizeClass === SizeClass.large ? Spacing.xl : Spacing.md;

  return Text('Responsive').font(fontSize).padding(padding).toElement();
}
```

### Helper Functions

#### `determineSizeClass(width, breakpoints)`

Determines the current size class based on screen width.

```ts
import { SizeClass } from '@/Tokens/Interaction';

function determineSizeClass(width: number, breakpoints: BreakpointDefinition): SizeClassToken
// Returns SizeClass.compact, SizeClass.regular, or SizeClass.large
```

#### `determineOrientation(width, height)`

```ts
import { Orientation } from '@/Tokens/Interaction';

function determineOrientation(width: number, height: number): OrientationToken
// Returns Orientation.portrait or Orientation.landscape
```

#### `resolveBreakpoints(overrides?)`

Merges custom breakpoint overrides with defaults from `DSLDefaults.responsive.breakpoints`.

```ts
function resolveBreakpoints(overrides?: Partial<BreakpointDefinition>): BreakpointDefinition
```

#### `matchesCustomBreakpoint(width, breakpoint)`

Checks if a width falls within a custom breakpoint range.

```ts
function matchesCustomBreakpoint(width: number, breakpoint: CustomBreakpoint): boolean
```

#### `getMatchingCustomBreakpoints(width, customBreakpoints?)`

Returns names of all matching custom breakpoints for the current width.

```ts
function getMatchingCustomBreakpoints(width: number, customBreakpoints?: CustomBreakpoint[]): string[]
```

---

### React Context (`ResponsiveContext.ts`)

#### `ResponsiveCtx`

React context that provides responsive information to all DSL components.

```ts
const ResponsiveCtx: React.Context<ResponsiveContext | null>
```

#### `useResponsiveContext()`

Returns the full responsive context, or `null` if no responsive provider is present.

```ts
function useResponsiveContext(): ResponsiveContext | null
```

#### `useSizeClass()`

Returns the current size class token. Falls back to `SizeClass.compact` when no responsive provider is present.

```ts
import { SizeClass } from '@/Tokens/Interaction';

function useSizeClass(): SizeClassToken
// Returns SizeClass.compact | SizeClass.regular | SizeClass.large
```

---

### `ResponsiveProvider` (`ResponsiveProvider.tsx`)

A React context provider that supplies responsive layout information (size class, orientation, dimensions) to all DSL components in the subtree. `DSLThemeProvider` wraps this internally, so you get responsive context automatically when using the theme provider. Use `ResponsiveProvider` independently when you need responsive features without theming.

```ts
interface Props {
  breakpointOverrides?: Partial<BreakpointDefinition>;
  customBreakpoints?: CustomBreakpoint[];
  children: React.ReactNode;
}

function ResponsiveProvider({ breakpointOverrides, customBreakpoints, children }: Props): JSX.Element
```

**Example -- standalone usage (no theme provider):**

```tsx
import { ResponsiveProvider } from '@/Responsive/ResponsiveProvider';

export default function App() {
  return (
    <ResponsiveProvider>
      {/* All DSL components inside here have responsive context */}
      {Text('Hello').responsive({
        compact: (v) => v.font(Font.body),
        regular: (v) => v.font(Font.title),
      }).toElement()}
    </ResponsiveProvider>
  );
}
```

**Example -- with custom breakpoints:**

```tsx
import { ResponsiveProvider } from '@/Responsive/ResponsiveProvider';

<ResponsiveProvider
  breakpointOverrides={{ compact: { min: 0, max: 430 }, regular: { min: 431, max: 834 } }}
  customBreakpoints={[{ name: 'smallPhone', minWidth: 0, maxWidth: 375 }]}
>
  {children}
</ResponsiveProvider>
```

> **Note:** When using `DSLThemeProvider`, you do not need to add `ResponsiveProvider` separately -- it is already included.

---

### `resolveResponsiveModifiers(modifiers, ctx, customBreakpoints?)`

Resolves responsive and platform modifiers into concrete modifiers. Expands `responsive`, `onCompact`, `onRegular`, `onLarge`, `onIOS`, and `onAndroid` modifiers before style computation.

```ts
function resolveResponsiveModifiers(
  modifiers: ReadonlyArray<Modifier>,
  ctx: ResponsiveContext,
  customBreakpoints?: CustomBreakpoint[],
): Modifier[]
```

---

### Usage via ViewBuilder Modifiers

**Size-class-specific modifiers:**

```ts
import { VStack } from '@/Primitives/Containers';
import { Text } from '@/Primitives/Text';
import { Font } from '@/Tokens/Font';
import { Spacing } from '@/Tokens/Layout';
import { Color } from '@/Tokens/Color';

VStack(
  Text('Responsive Layout'),
).responsive({
  compact: (v) => v.padding(Spacing.sm).font(Font.body),
  regular: (v) => v.padding(Spacing.lg).font(Font.title),
  large: (v) => v.padding(Spacing.xl).font(Font.header),
}).toElement();
```

**Shorthand size-class modifiers:**

```ts
import { Spacing } from '@/Tokens/Layout';

VStack(child)
  .onCompact((v) => v.padding(Spacing.sm))
  .onRegular((v) => v.padding(Spacing.lg))
  .onLarge((v) => v.padding(Spacing.xl))
  .toElement();
```

**Platform-specific modifiers:**

```ts
import { Spacing, Radius } from '@/Tokens/Layout';

VStack(child)
  .onIOS((v) => v.cornerRadius(Radius.lg))
  .onAndroid((v) => v.cornerRadius(Radius.md))
  .toElement();
```

**Custom breakpoints:**

```ts
import { Spacing } from '@/Tokens/Layout';

VStack(child).responsive({
  compact: (v) => v.padding(Spacing.sm),
  custom: {
    'tablet-landscape': (v) => v.padding(Spacing.xl).frame({ maxWidth: 800 }),
  },
}).toElement();
```
