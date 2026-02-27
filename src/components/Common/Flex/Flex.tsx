/** @jsxImportSource @emotion/react */
import { css, type SerializedStyles } from '@emotion/react';
import type { ReactNode, HTMLAttributes, CSSProperties } from 'react';

export type FlexProps = {
  direction?: 'row' | 'column';
  gap?: string | number;
  justifyContent?: CSSProperties['justifyContent'];
  alignItems?: CSSProperties['alignItems'];
  wrap?: CSSProperties['flexWrap'];
  /** flex shorthand (e.g. 1 for flex: 1) */
  flex?: number | string;
  children: ReactNode;
  /** Emotion css override (theme, 미디어쿼리 등 사용 가능) */
  css?: SerializedStyles | SerializedStyles[];
} & Omit<HTMLAttributes<HTMLDivElement>, 'css'>;

const gapToCss = (gap: string | number) =>
  typeof gap === 'number' ? `${gap}px` : gap;

export function Flex({
  direction = 'row',
  gap = '0',
  justifyContent = 'flex-start',
  alignItems = direction === 'row' ? 'center' : 'stretch',
  wrap,
  flex,
  css: cssProp,
  children,
  style,
  ...rest
}: FlexProps) {
  const baseStyle = css({
    display: 'flex',
    flexDirection: direction,
    gap: gapToCss(gap),
    justifyContent,
    alignItems,
    ...(wrap && { flexWrap: wrap }),
    ...(flex !== undefined && { flex: typeof flex === 'number' ? flex : flex }),
  });

  return (
    <div
      css={cssProp ? [baseStyle, cssProp] : baseStyle}
      style={style}
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
