/**
 * Exhaustive check utility for discriminated unions.
 *
 * Use in the default case of switch statements to ensure all cases are handled.
 * TypeScript will error at compile time if a case is missing.
 *
 * @example
 * ```ts
 * switch (state.type) {
 *   case ScreenStateType.loading: return renderLoading();
 *   case ScreenStateType.content: return renderContent(state.data);
 *   case ScreenStateType.error: return renderError(state.error);
 *   default: return assertNever(state);
 * }
 * ```
 */
export function assertNever(value: never, message?: string): never {
  throw new Error(message ?? `Unhandled discriminated union member: ${JSON.stringify(value)}`);
}
