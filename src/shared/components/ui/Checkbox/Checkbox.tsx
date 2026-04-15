import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { Check, Minus } from 'lucide-react';
import * as s from './Checkbox.css';

export interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** 'horizontal': 체크박스 | 라벨 (기본), 'vertical': 라벨 위, 체크박스 아래 */
  layout?: 'horizontal' | 'vertical';
  /** 일부만 선택된 상태(전체 동의 등). checked가 false일 때 표시 */
  indeterminate?: boolean;
  disabled?: boolean;
  'aria-label'?: string;
}

export function Checkbox({
  id,
  checked,
  onChange,
  label,
  description: desc,
  layout = 'horizontal',
  indeterminate,
  disabled,
  'aria-label': ariaLabel,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = id ?? `checkbox-${React.useId()}`;
  const isIndeterminate = Boolean(indeterminate && !checked);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.indeterminate = isIndeterminate;
  }, [isIndeterminate]);

  const wrapClass =
    layout === 'vertical'
      ? clsx(s.wrapVertical, checked && s.wrapVerticalChecked)
      : clsx(s.wrapHorizontal, checked && s.wrapHorizontalChecked);

  const labelContentNode = (label != null || desc != null) && (
    <span className={s.labelContent}>
      {label != null && <span className={s.labelText}>{label}</span>}
      {desc != null && <div className={s.description}>{desc}</div>}
    </span>
  );

  const boxVisual = isIndeterminate ? (
    <span className={clsx(s.box, s.boxIndeterminate)} data-checkbox-box>
      <Minus size={12} strokeWidth={3} stroke="white" />
    </span>
  ) : (
    <span className={clsx(s.box, checked && s.boxChecked)} data-checkbox-box>
      {checked && <Check size={12} strokeWidth={3} stroke="white" />}
    </span>
  );

  return (
    <label className={wrapClass} htmlFor={inputId}>
      <input
        ref={inputRef}
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={s.inputHidden}
        aria-label={ariaLabel}
      />
      {layout === 'vertical' ? (
        <>
          {labelContentNode}
          {boxVisual}
        </>
      ) : (
        <>
          {boxVisual}
          {labelContentNode}
        </>
      )}
    </label>
  );
}
