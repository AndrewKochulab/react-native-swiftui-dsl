# Conditionals

Declarative control-flow helpers that integrate naturally into the DSL's builder pattern. These functions let you express conditional rendering, iteration, and grouping without breaking out of the fluent API.

## Files

| File | Purpose |
|------|---------|
| `If.ts` | Conditional rendering (if/else) |
| `ForEach.ts` | Data-driven iteration |
| `Group.ts` | Fragment-style grouping of children |

## API Reference

### `If(condition, thenBuilder, elseBuilder?)`

Conditionally returns one of two DSL children based on a boolean condition.

```ts
function If(
  condition: boolean,
  thenBuilder: () => DSLChild,
  elseBuilder?: () => DSLChild,
): DSLChild
```

**Example:**

```ts
import { If, Text, Spinner, VStack } from 'react-native-swiftui-dsl';

VStack(
  Text('My Screen').font('title').bold(),
  If(
    isLoading,
    () => Spinner(),
    () => Text('Content loaded'),
  ),
).toElement();
```

### `ForEach<T>(data, keyExtractor, builder)`

Maps over a read-only array, producing a `DSLChild` for each element. The `keyExtractor` parameter is available for semantic key assignment (used when the result is spread into a container).

```ts
function ForEach<T>(
  data: ReadonlyArray<T>,
  keyExtractor: (item: T, index: number) => string | number,
  builder: (item: T, index: number) => DSLChild,
): DSLChild[]
```

**Example:**

```ts
import { ForEach, Text, VStack } from 'react-native-swiftui-dsl';

interface Task {
  id: string;
  title: string;
}

const tasks: Task[] = [
  { id: '1', title: 'Buy groceries' },
  { id: '2', title: 'Walk the dog' },
];

VStack(
  ...ForEach(
    tasks,
    (task) => task.id,
    (task) => Text(task.title).padding(),
  ),
).toElement();
```

### `Group(...children)`

Wraps multiple DSL children into a single `ViewBuilder` of type `'fragment'`. When rendered, the children appear without an extra wrapping `View`, similar to `React.Fragment`.

```ts
function Group(...children: DSLChild[]): ViewBuilder
```

**Example:**

```ts
import { Group, Text, Divider } from 'react-native-swiftui-dsl';

const header = Group(
  Text('Section Title').font('title').bold(),
  Divider(),
);

// Use inside another container
VStack(
  header,
  Text('Body content'),
).toElement();
```
