/** @jsxImportSource @emotion/react */
import { css, type SerializedStyles } from '@emotion/react';
import { theme } from '@/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'menu';
export type ButtonSize = 'default' | 'small' | 'icon' | 'menu';

const baseStyles = css({
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  fontFamily: theme.fontFamily,
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
});

const variantStyles: Record<ButtonVariant, SerializedStyles> = {
  primary: css({
    backgroundColor: theme.colors.primary,
    color: theme.colors.buttonText,
    '&:hover:not(:disabled)': { backgroundColor: theme.colors.primaryHover },
  }),
  secondary: css({
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    '&:hover:not(:disabled)': { backgroundColor: theme.colors.background },
  }),
  ghost: css({
    backgroundColor: theme.colors.background,
    color: theme.colors.text,
    '&:hover:not(:disabled)': { backgroundColor: theme.colors.border },
  }),
  danger: css({
    border: '1px solid #dc2626',
    backgroundColor: theme.colors.surface,
    color: '#dc2626',
    '&:hover:not(:disabled)': { backgroundColor: '#fee2e2', borderColor: '#b91c1c' },
  }),
  menu: css({
    background: 'none',
    color: theme.colors.text,
    width: '100%',
    textAlign: 'left',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: theme.radius.sm,
    '&:hover:not(:disabled)': { backgroundColor: theme.colors.background },
    '&[data-active="true"]': {
      color: theme.colors.primary,
      backgroundColor: `${theme.colors.primary}12`,
    },
  }),
};

const sizeStyles: Record<ButtonSize, SerializedStyles> = {
  default: css({
    padding: `${theme.buttonPadding.y}px ${theme.spacing(3)}px`,
    fontSize: 13,
    borderRadius: theme.radius.sm,
    minHeight: 36,
  }),
  small: css({
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1.5)}px`,
    fontSize: 11,
    fontWeight: 500,
    borderRadius: theme.radius.sm,
  }),
  icon: css({
    width: 28,
    height: 28,
    padding: 0,
    minHeight: 0,
    borderRadius: theme.radius.sm,
    fontSize: 16,
    lineHeight: 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  menu: css({
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    fontSize: 13,
    borderRadius: theme.radius.sm,
    minHeight: 0,
  }),
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** 메뉴/리스트 선택 시 활성 표시 (variant="menu" 일 때) */
  active?: boolean;
  css?: SerializedStyles;
}

export function Button({
  variant = 'primary',
  size = 'default',
  active,
  children,
  css: customCss,
  type = 'button',
  ...props
}: ButtonProps) {
  const isMenu = variant === 'menu';
  return (
    <button
      type={type}
      css={[baseStyles, variantStyles[variant], sizeStyles[size], customCss]}
      data-active={isMenu ? active : undefined}
      {...props}
    >
      {children}
    </button>
  );
}
