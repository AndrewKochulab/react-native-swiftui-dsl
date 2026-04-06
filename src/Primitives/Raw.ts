import React from 'react';
import { ViewBuilder } from '@/Core/ViewBuilder';
import { ElementType } from '@/Tokens/ElementType';

export function Raw(element: React.ReactElement): ViewBuilder {
  return new ViewBuilder(ElementType.raw, { rawElement: element });
}
