import type {
  SpacingToken,
  BorderRadiusToken,
  FontSizeToken,
  FontWeightToken,
  DSLLayout,
  DSLFonts,
} from '@theme';
import { ColorValue } from './ThemeResolver';
import {
  isNumber, ModifierType, type EdgeToken, type AlignmentToken, type FrameAlignmentToken,
  type JustifyContentToken, type AlignItemsToken, type AlignSelfToken, type FlexWrapToken,
  type TextTransformToken, type TextAlignToken, type TextDecorationToken, type FontStyleToken,
  type BorderStyleToken, type PositionToken, type OverflowToken, type DisplayToken,
  type AutoCapitalizeToken, type KeyboardBehaviorToken, type KeyboardPersistTapsToken,
  type ScrollDirectionToken, type SwipeDirectionToken,
} from '@tokens';
import type { AnimationConfig, TransitionConfig } from '@animation';
import type {
  PanGestureState, PinchGestureState, RotationGestureState, PanGestureConfig, PinchGestureConfig,
  RotationGestureConfig, GestureConfig,
} from '@gesture';
import type { ResponsiveConfig, ResponsiveModifierFn } from '@responsive';

export type { SpacingToken, BorderRadiusToken, FontSizeToken, FontWeightToken };

export type PaddingEdge = EdgeToken;

