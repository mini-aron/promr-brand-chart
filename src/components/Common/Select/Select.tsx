/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useRef, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { theme } from '@/theme';

export type Option = {
  label: string;
  value: string | number;
  id?: number;
  description?: string;
};

export type SelectSize = 'default' | 'large';

const DROPDOWN_MAX_HEIGHT = 200;
const GAP = 2;

const wrap = css({ position: 'relative', width: '100%' });

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

const listStyle = (hasSearch: boolean) =>
  css({
    position: 'absolute',
    left: 0,
    right: 0,
    top: `calc(100% + ${GAP}px)`,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.sm,
    background: theme.colors.surface,
    padding: hasSearch ? `0 6px ${theme.spacing(1)}px 6px` : '8px 6px',
    listStyleType: 'none',
    boxShadow: theme.shadow.md,
    zIndex: 10000,
    maxHeight: DROPDOWN_MAX_HEIGHT,
    overflowY: 'auto',
    ...(hasSearch && { '& li:first-of-type': { marginTop: 0 } }),
  });

const searchInput = css({
  position: 'sticky',
  top: 0,
  width: 'calc(100% + 12px)',
  margin: '0 -6px',
  padding: '6px 8px 4px 8px',
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

const optionLabel = css({ fontWeight: 500 });
const optionDescription = css({ fontSize: 11, color: theme.colors.textMuted, marginTop: 2 });
const checkboxLabel = css({
  display: 'flex',
  alignItems: 'flex-start',
  cursor: 'pointer',
  gap: theme.spacing(1),
  width: '100%',
});

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

export type MultipleSelectProps = Omit<BaseProps, 'allowCustomOption'> & {
  selectedItems: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
  onRemove?: (removed: string | number) => void;
};

type SelectCoreProps = BaseProps & {
  value: (string | number)[];
  onChange: (value: (string | number)[]) => void;
  multiple: boolean;
  onRemove?: (removed: string | number) => void;
};

function useSelectState(
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  options: Option[],
  enableSearch: boolean,
  selectedValue: string | number | null,
  onSelect: (opt: Option) => void
) {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = useMemo(
    () =>
      enableSearch
        ? options.filter((o) => o.label.toLowerCase().includes(searchTerm.toLowerCase()))
        : options,
    [options, enableSearch, searchTerm]
  );

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
    if (isOpen && enableSearch) requestAnimationFrame(() => searchInputRef.current?.focus());
  }, [isOpen, enableSearch]);

  useEffect(() => {
    if (!isOpen) return;
    const idx = filteredOptions.findIndex((o) => o.value === selectedValue);
    setHighlightedIndex(idx >= 0 ? idx : 0);
  }, [isOpen, filteredOptions, selectedValue]);

  useLayoutEffect(() => {
    if (!isOpen || highlightedIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-option-index="${highlightedIndex}"]`) as HTMLElement;
    el?.scrollIntoView({ block: 'nearest' });
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
          if (opt) onSelect(opt);
          break;
        case 'Escape':
          e.preventDefault();
          closeDropdown();
          break;
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, highlightedIndex, filteredOptions, onSelect, closeDropdown]);

  return {
    searchTerm,
    setSearchTerm,
    filteredOptions,
    highlightedIndex,
    setHighlightedIndex,
    closeDropdown,
    dropdownRef,
    listRef,
    searchInputRef,
  };
}

function SelectCore({
  options,
  value,
  onChange,
  onRemove,
  multiple,
  placeholder = '옵션 선택',
  enableSearch = false,
  size = 'default',
  allowCustomOption = false,
  id,
  'aria-label': ariaLabel,
}: SelectCoreProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedValue = multiple ? null : value[0] ?? null;

  const handleSelect = useCallback(
    (opt: Option) => {
      if (multiple) {
        const next = value.includes(opt.value)
          ? value.filter((x) => x !== opt.value)
          : [...value, opt.value];
        onChange(next);
        if (value.includes(opt.value) && onRemove) onRemove(opt.value);
      } else {
        onChange([opt.value]);
        setIsOpen(false);
      }
    },
    [multiple, value, onChange, onRemove]
  );

  const {
    searchTerm,
    setSearchTerm,
    filteredOptions,
    highlightedIndex,
    setHighlightedIndex,
    closeDropdown,
    dropdownRef,
    listRef,
    searchInputRef,
  } = useSelectState(isOpen, setIsOpen, options, enableSearch, selectedValue, handleSelect);

  const selectOption = useCallback(
    (v: string | number) => {
      if (multiple) handleSelect(options.find((o) => o.value === v)!);
      else {
        onChange([v]);
        closeDropdown();
      }
    },
    [multiple, handleSelect, options, onChange, closeDropdown]
  );

  const displayLabel = value.length > 0
    ? options.filter((o) => value.includes(o.value)).map((o) => o.label).join(', ')
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
      {isOpen && (
        <ul ref={listRef} css={listStyle(enableSearch)} role="listbox">
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
          {filteredOptions.map((opt, i) => {
            const isSelected = value.includes(opt.value);
            return multiple ? (
              <li
                key={opt.id ?? opt.value}
                role="option"
                aria-selected={isSelected}
                data-option-index={i}
                css={item(isSelected, i === highlightedIndex)}
                onMouseEnter={() => setHighlightedIndex(i)}
              >
                <label css={checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelect(opt)}
                    css={css({ cursor: 'pointer', marginTop: 2 })}
                  />
                  <div>
                    <span css={optionLabel}>{opt.label}</span>
                    {opt.description && <span css={optionDescription}>{opt.description}</span>}
                  </div>
                </label>
              </li>
            ) : (
              <li
                key={opt.id ?? opt.value}
                role="option"
                aria-selected={isSelected}
                data-option-index={i}
                css={item(isSelected, i === highlightedIndex)}
                onClick={() => selectOption(opt.value)}
                onMouseEnter={() => setHighlightedIndex(i)}
              >
                <span css={optionLabel}>{opt.label}</span>
                {opt.description && <span css={optionDescription}>{opt.description}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function SingleSelect(props: SingleSelectProps) {
  const { selected, onChange, ...rest } = props;
  return (
    <SelectCore
      {...rest}
      value={selected != null ? [selected] : []}
      onChange={([v]) => onChange(v)}
      multiple={false}
    />
  );
}

export function MultipleSelect(props: MultipleSelectProps) {
  const { selectedItems, onChange, onRemove, ...rest } = props;
  return (
    <SelectCore
      {...rest}
      value={selectedItems}
      onChange={onChange}
      onRemove={onRemove}
      multiple
    />
  );
}
