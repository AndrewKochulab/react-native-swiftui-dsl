/**
 * React hook for two-way form binding with internal state management.
 *
 * @example
 * ```ts
 * function SignUpForm() {
 *   const [fields, form, setForm] = useFormBinding({
 *     name: '',
 *     email: '',
 *     agreeToTerms: false,
 *   });
 *
 *   return VStack(
 *     TextInput(fields.name).inputLabel('Name').placeholder('Enter name'),
 *     TextInput(fields.email).inputLabel('Email').autoCapitalize(AutoCapitalize.none),
 *     Toggle(fields.agreeToTerms),
 *     Button('Submit', () => console.log(form), { style: ButtonVariant.filled }),
 *   ).padding(Spacing.lg).toElement();
 * }
 * ```
 */

import { useState, useMemo } from 'react';
import { bindForm, Binding } from './Binding';

type BindingMap<T extends object> = {
  readonly [K in keyof T]: Binding<T[K]>;
};

/**
 * Manages form state internally and returns bindings for each field.
 *
 * @param initialState - The initial form data object
 * @returns A tuple of [fields (bindings), current state, setState function]
 */
export function useFormBinding<T extends object>(
  initialState: T,
): [BindingMap<T>, T, React.Dispatch<React.SetStateAction<T>>] {
  const [form, setForm] = useState<T>(initialState);

  const fields = useMemo(
    () =>
      bindForm(form, (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
      }),
    [form],
  );

  return [fields, form, setForm];
}
