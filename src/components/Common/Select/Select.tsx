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

type DropdownPosition = {
  top?: number;
  bottom?: number;
  left: number;
  width: number;
};

const DROPDOWN_MAX_HEIGHT = 200;
const GAP = 2;

const styles = {
  wrap: css({
    position: 'relative',
    width: '100%',
    fontFamily: theme.fontFamily,
  }),
  trigger: css({
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
    '&:hover': {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.background,
    },
  }),
  triggerLarge: css({
    minHeight: 48,
    padding: `0 ${theme.spacing(3)}px`,
    fontSize: 15,
  }),
  list: (fixed?: DropdownPosition, hasSearch?: boolean) => css({
    position: 'fixed',
    ...(fixed?.top !== undefined && { top: fixed.top }),
    ...(fixed?.bottom !== undefined && { bottom: fixed.bottom }),
    left: fixed?.left,
    width: fixed?.width,
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
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.colors.border,
      borderRadius: 3,
    },
  }),
  searchInput: css({
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
    '&:focus': {
      borderBottomColor: theme.colors.primary,
    },
  }),
  item: (isSelected: boolean, isFocused: boolean) => css({
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    cursor: 'pointer',
    backgroundColor: (isSelected || isFocused) ? `${theme.colors.primary}14` : 'transparent',
    color: isSelected ? theme.colors.primary : theme.colors.text,
    fontSize: 13,
    borderRadius: 4,
    margin: '2px 0',
    '&:hover': {
      backgroundColor: `${theme.colors.primary}26`,
    },
    ...(isFocused && { outline: `2px solid ${theme.colors.primary}`, outlineOffset: -2 }),
  }),
  optionLabel: css({
    fontSize: 13,
    fontWeight: 500,
  }),
  optionDescription: css({
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 2,
  }),
};

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

function useDropdownPosition(isOpen: boolean, triggerRef: React.RefObject<HTMLDivElement>) {
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

    const updatePosition = () => {
      const pos = measure();
      if (pos) setPosition(pos);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isOpen]);

  return position;
}

function useClickOutside(
  refs: React.RefObject<HTMLElement>[],
  onClose: () => void
) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (refs.some(ref => ref.current?.contains(e.target as Node))) return;
      onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [refs, onClose]);
}

