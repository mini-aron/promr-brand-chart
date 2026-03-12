import type { ReactNode, HTMLAttributes, CSSProperties } from 'react';
import { clsx } from 'clsx';
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
