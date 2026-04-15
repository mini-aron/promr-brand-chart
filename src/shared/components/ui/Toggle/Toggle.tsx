import React from 'react';
import { clsx } from 'clsx';
import * as s from './Toggle.css';

export interface ToggleProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  'aria-label'?: string;
}

export function Toggle({
  id,
  checked,
  onChange,
  label,
  disabled,
  'aria-label': ariaLabel,
}: ToggleProps) {
  const inputId = id ?? `toggle-${React.useId()}`;

  return (
    <label className={clsx(s.wrap, disabled && s.wrapDisabled)} htmlFor={inputId}>
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className={s.inputHidden}
        aria-label={ariaLabel}
        aria-checked={checked}
      />
      <span className={clsx(s.track, checked && s.trackChecked)} data-toggle-track>
        <span className={clsx(s.thumb, checked && s.thumbChecked)} />
      </span>
      {label != null && <span className={s.labelText}>{label}</span>}
    </label>
  );
}
