import React from 'react';
import { ViewBuilder } from '@core';
import { ElementType } from '@tokens';

export function Raw(element: React.ReactElement): ViewBuilder {
  return new ViewBuilder(ElementType.raw, { rawElement: element });
}
