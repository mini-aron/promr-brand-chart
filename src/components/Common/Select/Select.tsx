/** @jsxImportSource @emotion/react */
import { createPortal } from 'react-dom';
import { css } from '@emotion/react';
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { theme } from '@/theme';

export type Option = {
  label: string;
  value: string | number;
  id?: number;
  description?: string;
};

export type SelectSize = 'default' | 'large';

type DropdownPosition = { top?: number; bottom?: number; left: number; width: number };

const DROPDOWN_MAX_HEIGHT = 200;
const GAP = 2;

const wrap = css({
  position: 'relative',
  width: '100%',
  fontFamily: theme.fontFamily,
});

const trigger = css({
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
  background: theme.colors.surface,
  '&:hover': { borderColor: theme.colors.primary, backgroundColor: theme.colors.background },
});

const triggerLarge = css({ minHeight: 48, padding: `0 ${theme.spacing(3)}px`, fontSize: 15 });

const listStyle = (pos: DropdownPosition, hasSearch: boolean) =>
  css({
    position: 'fixed' as const,
    ...(pos.top !== undefined && { top: pos.top }),
    ...(pos.bottom !== undefined && { bottom: pos.bottom }),
    left: pos.left,
    width: pos.width,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.sm,
    background: theme.colors.surface,
    padding: hasSearch ? `0 6px ${theme.spacing(1)}px 6px` : '8px 6px',
    listStyleType: 'none',
    boxShadow: theme.shadow.md,
    zIndex: 10000,
    maxHeight: DROPDOWN_MAX_HEIGHT,
    overflowY: 'auto',
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': { width: 6 },
    '&::-webkit-scrollbar-thumb': { backgroundColor: theme.colors.border, borderRadius: 3 },
  });

const searchInput = css({
  position: 'sticky',
  top: 0,
  left: 0,
  right: 0,
  width: 'calc(100% + 12px)',
  margin: '0 -6px',
  padding: '6px 8px',
  border: 'none',
  borderBottom: `1px solid ${theme.colors.border}`,
  background: theme.colors.surface,
  fontSize: 13,
  outline: 'none',
  color: theme.colors.text,
  boxSizing: 'border-box',
  borderTopLeftRadius: theme.radius.sm,
  borderTopRightRadius: theme.radius.sm,
  '&:focus': { borderBottomColor: theme.colors.primary },
});

const item = (isSelected: boolean, isFocused: boolean) =>
  css({
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    cursor: 'pointer',
    backgroundColor: isSelected || isFocused ? `${theme.colors.primary}14` : 'transparent',
    color: isSelected ? theme.colors.primary : theme.colors.text,
    fontSize: 13,
    borderRadius: 4,
    margin: '2px 0',
    '&:hover': { backgroundColor: `${theme.colors.primary}26` },
    ...(isFocused && { outline: `2px solid ${theme.colors.primary}`, outlineOffset: -2 }),
  });

const optionLabel = css({ fontSize: 13, fontWeight: 500 });
const optionDescription = css({ fontSize: 11, color: theme.colors.textMuted, marginTop: 2 });

type BaseProps = {
  options: Option[];
  placeholder?: string;
  enableSearch?: boolean;
  size?: SelectSize;
  allowCustomOption?: boolean;
  id?: string;
  'aria-label'?: string;
};

export type SingleSelectProps = BaseProps & {
  selected: string | number | null;
  onChange: (value: string | number) => void;
};

export type MultipleSelectProps = BaseProps & {
  selectedItems: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
  onRemove?: (removed: string | number) => void;
};

function useDropdownPosition(isOpen: boolean, triggerRef: React.RefObject<HTMLDivElement | null>) {
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
        ...(openUp ? { bottom: window.innerHeight - rect.top + GAP } : { top: rect.bottom + GAP }),
      };
    };
    const update = () => {
      const pos = measure();
      if (pos) setPosition(pos);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [isOpen, triggerRef]);
  return position;
}

