/** @jsxImportSource @emotion/react */
import type { ReactNode, HTMLAttributes, CSSProperties } from 'react';
import { clsx } from 'clsx';
import type { SerializedStyles } from '@emotion/react';
import * as s from './Flex.css';

const gapToCss = (gap: string | number) =>
  typeof gap === 'number' ? `${gap}px` : gap;

export type FlexProps = {
  direction?: 'row' | 'column';
  gap?: string | number;
  justifyContent?: CSSProperties['justifyContent'];
  alignItems?: CSSProperties['alignItems'];
  wrap?: CSSProperties['flexWrap'];
  /** flex shorthand (e.g. 1 for flex: 1) */
  flex?: number | string;
  children: ReactNode;
  /** @deprecated VE 마이그레이션 후 className 사용 */
  css?: SerializedStyles | Array<SerializedStyles | false | undefined>;
} & Omit<HTMLAttributes<HTMLDivElement>, 'css'>;

export function Flex({
  direction = 'row',
  gap = '0',
  justifyContent = 'flex-start',
  alignItems = direction === 'row' ? 'center' : 'stretch',
  wrap,
  flex: flexProp,
  children,
  className,
  css: cssProp,
  style,
  ...rest
}: FlexProps) {
  const computedStyle: React.CSSProperties = {
    flexDirection: direction,
    gap: gapToCss(gap),
    justifyContent,
    alignItems,
    ...(wrap && { flexWrap: wrap }),
    ...(flexProp !== undefined && { flex: typeof flexProp === 'number' ? flexProp : flexProp }),
    ...style,
  };

  return (
    <div
      className={clsx(s.flex, className)}
      css={cssProp}
      style={computedStyle}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Column(props: Omit<FlexProps, 'direction'>) {
  return <Flex direction="column" {...props} />;
}

export function Row(props: Omit<FlexProps, 'direction'>) {
  return <Flex direction="row" {...props} />;
}
