import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { clsx } from 'clsx';
import * as s from './Select.css';

export type Option = {
  label: string;
  value: string | number;
  id?: number;
  description?: string;
};

export type SelectSize = 'default' | 'large';

const ICON_SIZE = 14;

function getItemClass(isSelected: boolean, isFocused: boolean): string {
  if (isSelected && isFocused) return s.itemSelectedFocused;
  if (isSelected) return s.itemSelected;
  if (isFocused) return s.itemFocused;
  return s.item;
}

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
    if (!isOpen) return;
    const idx = filteredOptions.findIndex((o) => o.value === selectedValue);
    setHighlightedIndex(idx >= 0 ? idx : 0);
    requestAnimationFrame(() =>
      (enableSearch ? searchInputRef.current : dropdownRef.current)?.focus()
    );
  }, [isOpen, filteredOptions, selectedValue, enableSearch]);

  useLayoutEffect(() => {
    if (!isOpen || highlightedIndex < 0 || !listRef.current) return;
    listRef.current
      .querySelector<HTMLElement>(`[data-option-index="${highlightedIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, highlightedIndex]);

  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      const next = e.relatedTarget as Node | null;
      if (next && dropdownRef.current?.contains(next)) return;
      closeDropdown();
    },
    [closeDropdown]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const { length: n } = filteredOptions;
      if (n === 0) return;
      const keyHandlers: Record<string, () => void> = {
        ArrowDown: () => setHighlightedIndex((p) => Math.min(p + 1, n - 1)),
        ArrowUp: () => setHighlightedIndex((p) => Math.max(p - 1, 0)),
        Enter: () => {
          const opt = filteredOptions[highlightedIndex];
          if (opt) onSelect(opt);
        },
        Escape: () => closeDropdown(),
      };
      const handler = keyHandlers[e.key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    },
    [highlightedIndex, filteredOptions, onSelect, closeDropdown]
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredOptions,
    highlightedIndex,
    setHighlightedIndex,
    closeDropdown,
    handleBlur,
    handleKeyDown,
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
    handleBlur,
    handleKeyDown,
    dropdownRef,
    listRef,
    searchInputRef,
  } = useSelectState(isOpen, setIsOpen, options, enableSearch, selectedValue, handleSelect);

  const displayLabel = value.length > 0
    ? options.filter((o) => value.includes(o.value)).map((o) => o.label).join(', ')
    : placeholder;

  return (
    <div
      ref={dropdownRef}
      className={s.wrap}
      id={id}
      tabIndex={isOpen ? -1 : undefined}
      onBlur={handleBlur}
      onKeyDown={isOpen ? handleKeyDown : undefined}
    >
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className={clsx(s.trigger, size === 'large' && s.triggerLarge)}
        onClick={() => setIsOpen((p) => !p)}
      >
        <span>{displayLabel}</span>
        {isOpen ? <HiChevronUp size={ICON_SIZE} /> : <HiChevronDown size={ICON_SIZE} />}
      </div>
      {isOpen && (
        <ul ref={listRef} className={enableSearch ? s.listWithSearch : s.list} role="listbox">
          {enableSearch && (
            <input
              ref={searchInputRef}
              type="text"
              className={s.searchInput}
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
              className={getItemClass(false, highlightedIndex === -1)}
              onClick={() => {
                onChange([searchTerm]);
                closeDropdown();
              }}
              onMouseEnter={() => setHighlightedIndex(-1)}
            >
              <span className={s.optionLabel}>"{searchTerm}"로 검색</span>
            </li>
          )}
          {filteredOptions.map((opt, i) => {
            const isSelected = value.includes(opt.value);
            const content = (
              <div className={s.optionContent}>
                <span className={s.optionLabel}>{opt.label}</span>
                {opt.description && <span className={s.optionDescription}>{opt.description}</span>}
              </div>
            );
            return (
              <li
                key={opt.id ?? opt.value}
                role="option"
                aria-selected={isSelected}
                data-option-index={i}
                className={getItemClass(isSelected, i === highlightedIndex)}
                onMouseEnter={() => setHighlightedIndex(i)}
                onClick={multiple ? undefined : () => { onChange([opt.value]); closeDropdown(); }}
              >
                {multiple ? (
                  <label className={s.checkboxLabel}>
                    <input
                      type="checkbox"
                      className={s.checkboxInput}
                      checked={isSelected}
                      onChange={() => handleSelect(opt)}
                    />
                    {content}
                  </label>
                ) : (
                  content
                )}
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
