import React from 'react';
import { renderWithDSLTheme } from '@tests/Helpers/renderWithDSLTheme';
import { TabView, Tab, Text, VStack, Icon } from '@primitives';
import { ElementType, ModifierType, TabBarAnimation, Color } from '@tokens';
import { DSLRenderer } from '@core';

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
}));

describe('Tab factory', () => {
  it('creates a TabItem with title and icon', () => {
    const item = Tab({ title: 'Home', icon: 'home' }, Text('Content'));
    expect(item.options.title).toBe('Home');
    expect(item.options.icon).toBe('home');
    expect(item.content).toBeDefined();
  });

  it('creates a TabItem with icon only', () => {
    const item = Tab({ icon: 'star' }, Text('Content'));
    expect(item.options.icon).toBe('star');
    expect(item.options.title).toBeUndefined();
  });

  it('creates a TabItem with title only', () => {
    const item = Tab({ title: 'Settings' }, Text('Content'));
    expect(item.options.title).toBe('Settings');
    expect(item.options.icon).toBeUndefined();
  });

  it('creates a TabItem with badge', () => {
    const item = Tab({ title: 'Inbox', icon: 'envelope', badge: '5' }, Text('Content'));
    expect(item.options.badge).toBe('5');
  });

  it('creates a TabItem with activeIcon', () => {
    const item = Tab({ title: 'Home', icon: 'home', activeIcon: 'home' }, Text('Content'));
    expect(item.options.activeIcon).toBe('home');
  });

  it('creates a TabItem with custom item renderer', () => {
    const customFn = (isActive: boolean) => Text(isActive ? 'Active' : 'Inactive');
    const item = Tab({ customItem: customFn }, Text('Content'));
    expect(item.options.customItem).toBe(customFn);
  });

  it('creates a TabItem with testID', () => {
    const item = Tab({ icon: 'home', testID: 'tab-home' }, Text('Content'));
    expect(item.options.testID).toBe('tab-home');
  });
});

describe('TabView primitive', () => {
  it('creates a ViewBuilder with tabview element type', () => {
    const builder = TabView(
      Tab({ title: 'A', icon: 'home' }, Text('A')),
      Tab({ title: 'B', icon: 'cog' }, Text('B')),
    );
    expect(builder.elementType).toBe(ElementType.tabview);
  });

  it('stores tab items in props', () => {
    const tabs = [
      Tab({ title: 'A', icon: 'home' }, Text('A')),
      Tab({ title: 'B', icon: 'cog' }, Text('B')),
    ];
    const builder = TabView(...tabs);
    expect(builder.props.tabItems).toHaveLength(2);
  });

  it('supports modifier chaining', () => {
    const builder = TabView(
      Tab({ icon: 'home' }, Text('A')),
    )
      .tabBarTintColor(Color.tint)
      .tabBarAnimation(TabBarAnimation.spring)
      .tabBarIconSize(24);

    expect(builder.modifiers).toContainEqual({ type: ModifierType.tabBarTintColor, color: Color.tint });
    expect(builder.modifiers).toContainEqual({ type: ModifierType.tabBarAnimation, config: TabBarAnimation.spring });
    expect(builder.modifiers).toContainEqual({ type: ModifierType.tabBarIconSize, value: 24 });
  });
});

