import {
  SpacingToken,
  BorderRadiusToken,
  FontSizeToken,
  FontWeightToken,
  DSLLayout,
  DSLFonts,
} from '../Theme/types';
import { ColorValue } from './ThemeResolver';

export type { SpacingToken, BorderRadiusToken, FontSizeToken, FontWeightToken };

export type PaddingEdge =
  | 'all'
  | 'horizontal'
  | 'vertical'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right';

export type Modifier =
  // Layout
  | { type: 'padding'; value: number | SpacingToken; edge: PaddingEdge }
  | { type: 'margin'; value: number | SpacingToken; edge: PaddingEdge }
  | { type: 'background'; color: ColorValue }
  | { type: 'backgroundAlpha'; color: ColorValue; alphaHex: string }
  | { type: 'foregroundColor'; color: ColorValue }
  | { type: 'cornerRadius'; value: number | BorderRadiusToken }
  | { type: 'font'; size: FontSizeToken | number }
  | { type: 'fontWeight'; weight: FontWeightToken }
  | { type: 'flex'; value: number }
  | { type: 'frame'; width?: number; height?: number; minWidth?: number; maxWidth?: number; minHeight?: number; maxHeight?: number; alignment?: 'center' | 'leading' | 'trailing' }
  | { type: 'border'; width: number; color: ColorValue }
  | { type: 'borderStyle'; value: 'solid' | 'dotted' | 'dashed' }
  | { type: 'shadow'; color: ColorValue; offset: { width: number; height: number }; opacity: number; radius: number; elevation?: number }
  | { type: 'opacity'; value: number }
  | { type: 'spacing'; value: number }
  | { type: 'alignment'; value: 'center' | 'leading' | 'trailing' | 'stretch' }
  | { type: 'justifyContent'; value: 'flexStart' | 'flexEnd' | 'center' | 'spaceBetween' | 'spaceAround' | 'spaceEvenly' }
  | { type: 'alignItems'; value: 'flexStart' | 'flexEnd' | 'center' | 'stretch' | 'baseline' }
  | { type: 'flexWrap'; value: 'wrap' | 'nowrap' }
  | { type: 'gap'; value: number }
  // Text
  | { type: 'textTransform'; value: 'uppercase' | 'lowercase' | 'capitalize' | 'none' }
  | { type: 'letterSpacing'; value: number }
  | { type: 'lineHeight'; value: number }
  | { type: 'textAlign'; value: 'left' | 'center' | 'right' | 'auto' }
  | { type: 'lineLimit'; value: number }
  // Interaction
  | { type: 'onTap'; handler: () => void }
  | { type: 'disabled'; value: boolean }
  // Accessibility
  | { type: 'accessibilityLabel'; value: string }
  | { type: 'testID'; value: string }
  // SafeArea
  | { type: 'safeAreaEdges'; value: ('top' | 'bottom' | 'left' | 'right')[] }
  // Scroll
  | { type: 'hideScrollIndicator'; value: boolean }
  | { type: 'scrollContentPadding'; value: number | SpacingToken; edge: PaddingEdge }
  | { type: 'scrollDirection'; value: 'horizontal' }
  | { type: 'keyboardAvoiding'; offset: number }
  | { type: 'keyboardPersistTaps'; value: 'always' | 'never' | 'handled' }
  | { type: 'bounces'; value: boolean }
  // TextInput
  | { type: 'placeholder'; value: string }
  | { type: 'inputLabel'; text: string }
  | { type: 'inputError'; message: string | undefined }
  | { type: 'keyboardType'; value: string }
  | { type: 'multiline'; lines?: number }
  | { type: 'secureEntry' }
  | { type: 'autoCapitalize'; value: 'none' | 'sentences' | 'words' | 'characters' }
  | { type: 'returnKeyType'; value: string }
  | { type: 'maxLength'; value: number }
  | { type: 'inputHeight'; value: number }
  // Screen Navigation
  | { type: 'screenTitle'; value: string }
  | { type: 'headerRight'; component: () => React.ReactElement }
  | { type: 'headerLeft'; component: () => React.ReactElement }
  // Position & Layout (new)
  | { type: 'position'; value: 'absolute' | 'relative' }
  | { type: 'positionEdges'; top?: number; left?: number; right?: number; bottom?: number }
  | { type: 'zIndex'; value: number }
  | { type: 'overflow'; value: 'hidden' | 'visible' | 'scroll' }
  | { type: 'aspectRatio'; value: number }
  | { type: 'alignSelf'; value: 'auto' | 'flexStart' | 'flexEnd' | 'center' | 'stretch' | 'baseline' }
  | { type: 'display'; value: 'none' | 'flex' }
  | { type: 'hidden'; value: boolean }
  // Text (new)
  | { type: 'textDecoration'; value: 'none' | 'underline' | 'line-through' | 'underline line-through' }
  | { type: 'fontStyle'; value: 'normal' | 'italic' }
  | { type: 'fontFamily'; value: string }
  // Interaction (new)
  | { type: 'onLongPress'; handler: () => void }
  // Accessibility (new)
  | { type: 'accessibilityRole'; value: string }
  | { type: 'accessibilityHint'; value: string }
  // List (new)
  | { type: 'refreshControl'; onRefresh: () => void; refreshing: boolean }
  | { type: 'onEndReached'; handler: () => void; threshold?: number }
  | { type: 'separator'; builder: () => unknown }
  | { type: 'numColumns'; value: number }
  | { type: 'emptyComponent'; builder: () => unknown }
  // Modal
  | { type: 'onDismiss'; handler: () => void };

export function resolveSpacing(value: number | SpacingToken, layout: DSLLayout): number {
  if (typeof value === 'number') return value;
  return layout.spacing[value];
}

export function resolveBorderRadius(value: number | BorderRadiusToken, layout: DSLLayout): number {
  if (typeof value === 'number') return value;
  return layout.borderRadius[value];
}

export function resolveFontSize(value: FontSizeToken | number, fonts: DSLFonts): number {
  if (typeof value === 'number') return value;
  return fonts.size[value];
}
