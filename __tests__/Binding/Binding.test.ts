import { createBinding, bindForm, Binding } from '@binding';

describe('createBinding', () => {
  it('creates a binding with value and update', () => {
    const update = jest.fn();
    const binding = createBinding('hello', update);
    expect(binding.value).toBe('hello');
    expect(binding.update).toBe(update);
  });

  it('calls update when invoked', () => {
    const update = jest.fn();
    const binding = createBinding<string>('initial', update);
    binding.update('new value');
    expect(update).toHaveBeenCalledWith('new value');
  });

  it('works with number values', () => {
    const update = jest.fn();
    const binding = createBinding<number>(42, update);
    expect(binding.value).toBe(42);
    binding.update(100);
    expect(update).toHaveBeenCalledWith(100);
  });

  it('works with boolean values', () => {
    const update = jest.fn();
    const binding = createBinding<boolean>(false, update);
    expect(binding.value).toBe(false);
    binding.update(true);
    expect(update).toHaveBeenCalledWith(true);
  });
});

describe('bindForm', () => {
  interface TestForm {
    name: string;
    age: number;
    active: boolean;
  }

  const formData: TestForm = {
    name: 'John',
    age: 30,
    active: true,
  };

  it('creates bindings for each field', () => {
    const setter = jest.fn();
    const $form = bindForm(formData, setter);

    expect($form.name.value).toBe('John');
    expect($form.age.value).toBe(30);
    expect($form.active.value).toBe(true);
  });

  it('calls setter with key and value on update', () => {
    const setter = jest.fn();
    const $form = bindForm(formData, setter);

    $form.name.update('Jane');
    expect(setter).toHaveBeenCalledWith('name', 'Jane');
  });

  it('calls setter with correct key for different fields', () => {
    const setter = jest.fn();
    const $form = bindForm(formData, setter);

    $form.age.update(25);
    expect(setter).toHaveBeenCalledWith('age', 25);

    $form.active.update(false);
    expect(setter).toHaveBeenCalledWith('active', false);
  });

  it('caches bindings for the same value', () => {
    const setter = jest.fn();
    const $form = bindForm(formData, setter);

    const first = $form.name;
    const second = $form.name;
    expect(first).toBe(second);
  });

  it('returns new binding when value changes', () => {
    const setter = jest.fn();
    let data = { title: 'Hello' };
    const $form = bindForm(data, setter);

    const first = $form.title;
    expect(first.value).toBe('Hello');

    // Simulate data change
    data = { title: 'World' };
    const $form2 = bindForm(data, setter);
    const second = $form2.title;
    expect(second.value).toBe('World');
  });

  it('returns undefined for symbol properties', () => {
    const setter = jest.fn();
    const $form = bindForm(formData, setter);
    const sym = Symbol('test');
    expect(($form as any)[sym]).toBeUndefined();
  });
});
