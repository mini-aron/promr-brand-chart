'use client';

import { clsx } from 'clsx';
import { Info } from 'lucide-react';
import * as s from './Tooltip.css';

export interface TooltipProps {
  /** hover 시 표시할 설명 */
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ description, children, className }: TooltipProps) {
  return (
    <div className={clsx(s.wrapper, className)}>
      {children}
      <span className={s.iconWrap} aria-label={description} role="img">
        <Info size={12} aria-hidden />
      </span>
      <span className={s.tooltipBubble}>{description}</span>
    </div>
  );
}
