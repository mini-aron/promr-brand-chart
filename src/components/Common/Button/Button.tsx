import { clsx } from 'clsx';
import * as s from './Button.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'menu';
export type ButtonSize = 'default' | 'small' | 'icon' | 'menu';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** 메뉴/리스트 선택 시 활성 표시 (variant="menu" 일 때) */
  active?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'default',
  active,
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const isMenu = variant === 'menu';
  return (
    <button
      type={type}
      className={clsx(s.baseStyle, s.variantStyles[variant], s.sizeStyles[size], className)}
      data-active={isMenu ? active : undefined}
      {...props}
    >
      {children}
    </button>
  );
}