function useSelectDropdown(
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  options: Option[],
  enableSearch: boolean,
  selectedValue: string | number | null,
  onEnter: (opt: Option) => void
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = enableSearch
    ? options.filter((o) => o.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
  }, [setIsOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if ([dropdownRef, listRef].some((r) => r.current?.contains(e.target as Node))) return;
      closeDropdown();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [closeDropdown]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: Event) => {
      if (listRef.current?.contains(e.target as Node)) return;
      closeDropdown();
    };
    window.addEventListener('scroll', handler, true);
    return () => window.removeEventListener('scroll', handler, true);
  }, [isOpen, closeDropdown]);

  useEffect(() => {
    if (isOpen && enableSearch) requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [isOpen, enableSearch]);

  useEffect(() => {
    if (!isOpen) return;
    const idx = filteredOptions.findIndex((o) => o.value === selectedValue);
    setHighlightedIndex(idx >= 0 ? idx : 0);
  }, [isOpen, filteredOptions, selectedValue]);

  useLayoutEffect(() => {
    if (!isOpen || highlightedIndex < 0 || !listRef.current) return;
    const list = listRef.current;
    const el = list.querySelector(`[data-option-index="${highlightedIndex}"]`) as HTMLElement;
    if (!el) return;
    const listTop = list.scrollTop;
    const listH = list.clientHeight;
    const optTop = el.offsetTop;
    const optH = el.offsetHeight;
    if (optTop < listTop) list.scrollTop = optTop;
    else if (optTop + optH > listTop + listH) list.scrollTop = optTop + optH - listH;
  }, [isOpen, highlightedIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      const n = filteredOptions.length;
      if (n === 0) return;
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((p) => Math.min(p + 1, n - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((p) => Math.max(p - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          const opt = filteredOptions[highlightedIndex];
          if (opt) onEnter(opt);
          break;
        case 'Escape':
          e.preventDefault();
          closeDropdown();
          break;
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, highlightedIndex, filteredOptions, onEnter, closeDropdown]);

  const position = useDropdownPosition(isOpen, dropdownRef);

  return {
    position,
    filteredOptions,
    searchTerm,
    setSearchTerm,
    highlightedIndex,
    setHighlightedIndex,
    closeDropdown,
    dropdownRef,
    listRef,
    searchInputRef,
  };
}

export function SingleSelect({
  options,
  selected,
  onChange,
  placeholder = '옵션 선택',
  enableSearch = false,
  size = 'default',
  allowCustomOption = false,
  id,
  'aria-label': ariaLabel,
}: SingleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onEnter = useCallback(
    (opt: Option) => {
      onChange(opt.value);
      setIsOpen(false);
    },
    [onChange]
  );
  const {
    position,
    filteredOptions,
    searchTerm,
    setSearchTerm,
    highlightedIndex,
    setHighlightedIndex,
    closeDropdown,
    dropdownRef,
    listRef,
    searchInputRef,
  } = useSelectDropdown(isOpen, setIsOpen, options, enableSearch, selected, onEnter);

  const selectOption = useCallback(
    (value: string | number) => {
      onChange(value);
      closeDropdown();
    },
    [onChange, closeDropdown]
  );

  const displayLabel = options.find((o) => o.value === selected)?.label ?? placeholder;

  return (
    <div ref={dropdownRef} css={wrap} id={id}>
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        css={[trigger, size === 'large' && triggerLarge]}
        onClick={() => setIsOpen((p) => !p)}
      >
        <span>{displayLabel}</span>
        {isOpen ? <HiChevronUp size={14} /> : <HiChevronDown size={14} />}
      </div>
      {isOpen && position &&
        createPortal(
          <ul ref={listRef} css={listStyle(position, enableSearch)} role="listbox">
            {enableSearch && (
              <input
                ref={searchInputRef}
                type="text"
                css={searchInput}
                placeholder="검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {enableSearch && allowCustomOption && searchTerm && (
              <li
                role="option"
                data-option-index={-1}
                css={item(false, highlightedIndex === -1)}
                onClick={() => selectOption(searchTerm)}
                onMouseEnter={() => setHighlightedIndex(-1)}
              >
                <span css={optionLabel}>"{searchTerm}"로 검색</span>
              </li>
            )}
            {filteredOptions.map((opt, i) => (
              <li
                key={opt.id ?? opt.value}
                role="option"
                aria-selected={opt.value === selected}
                data-option-index={i}
                css={item(opt.value === selected, i === highlightedIndex)}
                onClick={() => selectOption(opt.value)}
                onMouseEnter={() => setHighlightedIndex(i)}
              >
                <span css={optionLabel}>{opt.label}</span>
                {opt.description && <span css={optionDescription}>{opt.description}</span>}
              </li>
            ))}
          </ul>,
          document.body
        )}
    </div>
  );
}

export function MultipleSelect({
  options,
  selectedItems,
  onChange,
  onRemove,
  placeholder = '옵션 선택',
  enableSearch = false,
  size = 'default',
  id,
  'aria-label': ariaLabel,
}: MultipleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = useCallback(
    (value: string | number) => {
      const next = selectedItems.includes(value)
        ? selectedItems.filter((x) => x !== value)
        : [...selectedItems, value];
      onChange(next);
      if (selectedItems.includes(value) && onRemove) onRemove(value);
    },
    [selectedItems, onChange, onRemove]
  );
  const onEnter = useCallback(
    (opt: Option) => handleSelect(opt.value),
    [handleSelect]
  );
  const {
    position,
    filteredOptions,
    searchTerm,
    setSearchTerm,
    highlightedIndex,
    setHighlightedIndex,
    dropdownRef,
    listRef,
    searchInputRef,
  } = useSelectDropdown(isOpen, setIsOpen, options, enableSearch, null, onEnter);

  const displayLabel =
    selectedItems.length > 0
      ? options.filter((o) => selectedItems.includes(o.value)).map((o) => o.label).join(', ')
      : placeholder;

  return (
    <div ref={dropdownRef} css={wrap} id={id}>
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        css={[trigger, size === 'large' && triggerLarge]}
        onClick={() => setIsOpen((p) => !p)}
      >
        <span>{displayLabel}</span>
        {isOpen ? <HiChevronUp size={14} /> : <HiChevronDown size={14} />}
      </div>
      {isOpen && position &&
        createPortal(
          <ul ref={listRef} css={listStyle(position, enableSearch)} role="listbox">
            {enableSearch && (
              <input
                ref={searchInputRef}
                type="text"
                css={searchInput}
                placeholder="검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            )}
            {filteredOptions.map((opt, i) => {
              const isSelected = selectedItems.includes(opt.value);
              return (
                <li
                  key={opt.id ?? opt.value}
                  role="option"
                  aria-selected={isSelected}
                  data-option-index={i}
                  css={item(isSelected, i === highlightedIndex)}
                  onMouseEnter={() => setHighlightedIndex(i)}
                >
                  <label
                    css={css({
                      display: 'flex',
                      alignItems: 'flex-start',
                      cursor: 'pointer',
                      width: '100%',
                      gap: theme.spacing(1),
                    })}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelect(opt.value)}
                      css={css({ cursor: 'pointer', marginTop: 2 })}
                    />
                    <div>
                      <span css={optionLabel}>{opt.label}</span>
                      {opt.description && (
                        <span css={optionDescription}>{opt.description}</span>
                      )}
                    </div>
                  </label>
                </li>
              );
            })}
          </ul>,
          document.body
        )}
    </div>
  );
}
