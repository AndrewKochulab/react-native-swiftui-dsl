/**
 * Type guard and utility constants.
 * Eliminates raw typeof checks and hardcoded type strings throughout the framework.
 */

export enum JSType {
  string = 'string',
  number = 'number',
  boolean = 'boolean',
  object = 'object',
  function = 'function',
  symbol = 'symbol',
  undefined = 'undefined',
}

/** Type guard: checks if a value is a number. */
export function isNumber(value: unknown): value is number {
  return typeof value === JSType.number;
}

/** Type guard: checks if a value is a string. */
export function isString(value: unknown): value is string {
  return typeof value === JSType.string;
}

/** Type guard: checks if a value is a boolean. */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === JSType.boolean;
}

/** Type guard: checks if a value is a symbol. */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === JSType.symbol;
}

/** Type guard: checks if a value is a non-null object. */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === JSType.object && value !== null;
}

/** Type guard: checks if a value is null or undefined. */
export function isNil(value: unknown): value is null | undefined {
  return value == null;
}

/** Converts any value to its string representation. */
export function toString(value: unknown): string {
  return String(value);
}

/**
 * Color scheme field names used for normalizeColors detection.
 */
export enum ColorSchemeField {
  light = 'light',
  dark = 'dark',
}
