import { useState, useCallback } from 'react';
import type { UseModalReturn } from '@/types/hooks/useModal';

export function useModal(initial = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initial);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((p) => !p), []);
  return { isOpen, open, close, toggle };
}
