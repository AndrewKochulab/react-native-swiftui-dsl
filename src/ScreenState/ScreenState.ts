/**
 * Screen state discriminated unions for common UI patterns.
 * Use with React state management to model loading/content/error flows.
 */

/** Screen state type discriminants. */
export enum ScreenStateType {
  loading = 'loading',
  content = 'content',
  error = 'error',
  empty = 'empty',
  idle = 'idle',
  running = 'running',
  failed = 'failed',
  submitting = 'submitting',
  success = 'success',
  ready = 'ready',
  loadError = 'loadError',
  submitError = 'submitError',
}

// --- Data Screen State ---

/**
 * Represents a screen that loads and displays a single data object.
 *
 * @example
 * ```ts
 * const [state, setState] = useState<DataScreenState<User>>({ type: ScreenStateType.loading });
 *
 * // After fetch:
 * setState({ type: ScreenStateType.content, data: user });
 *
 * // On error:
 * setState({ type: ScreenStateType.error, error: 'Failed to load user' });
 * ```
 */
export type DataScreenState<Content> =
  | { type: ScreenStateType.loading }
  | { type: ScreenStateType.content; data: Content }
  | { type: ScreenStateType.error; error: string };

// --- List Screen State ---

/**
 * Represents a screen that displays a list of items with empty state support.
 */
export type ListScreenState<Item> =
  | { type: ScreenStateType.loading }
  | { type: ScreenStateType.content; items: Item[] }
  | { type: ScreenStateType.empty }
  | { type: ScreenStateType.error; error: string };

// --- Async Operation State ---

/**
 * Represents the state of an asynchronous operation (e.g., a button action).
 */
export type AsyncOpState =
  | { type: ScreenStateType.idle }
  | { type: ScreenStateType.running }
  | { type: ScreenStateType.failed; error: string };

// --- Form Load State ---

/**
 * Represents the loading phase of a form (loading initial data, then ready to edit).
 */
export type FormLoadState<FormData> =
  | { type: ScreenStateType.idle }
  | { type: ScreenStateType.loading }
  | { type: ScreenStateType.ready; data: FormData }
  | { type: ScreenStateType.loadError; error: string };

// --- Form Submit State ---

/**
 * Represents the submission phase of a form.
 */
export type FormSubmitState =
  | { type: ScreenStateType.idle }
  | { type: ScreenStateType.submitting }
  | { type: ScreenStateType.success }
  | { type: ScreenStateType.submitError; error: string };

// --- Helpers ---

/** Creates a loading state. */
export function loadingState(): { type: ScreenStateType.loading } {
  return { type: ScreenStateType.loading };
}

/** Creates a content state with data. */
export function contentState<T>(data: T): { type: ScreenStateType.content; data: T } {
  return { type: ScreenStateType.content, data };
}

/** Creates an error state. */
export function errorState(error: string): { type: ScreenStateType.error; error: string } {
  return { type: ScreenStateType.error, error };
}

/** Creates an empty state. */
export function emptyState(): { type: ScreenStateType.empty } {
  return { type: ScreenStateType.empty };
}

/** Creates a list content state. */
export function listContentState<T>(items: T[]): { type: ScreenStateType.content; items: T[] } {
  return { type: ScreenStateType.content, items };
}
