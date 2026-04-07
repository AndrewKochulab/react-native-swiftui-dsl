/**
 * Global type declarations for react-native-swiftui-dsl.
 *
 * These declarations make all DSL types available globally when
 * `import 'react-native-swiftui-dsl/globals'` is used.
 */

import type {
  ViewBuilder, DSLChild, DSLElementType, ViewModifier as ViewModifierClass, ViewModifierFn,
  DSLView as DSLViewClass, ColorValue,
} from '@core';
import type { Binding } from '@binding';
import type {
  LazyListOptions, ImageSource, ButtonStyle, ModalAnimationType, SectionData, SectionedListOptions,
} from '@primitives';
import type { DSLThemeConfig, ColorScheme, DSLThemeContextValue } from '@theme';
import type { AnimationConfig, TransitionConfig, AnimationPresets } from '@animation';
import type {
  ResponsiveConfig, ResponsiveModifierFn, ResponsiveContext as ResponsiveContextType,
} from '@responsive';
import type {
  SpinnerSizeToken, ImageResizeToken, SizeClassToken, BreakpointDefinition,
} from '@tokens';

declare global {
  // --- Primitives ---
  function Text(content: string): ViewBuilder;
  function VStack(...children: DSLChild[]): ViewBuilder;
  function HStack(...children: DSLChild[]): ViewBuilder;
  function ZStack(...children: DSLChild[]): ViewBuilder;
  function Icon(name: string, options?: { size?: number; color?: ColorValue }): ViewBuilder;
  function Spacer(): ViewBuilder;
  function Raw(element: React.ReactElement): ViewBuilder;
  function SafeArea(...children: DSLChild[]): ViewBuilder;
  function ScrollStack(...children: DSLChild[]): ViewBuilder;
  function TextInput(binding: Binding<string>): ViewBuilder;
  function Spinner(size?: SpinnerSizeToken): ViewBuilder;
  function LazyList<T>(data: ReadonlyArray<T>, options: LazyListOptions<T>): ViewBuilder;
  function Image(source: ImageSource, options?: { resizeMode?: ImageResizeToken; alt?: string }): ViewBuilder;
  function Toggle(binding: Binding<boolean>, options?: { trackColor?: ColorValue; thumbColor?: ColorValue }): ViewBuilder;
  function Button(title: string, action: () => void, options?: { style?: ButtonStyle; icon?: string }): ViewBuilder;
  function Divider(): ViewBuilder;
  function Link(title: string, url: string): ViewBuilder;
  function SectionedList<T>(sections: ReadonlyArray<SectionData<T>>, options: SectionedListOptions<T>): ViewBuilder;
  function Modal(isPresented: Binding<boolean>, options?: { animationType?: ModalAnimationType; transparent?: boolean }, ...children: DSLChild[]): ViewBuilder;
  function ProgressBar(value: number, options?: { trackColor?: ColorValue; color?: ColorValue }): ViewBuilder;

  // --- Conditionals ---
  function If(condition: boolean, thenBuilder: () => DSLChild, elseBuilder?: () => DSLChild): DSLChild;
  function ForEach<T>(data: T[], keyExtractor: (item: T) => string, builder: (item: T) => ViewBuilder): DSLChild[];
  function Group(...children: DSLChild[]): ViewBuilder;

  // --- Core ---
  function DSLRenderer(props: { builder: ViewBuilder }): React.ReactElement;
  function DSLThemeProvider(props: { config: DSLThemeConfig; colorScheme: ColorScheme; children: React.ReactNode }): React.ReactElement;
  function isViewBuilder(value: unknown): value is ViewBuilder;

  // --- ViewModifier ---
  const ViewModifier: typeof ViewModifierClass;
  function composeModifiers(...modifiers: (ViewModifierClass | ViewModifierFn)[]): ViewModifierFn;
  function createModifiers<K extends string>(definitions: Record<K, ViewModifierFn>): Readonly<Record<K, ViewModifierFn>>;

  // --- DSLView ---
  const DSLView: typeof DSLViewClass;

  // --- Binding ---
  function createBinding<T>(value: T, update: (newValue: T) => void): Binding<T>;
  function bindForm<T extends object>(data: T, setter: (key: keyof T & string, value: unknown) => void): { [K in keyof T]: Binding<T[K]> };

  // --- Theme ---
  function useDSLTheme(): DSLThemeContextValue;
  function normalizeColors(colors: import('@theme').DSLColorConfig): { light: import('@theme').DSLColors; dark: import('@theme').DSLColors };
  function resolveColor(value: ColorValue, theme: ColorScheme, colors: import('@theme').DSLColorConfig): string;

  // --- Animation ---
  const Animation: AnimationPresets;
  function withAnimation(config: AnimationConfig | undefined, callback: () => void): void;

  // --- Responsive ---
  function useResponsive(breakpointOverrides?: Partial<BreakpointDefinition>): ResponsiveContextType;
  function useResponsiveContext(): ResponsiveContextType | null;
  function useSizeClass(): SizeClassToken;

  // --- Environment ---
  function useEnvironment<T>(key: string, defaultValue?: T): T | undefined;

  // --- Tokens ---
  const Color: typeof import('@tokens').Color;
  const Font: typeof import('@tokens').Font;
  const Weight: typeof import('@tokens').Weight;
  const Spacing: typeof import('@tokens').Spacing;
  const Radius: typeof import('@tokens').Radius;
  const Edge: typeof import('@tokens').Edge;
  const TextAlign: typeof import('@tokens').TextAlign;
  const TextDecoration: typeof import('@tokens').TextDecoration;
  const TextTransform: typeof import('@tokens').TextTransform;
  const FontStyle: typeof import('@tokens').FontStyle;
  const BorderStyle: typeof import('@tokens').BorderStyle;
  const Position: typeof import('@tokens').Position;
  const Overflow: typeof import('@tokens').Overflow;
  const Display: typeof import('@tokens').Display;
  const FlexWrap: typeof import('@tokens').FlexWrap;
  const FlexDirection: typeof import('@tokens').FlexDirection;
  const JustifyContent: typeof import('@tokens').JustifyContent;
  const AlignItems: typeof import('@tokens').AlignItems;
  const AlignSelf: typeof import('@tokens').AlignSelf;
  const Alignment: typeof import('@tokens').Alignment;
  const Easing: typeof import('@tokens').Easing;
  const AnimationType: typeof import('@tokens').AnimationType;
  const Transition: typeof import('@tokens').Transition;
  const TransitionEdge: typeof import('@tokens').TransitionEdge;
  const ButtonVariant: typeof import('@tokens').ButtonVariant;
  const SpinnerSize: typeof import('@tokens').SpinnerSize;
  const ModalAnimation: typeof import('@tokens').ModalAnimation;
  const ImageResize: typeof import('@tokens').ImageResize;
  const AutoCapitalize: typeof import('@tokens').AutoCapitalize;
  const KeyboardBehavior: typeof import('@tokens').KeyboardBehavior;
  const KeyboardPersistTaps: typeof import('@tokens').KeyboardPersistTaps;
  const ScrollDirection: typeof import('@tokens').ScrollDirection;
  const AccessibilityRole: typeof import('@tokens').AccessibilityRole;
  const SwipeDirection: typeof import('@tokens').SwipeDirection;
  const SizeClass: typeof import('@tokens').SizeClass;
  const ElementType: typeof import('@tokens').ElementType;
  const GestureType: typeof import('@tokens').GestureType;
  const ModifierType: typeof import('@tokens').ModifierType;

  // --- Config ---
  const DSLDefaults: typeof import('@config').DSLDefaults;
  const defaultThemeConfig: DSLThemeConfig;
}

export {};
