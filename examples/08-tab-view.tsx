/**
 * Example 8: TabView
 *
 * Demonstrates the TabView primitive with tab bar navigation,
 * icons, badges, custom animations, and fully custom tab items.
 */
import React from 'react';
import {
  TabView, Tab, VStack, HStack, Text, Icon, Button, Spacer, ScrollStack,
  DSLRenderer, DSLThemeProvider, defaultThemeConfig,
  Color, Font, Spacing, Radius, TabBarAnimation,
  ColorScheme as ColorSchemeValue,
} from 'react-native-swiftui-dsl';

// --- Screen builders ---

function buildHomeScreen() {
  return ScrollStack(
    VStack(
      Text('Home').font(Font.title).bold(),
      Text('Welcome back! Here is your dashboard.')
        .font(Font.body)
        .secondary(),
    )
      .padding(Spacing.lg)
      .spacing(8),
  );
}

function buildSearchScreen() {
  return VStack(
    Text('Search').font(Font.title).bold(),
    Text('Find anything you need.')
      .font(Font.body)
      .secondary(),
  )
    .padding(Spacing.lg)
    .spacing(8);
}

function buildNotificationsScreen() {
  return VStack(
    Text('Notifications').font(Font.title).bold(),
    Text('You have 3 unread messages.')
      .font(Font.body)
      .foregroundColor(Color.tint),
  )
    .padding(Spacing.lg)
    .spacing(8);
}

function buildProfileScreen() {
  return VStack(
    Text('Profile').font(Font.title).bold(),
    Text('John Doe').font(Font.subtitle).semibold(),
    Text('iOS Developer').font(Font.footnote).secondary(),
  )
    .padding(Spacing.lg)
    .spacing(8);
}

// --- Basic TabView ---

function buildBasicTabView() {
  return TabView(
    Tab({ title: 'Home', icon: 'home' }, buildHomeScreen()),
    Tab({ title: 'Search', icon: 'search' }, buildSearchScreen()),
    Tab({ title: 'Profile', icon: 'user' }, buildProfileScreen()),
  )
    .tabBarTintColor(Color.tint)
    .tabBarBackgroundColor(Color.card);
}

// --- TabView with badges and animation ---

function buildAnimatedTabView() {
  return TabView(
    Tab({ title: 'Home', icon: 'home' }, buildHomeScreen()),
    Tab({ title: 'Search', icon: 'search' }, buildSearchScreen()),
    Tab(
      { title: 'Inbox', icon: 'envelope', badge: '3' },
      buildNotificationsScreen(),
    ),
    Tab({ title: 'Profile', icon: 'user' }, buildProfileScreen()),
  )
    .tabBarTintColor(Color.tint)
    .tabBarInactiveTintColor(Color.secondaryText)
    .tabBarBackgroundColor(Color.card)
    .tabBarBorderColor(Color.separator)
    .tabBarAnimation(TabBarAnimation.spring)
    .tabBarIconSize(24)
    .tabBarLabelFontSize(Font.small)
    .tabBarLabelFontWeight('semibold');
}

// --- TabView with custom animation config ---

function buildCustomAnimationTabView() {
  return TabView(
    Tab({ title: 'Dashboard', icon: 'tachometer' }, buildHomeScreen()),
    Tab({ title: 'Stats', icon: 'bar-chart' }, buildSearchScreen()),
    Tab({ title: 'Settings', icon: 'cog' }, buildProfileScreen()),
  )
    .tabBarTintColor(Color.tint)
    .tabBarAnimation({
      scale: 1.2,
      duration: 200,
      useSpring: true,
      damping: 8,
      stiffness: 150,
      inactiveOpacity: 0.6,
    })
    .tabBarHeight(90);
}

// --- TabView with per-tab icon customization ---

function buildCustomIconsTabView() {
  return TabView(
    Tab(
      {
        title: 'Home',
        icon: 'home',
        activeIcon: 'home',
        iconSize: 26,
        activeIconColor: Color.tint,
      },
      buildHomeScreen(),
    ),
    Tab(
      {
        title: 'Favorites',
        icon: 'heart-o',
        activeIcon: 'heart',
        iconColor: Color.secondaryText,
        activeIconColor: Color.error,
      },
      buildSearchScreen(),
    ),
    Tab(
      {
        title: 'Profile',
        icon: 'user-o',
        activeIcon: 'user',
      },
      buildProfileScreen(),
    ),
  )
    .tabBarTintColor(Color.tint)
    .tabBarAnimation(TabBarAnimation.scale);
}

// --- TabView with fully custom tab items ---

function buildCustomItemTabView() {
  return TabView(
    Tab(
      {
        customItem: (isActive: boolean) =>
          VStack(
            Icon(isActive ? 'home' : 'home')
              .foregroundColor(isActive ? Color.tint : Color.secondaryText),
            Text('Home')
              .font(Font.micro)
              .foregroundColor(isActive ? Color.tint : Color.secondaryText),
          ).spacing(2),
      },
      buildHomeScreen(),
    ),
    Tab(
      {
        customItem: (isActive: boolean) =>
          VStack(
            Icon(isActive ? 'user' : 'user')
              .foregroundColor(isActive ? Color.tint : Color.secondaryText),
            Text('Me')
              .font(Font.micro)
              .foregroundColor(isActive ? Color.tint : Color.secondaryText),
          ).spacing(2),
      },
      buildProfileScreen(),
    ),
  )
    .tabBarBackgroundColor(Color.card)
    .tabBarAnimation(TabBarAnimation.fade);
}

// --- Screen component ---

export default function TabViewDemo() {
  return (
    <DSLThemeProvider config={defaultThemeConfig} colorScheme={ColorSchemeValue.light}>
      <DSLRenderer builder={buildAnimatedTabView()} />
    </DSLThemeProvider>
  );
}
