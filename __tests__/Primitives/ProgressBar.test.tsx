import React from 'react';
import { renderWithDSLTheme } from '../Helpers/renderWithDSLTheme';
import { ProgressBar } from '../../src/Primitives/ProgressBar';
import { DSLRenderer } from '../../src/Core/DSLRenderer';

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
}));

describe('ProgressBar primitive', () => {
  it('renders a progress bar with value', () => {
    const builder = ProgressBar(0.5);
    const { toJSON } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    const tree = toJSON();
    expect(tree).toBeTruthy();
  });

  it('renders with testID', () => {
    const builder = ProgressBar(0.75).testID('progress');
    const { getByTestId } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    expect(getByTestId('progress')).toBeTruthy();
  });

  it('has progressbar accessibility role', () => {
    const builder = ProgressBar(0.5).testID('progress-a11y');
    const { getByTestId } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    const bar = getByTestId('progress-a11y');
    expect(bar.props.accessibilityRole).toBe('progressbar');
  });

  it('clamps value between 0 and 1', () => {
    const builder1 = ProgressBar(-0.5).testID('neg');
    const { getByTestId: get1 } = renderWithDSLTheme(<DSLRenderer builder={builder1} />);
    const track1 = get1('neg');
    // The fill child width should be 0%
    const fillChild1 = track1.children?.[0] as { props?: { style?: { width?: string } } };
    expect(fillChild1?.props?.style?.width).toBe('0%');

    const builder2 = ProgressBar(1.5).testID('over');
    const { getByTestId: get2 } = renderWithDSLTheme(<DSLRenderer builder={builder2} />);
    const track2 = get2('over');
    const fillChild2 = track2.children?.[0] as { props?: { style?: { width?: string } } };
    expect(fillChild2?.props?.style?.width).toBe('100%');
  });

  it('renders zero progress', () => {
    const builder = ProgressBar(0).testID('zero');
    const { getByTestId } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    const track = getByTestId('zero');
    const fillChild = track.children?.[0] as { props?: { style?: { width?: string } } };
    expect(fillChild?.props?.style?.width).toBe('0%');
  });

  it('renders full progress', () => {
    const builder = ProgressBar(1).testID('full');
    const { getByTestId } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    const track = getByTestId('full');
    const fillChild = track.children?.[0] as { props?: { style?: { width?: string } } };
    expect(fillChild?.props?.style?.width).toBe('100%');
  });

  it('applies custom track and progress colors', () => {
    const builder = ProgressBar(0.5, { trackColor: '#E0E0E0', progressColor: '#00FF00' }).testID('custom-colors');
    const { getByTestId } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    const track = getByTestId('custom-colors');
    expect(track.props.style.backgroundColor).toBe('#E0E0E0');
    const fillChild = track.children?.[0] as { props?: { style?: { backgroundColor?: string } } };
    expect(fillChild?.props?.style?.backgroundColor).toBe('#00FF00');
  });

  it('applies custom height via frame modifier', () => {
    const builder = ProgressBar(0.5).frame({ height: 10 }).testID('height');
    const { getByTestId } = renderWithDSLTheme(<DSLRenderer builder={builder} />);
    const track = getByTestId('height');
    expect(track.props.style.height).toBe(10);
  });
});
