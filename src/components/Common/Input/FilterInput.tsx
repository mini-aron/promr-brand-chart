import type { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import * as s from './FilterInput.css';

export type FilterInputProps = InputHTMLAttributes<HTMLInputElement>;

/**
 * 필터 영역용 input. Select와 동일한 높이·패딩(minHeight 48px).
 */
export function FilterInput({ className, ...props }: FilterInputProps) {
  return <input className={clsx(s.filterFieldInput, className)} {...props} />;
}
