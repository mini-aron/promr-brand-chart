import React from 'react';
import { clsx } from 'clsx';
import { Check } from 'lucide-react';
import * as s from './Checkbox.css';

export interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  /** 'horizontal': 체크박스 | 라벨 (기본), 'vertical': 라벨 위, 체크박스 아래 */
  layout?: 'horizontal' | 'vertical';
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
  disabled,
  'aria-label': ariaLabel,
}: CheckboxProps) {
  const inputId = id ?? `checkbox-${React.useId()}`;
  const wrapClass =
    layout === 'vertical'
      ? clsx(s.wrapVertical, checked && s.wrapVerticalChecked)
      : clsx(s.wrapHorizontal, checked && s.wrapHorizontalChecked);

  const labelContent = (label != null || desc != null) && (
    <span>
      {label != null && <span className={s.labelText}>{label}</span>}
      {desc != null && <div className={s.description}>{desc}</div>}
    </span>
  );
  return (
    <label className={wrapClass} htmlFor={inputId}>
      <input
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
          {labelContent}
          <span className={clsx(s.box, checked && s.boxChecked)} data-checkbox-box>
            {checked && <Check size={12} strokeWidth={3} stroke="white" />}
          </span>
        </>
      ) : (
        <>
          <span className={clsx(s.box, checked && s.boxChecked)} data-checkbox-box>
            {checked && <Check size={12} strokeWidth={3} stroke="white" />}
          </span>
          {labelContent}
        </>
      )}
    </label>
  );
}
