import { ViewBuilder, type DSLChild } from '@core';
import { type ColorValue } from '@core';
import { ElementType, type TabBarAnimationToken } from '@tokens';

// Re-export for consumer convenience
export { TabBarAnimation } from '@tokens';
export type { TabBarAnimationToken } from '@tokens';

// --- Tab Bar Animation ---

/** Custom animation config for tab bar item transitions. */
export interface TabBarCustomAnimation {
  /** Scale multiplier applied during the press/active transition (e.g. 1.15). */
  readonly scale?: number;
  /** Duration in milliseconds. */
  readonly duration?: number;
  /** Whether to use spring physics. */
  readonly useSpring?: boolean;
  /** Spring damping (lower = more bouncy). Only used when useSpring is true. */
  readonly damping?: number;
  /** Spring stiffness. Only used when useSpring is true. */
  readonly stiffness?: number;
  /** Opacity for inactive items (0-1). */
  readonly inactiveOpacity?: number;
}

/** Animation config — either a preset token or a custom configuration. */
export type TabBarAnimationConfig = TabBarAnimationToken | TabBarCustomAnimation;

// --- Tab Item ---

/**
 * Standard tab item configuration with icon and/or title.
 * At least one of `title` or `icon` must be provided.
 */
type TabOptionsWithTitle = {
  readonly title: string;
  readonly icon?: string;
  readonly activeIcon?: string;
  readonly iconSize?: number;
  readonly iconColor?: ColorValue;
  readonly activeIconColor?: ColorValue;
  readonly badge?: string;
  readonly testID?: string;
  readonly customItem?: undefined;
};

type TabOptionsWithIcon = {
  readonly title?: string;
  readonly icon: string;
  readonly activeIcon?: string;
  readonly iconSize?: number;
  readonly iconColor?: ColorValue;
  readonly activeIconColor?: ColorValue;
  readonly badge?: string;
  readonly testID?: string;
  readonly customItem?: undefined;
};

/**
 * Custom tab bar item — the consumer provides a render function
 * that receives the active state and returns a ViewBuilder.
 */
type TabOptionsWithCustomItem = {
  readonly title?: undefined;
  readonly icon?: undefined;
  readonly customItem: (isActive: boolean) => ViewBuilder;
  readonly badge?: string;
  readonly testID?: string;
};

/** Union of all valid tab option shapes. */
export type TabOptions = TabOptionsWithTitle | TabOptionsWithIcon | TabOptionsWithCustomItem;

/** A fully resolved tab item holding its options and content. */
export interface TabItem {
  readonly options: TabOptions;
  readonly content: DSLChild;
}

/**
 * Creates a tab item for use inside `TabView`.
 *
 * @example
 * ```ts
 * // Icon and title
 * Tab({ title: 'Home', icon: 'home' }, HomeScreen())
 *
 * // Icon only
 * Tab({ icon: 'home' }, HomeScreen())
 *
 * // Title only
 * Tab({ title: 'Home' }, HomeScreen())
 *
 * // With badge
 * Tab({ title: 'Home', icon: 'home', badge: '3' }, HomeScreen())
 *
 * // With per-tab icon customization
 * Tab({ title: 'Settings', icon: 'cog', activeIcon: 'cog', iconSize: 24 }, SettingsScreen())
 *
 * // Fully custom tab bar item
 * Tab({ customItem: (isActive) =>
 *   VStack(
 *     Icon(isActive ? 'home' : 'home').foregroundColor(isActive ? 'tint' : 'secondaryText'),
 *     Text('Home').font('micro'),
 *   )
 * }, HomeScreen())
 * ```
 */
export function Tab(options: TabOptions, content: DSLChild): TabItem {
  return { options, content };
}

/**
 * Creates a tab view container with a bottom tab bar.
 *
 * @example
 * ```ts
 * TabView(
 *   Tab({ title: 'Dashboard', icon: 'home' }, DashboardScreen()),
 *   Tab({ title: 'Stats', icon: 'bar-chart' }, StatsScreen()),
 *   Tab({ title: 'Settings', icon: 'cog' }, SettingsScreen()),
 * )
 * .tabBarTintColor('tint')
 * .tabBarAnimation('spring')
 * ```
 */
export function TabView(...tabs: TabItem[]): ViewBuilder {
  return new ViewBuilder(ElementType.tabview, { tabItems: tabs });
}
