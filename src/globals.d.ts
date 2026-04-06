/**
 * Global type declarations for react-native-swiftui-dsl.
 *
 * These declarations make all DSL types available globally when
 * `import 'react-native-swiftui-dsl/globals'` is used.
 */

import type { ViewBuilder, DSLChild, DSLElementType } from '@/Core/ViewBuilder';
import type { ViewModifier as ViewModifierClass, ViewModifierFn } from '@/Core/ViewModifier';
import type { DSLView as DSLViewClass } from '@/Core/DSLView';
import type { Binding } from '@/Binding/Binding';
import type { LazyListOptions } from '@/Primitives/LazyList';
import type { ImageSource } from '@/Primitives/Image';
import type { ButtonStyle } from '@/Primitives/Button';
import type { ModalAnimationType } from '@/Primitives/Modal';
import type { SectionData, SectionedListOptions } from '@/Primitives/SectionedList';
import type { DSLThemeConfig, ColorScheme } from '@/Theme/types';
import type { DSLThemeContextValue } from '@/Theme/DSLThemeContext';
import type { ColorValue } from '@/Core/ThemeResolver';
import type { AnimationConfig, TransitionConfig, AnimationPresets } from '@/Animation/types';
import type { ResponsiveConfig, ResponsiveModifierFn, ResponsiveContext as ResponsiveContextType } from '@/Responsive/types';
import type { SpinnerSizeToken, ImageResizeToken } from '@/Tokens/Component';
import type { SizeClassToken } from '@/Tokens/Interaction';
import type { BreakpointDefinition } from '@/Tokens/Layout';

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
  function normalizeColors(colors: import('@/Theme/types').DSLColorConfig): { light: import('@/Theme/types').DSLColors; dark: import('@/Theme/types').DSLColors };
  function resolveColor(value: ColorValue, theme: ColorScheme, colors: import('@/Theme/types').DSLColorConfig): string;

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
  const Color: typeof import('@/Tokens/Color').Color;
  const Font: typeof import('@/Tokens/Font').Font;
  const Weight: typeof import('@/Tokens/Font').Weight;
  const Spacing: typeof import('@/Tokens/Layout').Spacing;
  const Radius: typeof import('@/Tokens/Layout').Radius;
  const Edge: typeof import('@/Tokens/Layout').Edge;
  const TextAlign: typeof import('@/Tokens/Style').TextAlign;
  const TextDecoration: typeof import('@/Tokens/Style').TextDecoration;
  const TextTransform: typeof import('@/Tokens/Style').TextTransform;
  const FontStyle: typeof import('@/Tokens/Style').FontStyle;
  const BorderStyle: typeof import('@/Tokens/Style').BorderStyle;
  const Position: typeof import('@/Tokens/Style').Position;
  const Overflow: typeof import('@/Tokens/Style').Overflow;
  const Display: typeof import('@/Tokens/Style').Display;
  const FlexWrap: typeof import('@/Tokens/Style').FlexWrap;
  const FlexDirection: typeof import('@/Tokens/Style').FlexDirection;
  const JustifyContent: typeof import('@/Tokens/Style').JustifyContent;
  const AlignItems: typeof import('@/Tokens/Style').AlignItems;
  const AlignSelf: typeof import('@/Tokens/Style').AlignSelf;
  const Alignment: typeof import('@/Tokens/Style').Alignment;
  const Easing: typeof import('@/Tokens/Animation').Easing;
  const AnimationType: typeof import('@/Tokens/Animation').AnimationType;
  const Transition: typeof import('@/Tokens/Animation').Transition;
  const TransitionEdge: typeof import('@/Tokens/Animation').TransitionEdge;
  const ButtonVariant: typeof import('@/Tokens/Component').ButtonVariant;
  const SpinnerSize: typeof import('@/Tokens/Component').SpinnerSize;
  const ModalAnimation: typeof import('@/Tokens/Component').ModalAnimation;
  const ImageResize: typeof import('@/Tokens/Component').ImageResize;
  const AutoCapitalize: typeof import('@/Tokens/Component').AutoCapitalize;
  const KeyboardBehavior: typeof import('@/Tokens/Component').KeyboardBehavior;
  const KeyboardPersistTaps: typeof import('@/Tokens/Component').KeyboardPersistTaps;
  const ScrollDirection: typeof import('@/Tokens/Component').ScrollDirection;
  const AccessibilityRole: typeof import('@/Tokens/Component').AccessibilityRole;
  const SwipeDirection: typeof import('@/Tokens/Interaction').SwipeDirection;
  const SizeClass: typeof import('@/Tokens/Interaction').SizeClass;
  const ElementType: typeof import('@/Tokens/ElementType').ElementType;
  const GestureType: typeof import('@/Tokens/ElementType').GestureType;
  const ModifierType: typeof import('@/Tokens/ElementType').ModifierType;

  // --- Config ---
  const DSLDefaults: typeof import('@/Config/Defaults').DSLDefaults;
  const defaultThemeConfig: DSLThemeConfig;
}

export {};
