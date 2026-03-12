import type { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import * as s from './Input.css';

export type InputSize = 'default' | 'compact';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** default: 폼용 기본 크기, compact: 테이블/인라인용 작은 크기 */
  size?: InputSize;
}

const sizeStyles = {
  default: s.sizeDefault,
  compact: s.sizeCompact,
} as const;

export function Input({ size = 'default', className, ...props }: InputProps) {
  return (
    <input
      className={clsx(sizeStyles[size], className)}
      {...props}
    />
  );
}
