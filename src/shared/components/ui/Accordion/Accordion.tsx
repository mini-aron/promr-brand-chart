'use client';

import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { Checkbox } from '@/shared/components/ui/Checkbox';
import * as s from './Accordion.css';

export type AccordionItemProps = {
  checkboxId: string;
  label: string;
  required?: boolean;
  checked: boolean;
  onChange: (v: boolean) => void;
  panelId: string;
  panelAriaLabel: string;
  panelClassName?: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
};

export function AccordionItem({
  checkboxId,
  label,
  required = false,
  checked,
  onChange,
  panelId,
  panelAriaLabel,
  panelClassName,
  open,
  onToggle,
  children,
}: AccordionItemProps) {
  return (
    <div className={s.item}>
      <div className={s.topRow}>
        <div className={s.checkboxWrap}>
          <Checkbox
            id={checkboxId}
            checked={checked}
            onChange={onChange}
            label={
              <span className={s.labelWithBadge}>
                {label}
                <span className={required ? s.badgeRequired : s.badgeOptional}>
                  {required ? '필수' : '선택'}
                </span>
              </span>
            }
            aria-label={`${label} ${required ? '필수' : '선택'}`}
          />
        </div>
        <button
          type="button"
          className={s.toggle}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          자세히 보기
          <ChevronDown
            className={clsx(s.chevron, open && s.chevronOpen)}
            size={14}
            aria-hidden
          />
        </button>
      </div>
      {open && (
        <div
          id={panelId}
          className={clsx(s.panel, panelClassName)}
          role="region"
          aria-label={panelAriaLabel}
        >
          {children}
        </div>
      )}
    </div>
  );
}
