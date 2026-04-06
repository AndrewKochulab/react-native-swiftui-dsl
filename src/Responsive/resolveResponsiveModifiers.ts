import { Platform } from 'react-native';
import type { Modifier } from '@/Core/Modifier';
import { ViewBuilder } from '@/Core/ViewBuilder';
import { ElementType, ModifierType } from '@/Tokens/ElementType';
import type { ResponsiveContext, ResponsiveModifierFn } from './types';
import type { CustomBreakpoint } from '@/Theme/types';
import { matchesCustomBreakpoint } from './useResponsive';
import { SizeClass, DSLPlatform } from '@/Tokens/Interaction';

/**
 * Resolves responsive and platform modifiers into concrete modifiers.
 *
 * Responsive modifiers (responsive, onCompact, onRegular, onLarge) and
 * platform modifiers (onIOS, onAndroid) are expanded before computeStyles.
 */
export function resolveResponsiveModifiers(
  modifiers: ReadonlyArray<Modifier>,
  ctx: ResponsiveContext,
  customBreakpoints?: CustomBreakpoint[],
): Modifier[] {
  const result: Modifier[] = [];

  for (const mod of modifiers) {
    switch (mod.type) {
      case ModifierType.responsive: {
        // Check standard size class first
        const fn = mod.config[ctx.sizeClass];
        if (fn) {
          result.push(...extractModifiers(fn));
        }

        // Check custom breakpoints
        if (mod.config.custom && customBreakpoints) {
          for (const bp of customBreakpoints) {
            if (matchesCustomBreakpoint(ctx.width, bp) && mod.config.custom[bp.name]) {
              result.push(...extractModifiers(mod.config.custom[bp.name]));
            }
          }
        }
        break;
      }

      case ModifierType.onCompact:
        if (ctx.sizeClass === SizeClass.compact) {
          result.push(...extractModifiers(mod.apply));
        }
        break;

      case ModifierType.onRegular:
        if (ctx.sizeClass === SizeClass.regular) {
          result.push(...extractModifiers(mod.apply));
        }
        break;

      case ModifierType.onLarge:
        if (ctx.sizeClass === SizeClass.large) {
          result.push(...extractModifiers(mod.apply));
        }
        break;

      case ModifierType.onIOS:
        if (Platform.OS === DSLPlatform.ios) {
          result.push(...extractModifiers(mod.apply as ResponsiveModifierFn));
        }
        break;

      case ModifierType.onAndroid:
        if (Platform.OS === DSLPlatform.android) {
          result.push(...extractModifiers(mod.apply as ResponsiveModifierFn));
        }
        break;

      default:
        result.push(mod);
        break;
    }
  }

  return result;
}

/**
 * Applies a modifier function to a temporary ViewBuilder and extracts the resulting modifiers.
 */
function extractModifiers(fn: ResponsiveModifierFn): Modifier[] {
  const temp = new ViewBuilder(ElementType.fragment);
  fn(temp);
  return [...temp.modifiers];
}
