import React from 'react';
import { BoxProps } from '../../ui/box';
import {
  FONT_WEIGHT,
  FONT_STYLE,
  TextVariant,
  TEXT_ALIGN,
  TEXT_TRANSFORM,
  OVERFLOW_WRAP,
  TextColor,
} from '../../../helpers/constants/design-system';
import { TEXT_DIRECTIONS } from './text.constants';

export enum ValidTags {
  Dd = 'dd',
  Div = 'div',
  Dt = 'dt',
  Em = 'em',
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  H4 = 'h4',
  H5 = 'h5',
  H6 = 'h6',
  Li = 'li',
  P = 'p',
  Span = 'span',
  Strong = 'strong',
  Ul = 'ul',
  Label = 'label',
  Input = 'input',
}

export interface TextProps extends BoxProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: TextColor;
  fontWeight?: FONT_WEIGHT;
  fontStyle?: FONT_STYLE;
  textTransform?: TEXT_TRANSFORM;
  textAlign?: TEXT_ALIGN;
  textDirection?: TEXT_DIRECTIONS;
  overflowWrap?: OVERFLOW_WRAP;
  ellipsis?: boolean;
  as?: ValidTags;
  className?: string;
}

export const Text: React.ForwardRefExoticComponent<
  TextProps & React.RefAttributes<HTMLElement>
>;

export const getTextElementDefault: (variant: TextVariant) => ValidTags;
