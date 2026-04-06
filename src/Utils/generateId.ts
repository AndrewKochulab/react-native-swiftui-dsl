/**
 * UUID v4 generation with cross-platform fallback.
 *
 * @example
 * ```ts
 * const id = generateId(); // "550e8400-e29b-41d4-a716-446655440000"
 * ```
 */
export function generateId(): string {
  // Use crypto.randomUUID if available (modern browsers, Node 19+)
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  // Fallback: manual UUID v4 generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
