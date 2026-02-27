/** @jsxImportSource @emotion/react */
import { createPortal } from 'react-dom';
import { css } from '@emotion/react';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { theme } from '@/theme';

export type Option = {
  label: string;
  value: string | number;
  id?: number;
};

const dropdownWrap = css({
  background: theme.colors.surface,
  position: 'relative',
  width: '100%',
  margin: 0,
  fontFamily: theme.fontFamily,
});

const dropdownBox = css({
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.sm,
  padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: theme.colors.text,
  minHeight: 32,
  fontSize: 13,
  '& span': {
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
  },
});

type DropdownPosition = {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
};

const dropdownList = (hasSearch: boolean, fixed?: DropdownPosition) => css({
  position: fixed ? 'fixed' : 'absolute',
  ...(fixed
    ? {
        ...(fixed.top !== undefined && { top: fixed.top }),
        ...(fixed.bottom !== undefined && { bottom: fixed.bottom }),
        left: fixed.left,
        width: fixed.width,
        minWidth: fixed.width,
      }
    : { top: '100%', left: 0, width: '100%' }),
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.sm,
  background: theme.colors.surface,
  margin: 0,
  marginTop: fixed ? 0 : 2,
  padding: hasSearch ? '0 0 6px 0' : '6px 0',
  listStyleType: 'none',
  boxShadow: theme.shadow.md,
  zIndex: 10000,
  maxHeight: 200,
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  '&::-webkit-scrollbar': { width: 6 },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.colors.border,
    borderRadius: 3,
  },
});

const searchInput = css({
  position: 'sticky',
  top: 0,
  width: '100%',
  padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  border: 'none',
  borderBottom: `1px solid ${theme.colors.border}`,
  background: theme.colors.surface,
  fontSize: 13,
  outline: 'none',
  zIndex: 1,
  color: theme.colors.text,
  '&:focus': {
    borderBottomColor: theme.colors.primary,
  },
  '&::placeholder': {
    color: theme.colors.textMuted,
  },
});

const dropdownItem = (selected: boolean) => css({
  padding: `${theme.spacing(0.5)}px ${theme.spacing(2)}px`,
  cursor: 'pointer',
  background: selected ? `${theme.colors.primary}14` : 'transparent',
  color: selected ? theme.colors.primary : theme.colors.text,
  '&:hover': {
    backgroundColor: selected ? `${theme.colors.primary}22` : `${theme.colors.primary}14`,
  },
  fontSize: 13,
  display: 'flex',
  alignItems: 'center',
});

type BaseProps = {
  options: Option[];
  placeholder?: string;
  enableSearch?: boolean;
  id?: string;
  'aria-label'?: string;
};

export type SingleSelectProps = BaseProps & {
  selected: string | number | null;
  onChange: (value: string | number) => void;
};

const DROPDOWN_MAX_HEIGHT = 200;
const GAP = 2;

function useDropdownPosition(
  isOpen: boolean,
  triggerRef: React.RefObject<HTMLDivElement | null>
) {
  const [position, setPosition] = useState<DropdownPosition | null>(null);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) {
      setPosition(null);
      return;
    }
    const measure = () => {
      if (!triggerRef.current) return null;
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom - GAP;
      const openUp = spaceBelow < DROPDOWN_MAX_HEIGHT && rect.top > spaceBelow;
      return {
        left: rect.left,
        width: rect.width,
        ...(openUp
          ? { bottom: window.innerHeight - rect.top + GAP }
          : { top: rect.bottom + GAP }),
      };
    };
    const pos = measure();
    if (pos) setPosition(pos);
    const onResize = () => {
      const next = measure();
      if (next) setPosition(next);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [isOpen, triggerRef]);

  return position;
}

