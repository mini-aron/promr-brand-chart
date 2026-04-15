import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { getItemClass, SingleSelect } from './Select';
import * as s from './Select.css';
import * as hs from './HospitalSearchSelect.css';

export type HospitalOption = {
  label: string;
  value: string | number;
  id?: number;
  address?: string;
  businessNumber?: string;
};

type SearchMode = 'address' | 'businessNumber';

type HospitalSearchSelectProps = {
  options: HospitalOption[];
  selected: string | number | null;
  onChange: (value: string | number | null) => void;
  placeholder?: string;
  openOnFocus?: boolean;
  id?: string;
  'aria-label'?: string;
};

export function HospitalSearchSelect({
  options,
  selected,
  onChange,
  placeholder = '병의원 검색',
  openOnFocus = false,
  id,
  'aria-label': ariaLabel,
}: HospitalSearchSelectProps) {
  const [nameSearchTerm, setNameSearchTerm] = useState('');
  const [secondarySearchTerm, setSecondarySearchTerm] = useState('');
  const [searchMode, setSearchMode] = useState<SearchMode>('address');
  const [isFocused, setIsFocused] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const dropdownInputRef = useRef<HTMLInputElement>(null);

  const isOpen = nameSearchTerm.length > 0 || (openOnFocus && isFocused);

  const filteredOptions = useMemo(() => {
    const nameTerm = nameSearchTerm.toLowerCase().trim();
    const secondaryTerm = secondarySearchTerm.toLowerCase().trim();

    return options.filter((o) => {
      const nameMatch = !nameTerm || o.label.toLowerCase().includes(nameTerm);
      const secondaryValue = searchMode === 'address' ? o.address : o.businessNumber;
      const secondaryMatch =
        !secondaryTerm || (secondaryValue?.toLowerCase().includes(secondaryTerm) ?? false);
      return nameMatch && secondaryMatch;
    });
  }, [options, nameSearchTerm, secondarySearchTerm, searchMode]);

  const closeDropdown = useCallback(() => {
    setNameSearchTerm('');
    setSecondarySearchTerm('');
    if (openOnFocus) setIsFocused(false);
  }, [openOnFocus]);

  const handleSelect = useCallback(
    (value: string | number) => {
      onChange(value);
      closeDropdown();
    },
    [onChange, closeDropdown],
  );

  useEffect(() => {
    if (!isOpen) return;
    const idx = filteredOptions.findIndex((o) => o.value === selected);
    setHighlightedIndex(idx >= 0 ? idx : 0);
  }, [isOpen, filteredOptions, selected]);

  useLayoutEffect(() => {
    if (!isOpen || highlightedIndex < 0 || !listRef.current) return;
    listRef.current
      .querySelector<HTMLElement>(`[data-option-index="${highlightedIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, highlightedIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      if (dropdownRef.current?.contains(e.target as Node)) return;
      closeDropdown();
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, closeDropdown]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const n = filteredOptions.length;
      if (n === 0) return;
      const handlers: Record<string, () => void> = {
        ArrowDown: () => setHighlightedIndex((p) => Math.min(p + 1, n - 1)),
        ArrowUp: () => setHighlightedIndex((p) => Math.max(p - 1, 0)),
        Enter: () => {
          const opt = filteredOptions[highlightedIndex];
          if (opt) handleSelect(opt.value);
        },
        Escape: () => closeDropdown(),
      };
      const handler = handlers[e.key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    },
    [highlightedIndex, filteredOptions, handleSelect, closeDropdown],
  );

  const handleListClick = useCallback(
    (e: React.MouseEvent) => {
      const li = (e.target as HTMLElement).closest('li[data-option-index]') as HTMLElement | null;
      if (!li) return;
      const idx = parseInt(li.dataset.optionIndex ?? '', 10);
      const opt = filteredOptions[idx];
      if (opt) handleSelect(opt.value);
    },
    [filteredOptions, handleSelect],
  );

  const handleListMouseOver = useCallback((e: React.MouseEvent) => {
    const li = (e.target as HTMLElement).closest('li[data-option-index]') as HTMLElement | null;
    if (!li) return;
    const idx = parseInt(li.dataset.optionIndex ?? '', 10);
    if (!Number.isNaN(idx)) setHighlightedIndex(idx);
  }, []);

  const nameInputValue =
    nameSearchTerm.length > 0
      ? nameSearchTerm
      : selected != null && selected !== ''
        ? (options.find((o) => o.value === selected)?.label ?? '')
        : selected === ''
          ? (options.find((o) => o.value === '')?.label ?? '')
          : '';

  const description = useCallback(
    (opt: HospitalOption) => (searchMode === 'address' ? opt.address : opt.businessNumber),
    [searchMode],
  );

  const handleNameInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setNameSearchTerm(e.target.value);
      onChange(null);
    },
    [onChange],
  );

  return (
    <div
      ref={dropdownRef}
      className={hs.inputWithOptionsWrap}
      id={id}
      onKeyDown={isOpen ? handleKeyDown : undefined}
    >
      <div className={hs.inputRow}>
        <input
          ref={nameInputRef}
          type="text"
          className={hs.searchInputField}
          placeholder={placeholder}
          value={nameInputValue}
          onChange={handleNameInputChange}
          onFocus={() => openOnFocus && setIsFocused(true)}
          aria-label={ariaLabel}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          role="combobox"
        />
      </div>

      {isOpen && (
        <div className={hs.dropdownContainer}>
          <div className={hs.dropdownSearchRow} onClick={(e) => e.stopPropagation()}>
            <input
              ref={dropdownInputRef}
              type="text"
              className={hs.dropdownSearchInput}
              placeholder={searchMode === 'address' ? '주소로 검색' : '사업자번호로 검색'}
              value={secondarySearchTerm}
              onChange={(e) => setSecondarySearchTerm(e.target.value)}
              aria-label={searchMode === 'address' ? '주소 검색' : '사업자번호 검색'}
            />
            <div style={{ minWidth: 88, flexShrink: 0 }}>
              <SingleSelect
                options={[
                  { label: '주소', value: 'address' },
                  { label: '사업자번호', value: 'businessNumber' },
                ]}
                selected={searchMode}
                onChange={(v) => setSearchMode(v as SearchMode)}
                placeholder="검색 기준"
                size="small"
                aria-label="검색 기준"
              />
            </div>
          </div>
          <ul
            ref={listRef}
            className={hs.optionList}
            role="listbox"
            onClick={handleListClick}
            onMouseOver={handleListMouseOver}
          >
            {filteredOptions.map((opt, i) => {
              const isSelected = opt.value === selected;
              const desc = description(opt);
              return (
                <li
                  key={opt.id ?? opt.value}
                  role="option"
                  aria-selected={isSelected}
                  data-option-index={i}
                  className={getItemClass(isSelected, i === highlightedIndex)}
                >
                  <div className={s.optionContent}>
                    <span className={s.optionLabel}>{opt.label}</span>
                    {desc && <span className={s.optionDescription}>{desc}</span>}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