describe('TabView modifiers', () => {
  it('tabBarTintColor adds correct modifier', () => {
    const builder = TabView(Tab({ icon: 'home' }, Text('A'))).tabBarTintColor(Color.tint);
    expect(builder.modifiers).toContainEqual({ type: ModifierType.tabBarTintColor, color: Color.tint });
  });

  it('tabBarInactiveTintColor adds correct modifier', () => {
    const builder = TabView(Tab({ icon: 'home' }, Text('A'))).tabBarInactiveTintColor(Color.secondaryText);
    expect(builder.modifiers).toContainEqual({ type: ModifierType.tabBarInactiveTintColor, color: Color.secondaryText });
  });

  it('tabBarBackgroundColor adds correct modifier', () => {
    const builder = TabView(Tab({ icon: 'home' }, Text('A'))).tabBarBackgroundColor(Color.card);
    expect(builder.modifiers).toContainEqual({ type: ModifierType.tabBarBackgroundColor, color: Color.card });
  });

  it('tabBarBorderColor adds correct modifier', () => {
    const builder = TabView(Tab({ icon: 'home' }, Text('A'))).tabBarBorderColor(Color.separator);
    expect(builder.modifiers).toContainEqual({ type: ModifierType.tabBarBorderColor, color: Color.separator });
  });

  it('tabBarAnimation with preset adds correct modifier', () => {
    const builder = TabView(Tab({ icon: 'home' }, Text('A'))).tabBarAnimation(TabBarAnimation.scale);
    expect(builder.modifiers).toContainEqual({ type: ModifierType.tabBarAnimation, config: TabBarAnimation.scale });
  });

  it('tabBarAnimation with custom config adds correct modifier', () => {
    const custom = { scale: 1.3, duration: 400, useSpring: true, damping: 8 };
    const builder = TabView(Tab({ icon: 'home' }, Text('A'))).tabBarAnimation(custom);
    expect(builder.modifiers).toContainEqual({ type: ModifierType.tabBarAnimation, config: custom });
  });

  it('tabBarLabelFontSize adds correct modifier', () => {
    const builder = TabView(Tab({ icon: 'home' }, Text('A'))).tabBarLabelFontSize(14);
    expect(builder.modifiers).toContainEqual({ type: ModifierType.tabBarLabelFontSize, value: 14 });
  });

  it('tabBarLabelFontWeight adds correct modifier', () => {
    const builder = TabView(Tab({ icon: 'home' }, Text('A'))).tabBarLabelFontWeight('600');
    expect(builder.modifiers).toContainEqual({ type: ModifierType.tabBarLabelFontWeight, weight: '600' });
  });

  it('tabBarIconSize adds correct modifier', () => {
    const builder = TabView(Tab({ icon: 'home' }, Text('A'))).tabBarIconSize(28);
    expect(builder.modifiers).toContainEqual({ type: ModifierType.tabBarIconSize, value: 28 });
  });

  it('tabBarHeight adds correct modifier', () => {
    const builder = TabView(Tab({ icon: 'home' }, Text('A'))).tabBarHeight(64);
    expect(builder.modifiers).toContainEqual({ type: ModifierType.tabBarHeight, value: 64 });
  });
});

describe('TabView rendering', () => {
  it('renders the first tab content by default', () => {
    const builder = TabView(
      Tab({ title: 'First', icon: 'home' }, Text('First Content')),
      Tab({ title: 'Second', icon: 'cog' }, Text('Second Content')),
    );
    const { getByText } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    expect(getByText('First Content')).toBeTruthy();
  });

  it('renders tab bar with labels', () => {
    const builder = TabView(
      Tab({ title: 'Home', icon: 'home' }, Text('Home Content')),
      Tab({ title: 'Settings', icon: 'cog' }, Text('Settings Content')),
    );
    const { getByText } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    expect(getByText('Home')).toBeTruthy();
    expect(getByText('Settings')).toBeTruthy();
  });

  it('renders tab with title only', () => {
    const builder = TabView(
      Tab({ title: 'Dashboard' }, Text('Dashboard Content')),
    );
    const { getByText } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    expect(getByText('Dashboard')).toBeTruthy();
    expect(getByText('Dashboard Content')).toBeTruthy();
  });

  it('renders badge text', () => {
    const builder = TabView(
      Tab({ title: 'Inbox', icon: 'envelope', badge: '3' }, Text('Messages')),
    );
    const { getByText } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    expect(getByText('3')).toBeTruthy();
  });

  it('renders with testID', () => {
    const builder = TabView(
      Tab({ icon: 'home', testID: 'tab-home' }, Text('Content')),
    ).testID('my-tabs');
    const { getByTestId } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    expect(getByTestId('my-tabs')).toBeTruthy();
    expect(getByTestId('my-tabs-bar')).toBeTruthy();
    expect(getByTestId('tab-home')).toBeTruthy();
  });

  it('renders custom tab bar item', () => {
    const builder = TabView(
      Tab(
        { customItem: (isActive) => Text(isActive ? 'ACTIVE' : 'INACTIVE') },
        Text('Content'),
      ),
    );
    const { getByText } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    expect(getByText('ACTIVE')).toBeTruthy();
  });

  it('applies tabBarAnimation modifier without crashing', () => {
    const builder = TabView(
      Tab({ title: 'Home', icon: 'home' }, Text('Home Content')),
      Tab({ title: 'Settings', icon: 'cog' }, Text('Settings Content')),
    ).tabBarAnimation(TabBarAnimation.spring);
    const { getByText } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    expect(getByText('Home Content')).toBeTruthy();
  });

  it('applies custom animation config without crashing', () => {
    const builder = TabView(
      Tab({ title: 'Home', icon: 'home' }, Text('Home Content')),
    ).tabBarAnimation({ scale: 1.5, duration: 500, useSpring: true, damping: 6, stiffness: 200, inactiveOpacity: 0.5 });
    const { getByText } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    expect(getByText('Home Content')).toBeTruthy();
  });

  it('renders icon fallback text when FontAwesome not available', () => {
    const builder = TabView(
      Tab({ icon: 'home' }, Text('Fallback Content')),
    );
    const { getByText } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    expect(getByText('Fallback Content')).toBeTruthy();
  });
});
