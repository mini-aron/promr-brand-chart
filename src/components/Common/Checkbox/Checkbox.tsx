/** @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { Check } from 'lucide-react';
import { theme } from '@/theme';

const wrap = (checked: boolean, layout: 'horizontal' | 'vertical') =>
  css({
    display: 'flex',
    flexDirection: layout === 'vertical' ? 'column' : 'row',
    alignItems: layout === 'vertical' ? 'flex-start' : 'flex-start',
    gap: theme.spacing(1.5),
    cursor: 'pointer',
    userSelect: 'none',
    '& input:focus-visible ~ [data-checkbox-box]': {
      outline: `2px solid ${theme.colors.primary}`,
      outlineOffset: 2,
    },
    '&:hover [data-checkbox-box]': {
      borderColor: checked ? theme.colors.primaryHover : theme.colors.textMuted,
    },
  });

const inputHidden = css({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

const box = (checked: boolean) =>
  css({
    flexShrink: 0,
    width: 20,
    height: 20,
    borderRadius: 4,
    border: `2px solid ${checked ? theme.colors.primary : theme.colors.border}`,
    backgroundColor: checked ? theme.colors.primary : theme.colors.surface,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'border-color 0.15s, background-color 0.15s',
  });

const labelText = css({
  fontSize: 14,
  fontWeight: 600,
  color: theme.colors.text,
});

const description = css({
  fontSize: 12,
  color: theme.colors.textMuted,
  marginTop: 2,
});

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
  const labelContent = (label != null || desc != null) && (
    <span>
      {label != null && <span css={labelText}>{label}</span>}
      {desc != null && <div css={description}>{desc}</div>}
    </span>
  );
  return (
    <label css={wrap(checked, layout)} htmlFor={inputId}>
      <input
        id={inputId}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        css={inputHidden}
        aria-label={ariaLabel}
      />
      {layout === 'vertical' ? (
        <>
          {labelContent}
          <span css={box(checked)} data-checkbox-box>{checked && <Check size={12} strokeWidth={3} stroke="white" />}</span>
        </>
      ) : (
        <>
          <span css={box(checked)} data-checkbox-box>{checked && <Check size={12} strokeWidth={3} stroke="white" />}</span>
          {labelContent}
        </>
      )}
    </label>
  );
}
