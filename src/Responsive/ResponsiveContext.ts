import { createContext, useContext } from 'react';
import type { ResponsiveContext as ResponsiveContextType, SizeClassToken } from './types';
import { SizeClass } from '@/Tokens/Interaction';

/**
 * React context that provides responsive information (size class, orientation, dimensions)
 * to all DSL components within the tree.
 */
export const ResponsiveCtx = createContext<ResponsiveContextType | null>(null);

/**
 * Returns the full responsive context, or null if no ResponsiveProvider is present.
 */
export function useResponsiveContext(): ResponsiveContextType | null {
  return useContext(ResponsiveCtx);
}

/**
 * Returns the current size class token.
 * Falls back to 'compact' when no responsive provider is present.
 */
export function useSizeClass(): SizeClassToken {
  const ctx = useContext(ResponsiveCtx);
  return ctx?.sizeClass ?? SizeClass.compact;
}
