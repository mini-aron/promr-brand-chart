'use client';

import { clsx } from 'clsx';
import { HiOutlineInformationCircle } from 'react-icons/hi';
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
        <HiOutlineInformationCircle size={16} />
      </span>
      <span className={s.tooltipBubble}>{description}</span>
    </div>
  );
}
