# DSLView -- Reusable Views

Class-based reusable view components with SwiftUI's `body()` pattern.

[<-- Back to README](../README.md)

> For implementation details, see [src/Core/README.md](../src/Core/README.md)
> See [examples/03-dsl-view.tsx](../examples/03-dsl-view.tsx)

---

## Basic Usage

```ts
import { DSLView, ViewBuilder, VStack, Text, Image, Button, Font, Spacing, Color, Radius, ButtonVariant, Alignment } from 'react-native-swiftui-dsl';

class ProfileCard extends DSLView<{ name: string; bio: string; avatar: string }> {
  body(): ViewBuilder {
    return VStack(
      Image({ uri: this.props.avatar }).frame({ width: 80, height: 80 }).cornerRadius(Radius.lg),
      Text(this.props.name).font(Font.title).bold(),
      Text(this.props.bio).font(Font.footnote).secondary(),
      Button('Edit', () => {}, { style: ButtonVariant.outlined }),
    )
    .padding(Spacing.lg)
    .background(Color.card)
    .cornerRadius(Radius.md)
    .alignment(Alignment.center)
    .spacing(12);
  }
}

// Usage -- returns ViewBuilder, fully chainable:
ProfileCard.build({ name: 'John', bio: 'Dev', avatar: 'https://...' })
  .shadow()
  .margin(Spacing.md)
```

## Nesting DSLViews

DSLViews compose naturally -- nest them inside each other:

```ts
class DashboardScreen extends DSLView<{ user: User }> {
  body(): ViewBuilder {
    return VStack(
      ProfileCard.build({ name: this.props.user.name, ... }),
      StatsCard.build({ stats: this.props.user.stats }),
    ).padding(Spacing.lg);
  }
}
```

## Key Points

- Extend `DSLView<Props>` with your props type
- Implement the `body()` method returning a `ViewBuilder`
- Use the static `build()` method to create instances -- returns a chainable `ViewBuilder`
- Access props via `this.props` inside `body()`
- The result is fully chainable -- apply additional modifiers after `.build()`
