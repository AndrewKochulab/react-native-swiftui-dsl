# Bindings

Two-way data flow inspired by SwiftUI's `$` binding syntax.

[<-- Back to README](../README.md)

> For implementation details, see [src/Binding/README.md](../src/Binding/README.md)
> See [examples/01-basic-usage.tsx](../examples/01-basic-usage.tsx)

---

## createBinding

Creates a single binding for one value:

```ts
const [name, setName] = useState('');
const $name = createBinding(name, setName);

TextInput($name).placeholder('Your name')
```

## bindForm

Creates bindings for **all fields** of a form object at once using a Proxy:

```ts
const [form, setForm] = useState({ title: '', notes: '', rating: 0 });

const $form = bindForm(form, (key, value) => {
  setForm((prev) => ({ ...prev, [key]: value }));
});

VStack(
  TextInput($form.title).inputLabel('Title'),
  TextInput($form.notes).inputLabel('Notes').multiline(4),
)
```

Bindings are **cached** -- accessing the same field returns the same `Binding` instance unless the value changes.

## Form Example

Two-way bindings make forms effortless -- no manual `value` / `onChangeText` wiring:

```ts
import { VStack, TextInput, Toggle, Button, bindForm, Spacing, ButtonVariant, AutoCapitalize } from 'react-native-swiftui-dsl';

function buildSettingsForm(form: FormData, setForm: Setter) {
  const $form = bindForm(form, (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  });

  return VStack(
    TextInput($form.name)
      .inputLabel('Display Name')
      .placeholder('Enter your name'),

    TextInput($form.email)
      .inputLabel('Email')
      .keyboardType('email-address')
      .autoCapitalize(AutoCapitalize.none),

    TextInput($form.bio)
      .inputLabel('Bio')
      .multiline(4)
      .maxLength(200),

    Toggle($form.notifications, { label: 'Push Notifications' }),

    Button('Save', () => handleSave(), { style: ButtonVariant.filled }),
  )
  .padding(Spacing.lg)
  .spacing(16);
}
```

## Conditionals

### If

```ts
VStack(
  If(isLoggedIn,
    () => Text('Welcome back!'),
    () => Button('Log In', login),
  ),
)
```

### ForEach

```ts
VStack(
  ...ForEach(users, (u) => u.id, (user) =>
    HStack(
      Text(user.name).bold(),
      Spacer(),
      Text(user.role).secondary(),
    )
  ),
)
```

### Group

Groups children without adding a wrapper view (renders as `React.Fragment`):

```ts
Group(
  Text('First'),
  Text('Second'),
)
```
