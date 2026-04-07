/**
 * Two-way binding system for DSL form inputs.
 *
 * Inspired by SwiftUI's `$` binding syntax.
 * Usage:
 *   const $form = bindForm(viewModel.state.formData, (key, value) => viewModel.updateField(key, value));
 *   TextInput($form.title).placeholder('Enter title')
 */

import { isSymbol } from '@tokens';

export interface Binding<T> {
  readonly value: T;
  readonly update: (newValue: T) => void;
}

export function createBinding<T>(value: T, update: (newValue: T) => void): Binding<T> {
  return { value, update };
}

type BindingMap<T extends object> = {
  readonly [K in keyof T]: Binding<T[K]>;
};

export function bindForm<T extends object>(
  data: T,
  setter: (key: keyof T & string, value: unknown) => void,
): BindingMap<T> {
  const cache = new Map<string | symbol, Binding<unknown>>();

  return new Proxy({} as BindingMap<T>, {
    get(_target, prop: string | symbol) {
      if (isSymbol(prop)) return undefined;

      const key = prop as keyof T & string;
      const cached = cache.get(key);
      const currentValue = (data as Record<string, unknown>)[key];

      if (cached && cached.value === currentValue) {
        return cached;
      }

      const binding: Binding<T[typeof key]> = {
        value: currentValue as T[typeof key],
        update: (newValue: T[typeof key]) => setter(key, newValue),
      };

      cache.set(key, binding as Binding<unknown>);
      return binding;
    },
  });
}
