# Testing

The framework works in tests with no special setup, thanks to config-free defaults.

[<-- Back to README](../README.md)

> For implementation details, see [src/Core/README.md](../src/Core/README.md)

---

## Basic Testing

```tsx
import { render } from '@testing-library/react-native';
import { Text, Font } from 'react-native-swiftui-dsl';

it('renders styled text', () => {
  const { getByText } = render(
    Text('Hello').font(Font.title).bold().toElement()
  );
  expect(getByText('Hello')).toBeTruthy();
});
```

## Testing with Theme / Dark Mode

For tests that need a specific theme or dark mode, wrap with `DSLThemeProvider`:

```tsx
import { render } from '@testing-library/react-native';
import { DSLThemeProvider, ColorScheme as ColorSchemeValue } from 'react-native-swiftui-dsl';

export function renderWithDSLTheme(
  ui: React.ReactElement,
  colorScheme: ColorSchemeValue = ColorSchemeValue.light,
) {
  return render(ui, {
    wrapper: ({ children }) => (
      <DSLThemeProvider config={yourThemeConfig} colorScheme={colorScheme}>
        {children}
      </DSLThemeProvider>
    ),
  });
}
```

## Key Points

- No `DSLThemeProvider` required -- `useDSLTheme()` returns `defaultThemeConfig` with `colorScheme: ColorSchemeValue.light` in test environments
- All tokens, modifiers, and primitives work out of the box
- Use `renderWithDSLTheme` helper for dark mode or custom theme tests
- Use `.testID('my-id')` modifier for targeting elements in tests