export function SingleSelect({
  options,
  selected,
  onChange,
  placeholder = '옵션 선택',
  enableSearch = false,
  id,
  'aria-label': ariaLabel,
}: SingleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listPosition = useDropdownPosition(isOpen, dropdownRef);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current?.contains(target) ||
        listRef.current?.contains(target)
      )
        return;
      setIsOpen(false);
      if (enableSearch) setSearchTerm('');
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [enableSearch]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnScroll = (e: Event) => {
      if (listRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
      if (enableSearch) setSearchTerm('');
    };
    window.addEventListener('scroll', closeOnScroll, true);
    return () => window.removeEventListener('scroll', closeOnScroll, true);
  }, [isOpen, enableSearch]);

  const filteredOptions = enableSearch
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const selectedLabel =
    options.find((opt) => opt.value === selected)?.label ?? placeholder;

  const dropdownContent = listPosition && (
    <ul
      ref={listRef}
      css={dropdownList(enableSearch, listPosition)}
      role="listbox"
    >
      {enableSearch && (
        <input
          type="text"
          css={searchInput}
          placeholder="검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          aria-label="옵션 검색"
        />
      )}
      {filteredOptions.map((option) => (
        <li
          key={String(option.id ?? option.value)}
          role="option"
          aria-selected={option.value === selected}
          css={dropdownItem(option.value === selected)}
          onClick={() => {
            onChange(option.value);
            setIsOpen(false);
            if (enableSearch) setSearchTerm('');
          }}
        >
          {option.label}
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={dropdownRef} css={dropdownWrap} id={id}>
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        css={dropdownBox}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedLabel}</span>
        <span css={css({ fontSize: 12, color: theme.colors.textMuted, display: 'inline-flex' })}>
          {isOpen ? <HiChevronUp size={14} /> : <HiChevronDown size={14} />}
        </span>
      </div>
      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  );
}

export type MultipleSelectProps = BaseProps & {
  selectedItems: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
  onRemove?: (removed: string | number) => void;
};

export function MultipleSelect({
  options,
  selectedItems,
  onChange,
  onRemove,
  placeholder = '옵션 선택',
  enableSearch = false,
  id,
  'aria-label': ariaLabel,
}: MultipleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listPosition = useDropdownPosition(isOpen, dropdownRef);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current?.contains(target) ||
        listRef.current?.contains(target)
      )
        return;
      setIsOpen(false);
      if (enableSearch) setSearchTerm('');
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [enableSearch]);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnScroll = (e: Event) => {
      if (listRef.current?.contains(e.target as Node)) return;
      setIsOpen(false);
      if (enableSearch) setSearchTerm('');
    };
    window.addEventListener('scroll', closeOnScroll, true);
    return () => window.removeEventListener('scroll', closeOnScroll, true);
  }, [isOpen, enableSearch]);

  const filteredOptions = enableSearch
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (value: string | number) => {
    const isSelected = selectedItems.includes(value);
    const updated = isSelected
      ? selectedItems.filter((item) => item !== value)
      : [...selectedItems, value];
    onChange(updated);
    if (isSelected && onRemove) onRemove(value);
  };

  const selectedLabels = options
    .filter((opt) => selectedItems.includes(opt.value))
    .map((opt) => opt.label)
    .join(', ');

  const dropdownContent = listPosition && (
    <ul
      ref={listRef}
      css={dropdownList(enableSearch, listPosition)}
      role="listbox"
    >
      {enableSearch && (
        <input
          type="text"
          css={searchInput}
          placeholder="검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          aria-label="옵션 검색"
        />
      )}
      {filteredOptions.map((option) => (
        <li
          key={String(option.id ?? option.value)}
          role="option"
          aria-selected={selectedItems.includes(option.value)}
          css={dropdownItem(selectedItems.includes(option.value))}
        >
          <label
            css={css({
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              userSelect: 'none',
              width: '100%',
              fontSize: 13,
            })}
          >
            <input
              type="checkbox"
              checked={selectedItems.includes(option.value)}
              onChange={() => handleSelect(option.value)}
              css={css({ marginRight: theme.spacing(2), cursor: 'pointer' })}
            />
            {option.label}
          </label>
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={dropdownRef} css={dropdownWrap} id={id}>
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        css={dropdownBox}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedItems.length > 0 ? selectedLabels : placeholder}</span>
        <span css={css({ fontSize: 12, color: theme.colors.textMuted, display: 'inline-flex' })}>
          {isOpen ? <HiChevronUp size={14} /> : <HiChevronDown size={14} />}
        </span>
      </div>
      {isOpen && createPortal(dropdownContent, document.body)}
    </div>
  );
}