function useScrollToHighlighted(
  isOpen: boolean,
  highlightedIndex: number,
  listRef: React.RefObject<HTMLUListElement>
) {
  useLayoutEffect(() => {
    if (!isOpen || highlightedIndex === -1 || !listRef.current) return;
    
    const listEl = listRef.current;
    const optionEl = listEl.querySelector(`[data-option-index="${highlightedIndex}"]`) as HTMLElement;
    if (!optionEl) return;

    const listTop = listEl.scrollTop;
    const listHeight = listEl.clientHeight;
    const optionTop = optionEl.offsetTop;
    const optionHeight = optionEl.offsetHeight;

    if (optionTop < listTop) {
      listEl.scrollTop = optionTop;
    } else if (optionTop + optionHeight > listTop + listHeight) {
      listEl.scrollTop = optionTop + optionHeight - listHeight;
    }
  }, [isOpen, highlightedIndex]);
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
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const position = useDropdownPosition(isOpen, dropdownRef);

  const filteredOptions = enableSearch
    ? options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const selectedLabel = options.find(opt => opt.value === selected)?.label ?? placeholder;

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
  }, []);

  useClickOutside([dropdownRef, listRef], closeDropdown);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnScroll = (e: Event) => {
      if (listRef.current?.contains(e.target as Node)) return;
      closeDropdown();
    };
    window.addEventListener('scroll', closeOnScroll, true);
    return () => window.removeEventListener('scroll', closeOnScroll, true);
  }, [isOpen, closeDropdown]);

  useEffect(() => {
    if (isOpen && enableSearch && position) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [isOpen, enableSearch, position]);

  useEffect(() => {
    if (!isOpen) return;
    const idx = filteredOptions.findIndex(opt => opt.value === selected);
    setHighlightedIndex(Math.max(0, idx));
  }, [isOpen]);

  useScrollToHighlighted(isOpen, highlightedIndex, listRef);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const optionCount = filteredOptions.length;
      if (optionCount === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => Math.min(prev + 1, optionCount - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredOptions[highlightedIndex]) {
            onChange(filteredOptions[highlightedIndex].value);
            closeDropdown();
          } else if (allowCustomOption && searchTerm) {
            onChange(searchTerm);
            closeDropdown();
          }
          break;
        case 'Escape':
          e.preventDefault();
          closeDropdown();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, filteredOptions, onChange, searchTerm, allowCustomOption, closeDropdown]);

  const handleSelectOption = (value: string | number) => {
    onChange(value);
    closeDropdown();
  };

  return (
    <div ref={dropdownRef} css={styles.wrap} id={id}>
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        css={[styles.trigger, size === 'large' && styles.triggerLarge]}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span>{selectedLabel}</span>
        {isOpen ? <HiChevronUp size={14} /> : <HiChevronDown size={14} />}
      </div>
      {isOpen && position && createPortal(
        <ul ref={listRef} css={styles.list(position, enableSearch)} role="listbox">
          {enableSearch && (
            <input
              ref={searchInputRef}
              type="text"
              css={styles.searchInput}
              placeholder="검색..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          )}
          {enableSearch && allowCustomOption && searchTerm && (
            <li
              role="option"
              data-option-index={-1}
              css={styles.item(false, highlightedIndex === -1)}
              onClick={() => handleSelectOption(searchTerm)}
              onMouseEnter={() => setHighlightedIndex(-1)}
            >
              <span css={styles.optionLabel}>"{searchTerm}"로 검색</span>
            </li>
          )}
          {filteredOptions.map((option, index) => (
            <li
              key={option.id ?? option.value}
              role="option"
              aria-selected={option.value === selected}
              data-option-index={index}
              css={styles.item(option.value === selected, index === highlightedIndex)}
              onClick={() => handleSelectOption(option.value)}
              onMouseEnter={() => setHighlightedIndex(index)}
            >
              <span css={styles.optionLabel}>{option.label}</span>
              {option.description && (
                <span css={styles.optionDescription}>{option.description}</span>
              )}
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
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const position = useDropdownPosition(isOpen, dropdownRef);

  const filteredOptions = enableSearch
    ? options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
    : options;

  const selectedLabels = options
    .filter(opt => selectedItems.includes(opt.value))
    .map(opt => opt.label)
    .join(', ');

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
  }, []);

  useClickOutside([dropdownRef, listRef], closeDropdown);

  useEffect(() => {
    if (!isOpen) return;
    const closeOnScroll = (e: Event) => {
      if (listRef.current?.contains(e.target as Node)) return;
      closeDropdown();
    };
    window.addEventListener('scroll', closeOnScroll, true);
    return () => window.removeEventListener('scroll', closeOnScroll, true);
  }, [isOpen, closeDropdown]);

  useEffect(() => {
    if (isOpen && enableSearch && position) {
      requestAnimationFrame(() => searchInputRef.current?.focus());
    }
  }, [isOpen, enableSearch, position]);

  useScrollToHighlighted(isOpen, highlightedIndex, listRef);

  const handleSelect = useCallback((value: string | number) => {
    const isSelected = selectedItems.includes(value);
    const updated = isSelected
      ? selectedItems.filter(item => item !== value)
      : [...selectedItems, value];
    onChange(updated);
    if (isSelected && onRemove) onRemove(value);
  }, [selectedItems, onChange, onRemove]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const optionCount = filteredOptions.length;
      if (optionCount === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex(prev => Math.min(prev + 1, optionCount - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredOptions[highlightedIndex]) {
            handleSelect(filteredOptions[highlightedIndex].value);
          }
          break;
        case 'Escape':
          e.preventDefault();
          closeDropdown();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, filteredOptions, handleSelect, closeDropdown]);

  return (
    <div ref={dropdownRef} css={styles.wrap} id={id}>
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        css={[styles.trigger, size === 'large' && styles.triggerLarge]}
        onClick={() => setIsOpen(prev => !prev)}
      >
        <span>{selectedItems.length > 0 ? selectedLabels : placeholder}</span>
        {isOpen ? <HiChevronUp size={14} /> : <HiChevronDown size={14} />}
      </div>
      {isOpen && position && createPortal(
        <ul ref={listRef} css={styles.list(position, enableSearch)} role="listbox">
          {enableSearch && (
            <input
              ref={searchInputRef}
              type="text"
              css={styles.searchInput}
              placeholder="검색..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onClick={e => e.stopPropagation()}
            />
          )}
          {filteredOptions.map((option, index) => {
            const isSelected = selectedItems.includes(option.value);
            return (
              <li
                key={option.id ?? option.value}
                role="option"
                aria-selected={isSelected}
                data-option-index={index}
                css={styles.item(isSelected, index === highlightedIndex)}
                onMouseEnter={() => setHighlightedIndex(index)}
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
                    onChange={() => handleSelect(option.value)}
                    css={css({ cursor: 'pointer', marginTop: 2 })}
                  />
                  <div>
                    <span css={styles.optionLabel}>{option.label}</span>
                    {option.description && (
                      <span css={styles.optionDescription}>{option.description}</span>
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