export type Modifier =
  // Layout
  | { type: ModifierType.padding; value: number | SpacingToken; edge: PaddingEdge }
  | { type: ModifierType.margin; value: number | SpacingToken; edge: PaddingEdge }
  | { type: ModifierType.background; color: ColorValue }
  | { type: ModifierType.backgroundAlpha; color: ColorValue; alphaHex: string }
  | { type: ModifierType.foregroundColor; color: ColorValue }
  | { type: ModifierType.cornerRadius; value: number | BorderRadiusToken }
  | { type: ModifierType.font; size: FontSizeToken | number }
  | { type: ModifierType.fontWeight; weight: FontWeightToken }
  | { type: ModifierType.flex; value: number }
  | { type: ModifierType.frame; width?: number; height?: number; minWidth?: number; maxWidth?: number; minHeight?: number; maxHeight?: number; alignment?: FrameAlignmentToken }
  | { type: ModifierType.border; width: number; color: ColorValue }
  | { type: ModifierType.borderStyle; value: BorderStyleToken }
  | { type: ModifierType.shadow; color: ColorValue; offset: { width: number; height: number }; opacity: number; radius: number; elevation?: number }
  | { type: ModifierType.opacity; value: number }
  | { type: ModifierType.spacing; value: number }
  | { type: ModifierType.alignment; value: AlignmentToken }
  | { type: ModifierType.justifyContent; value: JustifyContentToken }
  | { type: ModifierType.alignItems; value: AlignItemsToken }
  | { type: ModifierType.flexWrap; value: FlexWrapToken }
  | { type: ModifierType.gap; value: number }
  // Text
  | { type: ModifierType.textTransform; value: TextTransformToken }
  | { type: ModifierType.letterSpacing; value: number }
  | { type: ModifierType.lineHeight; value: number }
  | { type: ModifierType.textAlign; value: TextAlignToken }
  | { type: ModifierType.lineLimit; value: number }
  // Interaction
  | { type: ModifierType.onTap; handler: () => void }
  | { type: ModifierType.disabled; value: boolean }
  // Accessibility
  | { type: ModifierType.accessibilityLabel; value: string }
  | { type: ModifierType.testID; value: string }
  // SafeArea
  | { type: ModifierType.safeAreaEdges; value: EdgeToken[] }
  // Scroll
  | { type: ModifierType.hideScrollIndicator; value: boolean }
  | { type: ModifierType.scrollContentPadding; value: number | SpacingToken; edge: PaddingEdge }
  | { type: ModifierType.scrollDirection; value: ScrollDirectionToken }
  | { type: ModifierType.keyboardAvoiding; offset: number; behavior?: KeyboardBehaviorToken }
  | { type: ModifierType.keyboardPersistTaps; value: KeyboardPersistTapsToken }
  | { type: ModifierType.bounces; value: boolean }
  // TextInput
  | { type: ModifierType.placeholder; value: string }
  | { type: ModifierType.inputLabel; text: string }
  | { type: ModifierType.inputError; message: string | undefined }
  | { type: ModifierType.keyboardType; value: string }
  | { type: ModifierType.multiline; lines?: number }
  | { type: ModifierType.secureEntry }
  | { type: ModifierType.autoCapitalize; value: AutoCapitalizeToken }
  | { type: ModifierType.returnKeyType; value: string }
  | { type: ModifierType.maxLength; value: number }
  | { type: ModifierType.inputHeight; value: number }
  | { type: ModifierType.inputRef; ref: React.RefObject<unknown> }
  | { type: ModifierType.onSubmitEditing; handler: () => void }
  // Screen Navigation
  | { type: ModifierType.screenTitle; value: string }
  | { type: ModifierType.headerRight; component: () => React.ReactElement }
  | { type: ModifierType.headerLeft; component: () => React.ReactElement }
  // Position & Layout
  | { type: ModifierType.position; value: PositionToken }
  | { type: ModifierType.positionEdges; top?: number; left?: number; right?: number; bottom?: number }
  | { type: ModifierType.zIndex; value: number }
  | { type: ModifierType.overflow; value: OverflowToken }
  | { type: ModifierType.aspectRatio; value: number }
  | { type: ModifierType.alignSelf; value: AlignSelfToken }
  | { type: ModifierType.display; value: DisplayToken }
  | { type: ModifierType.hidden; value: boolean }
  // Text decoration
  | { type: ModifierType.textDecoration; value: TextDecorationToken }
  | { type: ModifierType.fontStyle; value: FontStyleToken }
  | { type: ModifierType.fontFamily; value: string }
  // Interaction
  | { type: ModifierType.onLongPress; handler: () => void }
  // Accessibility
  | { type: ModifierType.accessibilityRole; value: string }
  | { type: ModifierType.accessibilityHint; value: string }
  // List
  | { type: ModifierType.refreshControl; onRefresh: () => void; refreshing: boolean }
  | { type: ModifierType.onEndReached; handler: () => void; threshold?: number }
  | { type: ModifierType.separator; builder: () => unknown }
  | { type: ModifierType.numColumns; value: number }
  | { type: ModifierType.emptyComponent; builder: () => unknown }
  // Modal
  | { type: ModifierType.onDismiss; handler: () => void }
  // Transform
  | { type: ModifierType.offset; x: number; y: number }
  | { type: ModifierType.rotation; degrees: number }
  | { type: ModifierType.scale; x: number; y: number }
  | { type: ModifierType.blur; radius: number }
  | { type: ModifierType.overlay; builder: () => unknown }
  // Platform
  | { type: ModifierType.onIOS; apply: (view: unknown) => unknown }
  | { type: ModifierType.onAndroid; apply: (view: unknown) => unknown }
  // Responsive
  | { type: ModifierType.responsive; config: ResponsiveConfig }
  | { type: ModifierType.onCompact; apply: ResponsiveModifierFn }
  | { type: ModifierType.onRegular; apply: ResponsiveModifierFn }
  | { type: ModifierType.onLarge; apply: ResponsiveModifierFn }
  // Animation
  | { type: ModifierType.animation; config: AnimationConfig; value: unknown }
  | { type: ModifierType.transition; enter: TransitionConfig; exit: TransitionConfig }
  // Gesture
  | { type: ModifierType.onSwipe; direction: SwipeDirectionToken; handler: () => void; threshold?: number; velocityThreshold?: number }
  | { type: ModifierType.onPan; onStart?: (state: PanGestureState) => void; onChanged: (state: PanGestureState) => void; onEnded?: (state: PanGestureState) => void; config?: PanGestureConfig }
  | { type: ModifierType.onPinch; onChanged: (state: PinchGestureState) => void; onEnded?: (state: PinchGestureState) => void; config?: PinchGestureConfig }
  | { type: ModifierType.onRotate; onChanged: (state: RotationGestureState) => void; onEnded?: (state: RotationGestureState) => void; config?: RotationGestureConfig }
  | { type: ModifierType.gesture; config: GestureConfig }
  // Environment
  | { type: ModifierType.environment; key: string; value: unknown };

export function resolveSpacing(value: number | SpacingToken, layout: DSLLayout): number {
  if (isNumber(value)) return value;
  return layout.spacing[value];
}

export function resolveBorderRadius(value: number | BorderRadiusToken, layout: DSLLayout): number {
  if (isNumber(value)) return value;
  return layout.borderRadius[value];
}

export function resolveFontSize(value: FontSizeToken | number, fonts: DSLFonts): number {
  if (isNumber(value)) return value;
  return fonts.size[value];
}
