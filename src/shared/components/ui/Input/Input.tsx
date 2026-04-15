import type { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import * as s from './Input.css';

export type InputSize = 'default' | 'compact' | 'large';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** default: 폼용, compact: 테이블/인라인용, large: 필터 영역용 */
  size?: InputSize;
}

const sizeStyles = {
  default: s.sizeDefault,
  compact: s.sizeCompact,
  large: s.sizeLarge,
} as const;

export function Input({ size = 'default', className, ...props }: InputProps) {
  return <input className={clsx(sizeStyles[size], className)} {...props} />;
}
