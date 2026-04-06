import { createContext, useContext } from 'react';

/**
 * Environment values context.
 * Allows parent views to pass values down the tree without prop drilling.
 *
 * @example
 * ```ts
 * // Parent sets environment value:
 * VStack(children).environment('accentColor', Color.tint)
 *
 * // Child reads environment value:
 * const color = useEnvironment<string>('accentColor', Color.tint);
 * ```
 */

export type EnvironmentValues = Record<string, unknown>;

export const EnvironmentCtx = createContext<EnvironmentValues>({});

/**
 * Reads an environment value set by a parent view's .environment() modifier.
 *
 * @param key - The environment key to read
 * @param defaultValue - Fallback value if the key is not set
 * @returns The environment value, or defaultValue if not found
 */
export function useEnvironment<T>(key: string, defaultValue?: T): T | undefined {
  const env = useContext(EnvironmentCtx);
  return (env[key] as T) ?? defaultValue;
}
