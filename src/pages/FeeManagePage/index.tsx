/** @jsxImportSource @emotion/react */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import { Download, Upload } from 'lucide-react';
import { mockProductFees, mockFeeEvents, mockCorporations, mockHospitals } from '@/store/mockData';
import type { ProductFee, FeeEvent, FeeEventType } from '@/types';
import { theme } from '@/theme';
import { SingleSelect } from '@/components/Common/Select';
import { Button } from '@/components/Common/Button';
import { Checkbox } from '@/components/Common/Checkbox';
import { FilterInput } from '@/components/Common/Input';
import { ProductFeeTable } from './FeeTable';
import { Row } from '@/components/Common/Flex';

type EventFormState = {
  productCode: string;
  type: FeeEventType;
  name: string;
  startDate: string;
  endDate: string;
  isFixedFee: boolean;
  fixedFeeRate: number;
  additionalFeeRate: number;
  note: string;
  corporationId: string;
  hospitalId: string;
  priority: number;
  error: string | null;
};

const INITIAL_EVENT_FORM: EventFormState = {
  productCode: '',
  type: 'item',
  name: '',
  startDate: '',
  endDate: '',
  isFixedFee: true,
  fixedFeeRate: 1,
  additionalFeeRate: 1,
  note: '',
  corporationId: '',
  hospitalId: '',
  priority: 1,
  error: null,
};

type AddProductFormState = {
  search: string;
  selectedProduct: ProductFee | null;
  feeRate: number;
  error: string | null;
  excelFileName: string | null;
};

const INITIAL_ADD_PRODUCT_FORM: AddProductFormState = {
  search: '',
  selectedProduct: null,
  feeRate: 0,
  error: null,
  excelFileName: null,
};

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2) },
  '& p': { marginBottom: theme.spacing(4) },
});

const layoutWrap = css({
  display: 'flex',
  gap: theme.spacing(4),
  alignItems: 'flex-start',
  flexWrap: 'wrap',
});

const leftCard = css({
  flex: 1,
  minWidth: 320,
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  overflow: 'hidden',
  boxShadow: theme.shadow.sm,
});

const filterRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  padding: theme.spacing(2),
  flexWrap: 'wrap',
  backgroundColor: theme.colors.background,
  borderBottom: `1px solid ${theme.colors.border}`,
});

const tableWrap = css({
  flex: 1,
  minHeight: 0,
  padding: theme.spacing(2),
  overflow: 'auto',
});

const rightPanel = css({
  width: 360,
  flexShrink: 0,
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  padding: theme.spacing(4),
  boxShadow: theme.shadow.sm,
  position: 'sticky',
  top: theme.spacing(4),
});

const feeInputStyles = css({
  width: 72,
  minHeight: 28,
  padding: `0 ${theme.spacing(1.5)}px`,
  fontSize: 13,
  fontWeight: 500,
  borderRadius: theme.radius.md,
  border: `2px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  textAlign: 'right',
  '&:focus': {
    outline: 'none',
    borderColor: theme.colors.primary,
    boxShadow: `0 0 0 3px ${theme.colors.primary}20`,
  },
  '&::placeholder': { color: theme.colors.textMuted },
});

const formField = css({
  '& label': { display: 'block', marginBottom: theme.spacing(1), fontWeight: 600, fontSize: 13 },
  '& input, & select, & textarea': {
    width: '100%',
    minHeight: 40,
    padding: `0 ${theme.spacing(2)}px`,
    fontSize: 14,
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.border}`,
    boxSizing: 'border-box',
    '&:focus': { outline: 'none', borderColor: theme.colors.primary },
  },
  '& textarea': { minHeight: 72, padding: theme.spacing(2), resize: 'vertical' },
  marginBottom: theme.spacing(3),
});

const excelUploadZone = css({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1.5),
  minHeight: 88,
  padding: theme.spacing(2),
  border: `2px dashed ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.background,
  cursor: 'pointer',
  transition: 'border-color 0.2s, background-color 0.2s',
  '&:hover': {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}08`,
  },
  '& input[type="file"]': {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
  },
  '& .upload-icon': { color: theme.colors.textMuted },
  '& .upload-text': { fontSize: 13, color: theme.colors.textMuted },
  '& .upload-hint': { fontSize: 11, color: theme.colors.textMuted, opacity: 0.8 },
  '&[data-has-file="true"]': {
    borderColor: theme.colors.primary,
    backgroundColor: `${theme.colors.primary}0c`,
    '& .upload-icon': { color: theme.colors.primary },
    '& .upload-text': { color: theme.colors.text },
  },
});


function getMonthOptions(count: number): { value: string; label: string }[] {
  const list: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    list.push({ value, label: `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월` });
  }
  return list;
}

const MONTH_OPTIONS = getMonthOptions(24);

function generateEventId(): string {
  return `ev-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function FeeManagePage() {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`;
  });
  const initialMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const [monthlyFees, setMonthlyFees] = useState<Record<string, ProductFee[]>>(() => ({
    [initialMonth]: [...mockProductFees],
  }));
  const [initialMonthlyFees, setInitialMonthlyFees] = useState<Record<string, ProductFee[]>>({});
  const [feeEvents, setFeeEvents] = useState<FeeEvent[]>(() => [...mockFeeEvents]);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(() => new Set());
  const [tableProductSearch, setTableProductSearch] = useState('');
  const [tableCorporationId, setTableCorporationId] = useState('');
  const [tableHospitalId, setTableHospitalId] = useState('');
  const [tableCriteria, setTableCriteria] = useState<'product' | 'corporation' | 'hospital'>('product');

  const toggleProductEvents = useCallback((productCode: string) => {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productCode)) next.delete(productCode);
      else next.add(productCode);
      return next;
    });
  }, []);

  useEffect(() => {
    setInitialMonthlyFees((prev) => ({
      ...prev,
      [selectedMonth]: (monthlyFees[selectedMonth] ?? [...mockProductFees]).map((p) => ({ ...p })),
    }));
  }, [selectedMonth, monthlyFees]);

  const currentFees = useMemo(() => {
    if (monthlyFees[selectedMonth]) return monthlyFees[selectedMonth];
    return [...mockProductFees];
  }, [selectedMonth, monthlyFees]);

  const filteredFees = useMemo(() => {
    const q = tableProductSearch.trim().toLowerCase();
    if (!q) return currentFees;
    return currentFees.filter(
      (p) =>
        p.productName.toLowerCase().includes(q) ||
        p.productCode.toLowerCase().includes(q)
    );
  }, [currentFees, tableProductSearch]);

  const updateFeeRate = useCallback(
    (productCode: string, feeRate: number) => {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      setMonthlyFees((prev) => {
        const list = prev[selectedMonth] ?? [...mockProductFees];
        const next = list.map((p) =>
          p.productCode === productCode ? { ...p, feeRate, updatedAt: now, updatedBy: 'admin' } : p
        );
        return { ...prev, [selectedMonth]: next };
      });
    },
    [selectedMonth]
  );

  const updateProductCode = useCallback(
    (index: number, newCode: string) => {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      setMonthlyFees((prev) => {
        const list = prev[selectedMonth] ?? [...mockProductFees];
        if (index < 0 || index >= list.length) return prev;
        const next = list.map((p, i) =>
          i === index ? { ...p, productCode: newCode, updatedAt: now, updatedBy: 'admin' } : p
        );
        return { ...prev, [selectedMonth]: next };
      });
    },
    [selectedMonth]
  );

  const [addProductForm, setAddProductForm] = useState<AddProductFormState>(INITIAL_ADD_PRODUCT_FORM);
  const [eventForm, setEventForm] = useState<EventFormState>(INITIAL_EVENT_FORM);
  const [rightPanelMode, setRightPanelMode] = useState<'event' | 'product'>('product');

  const updateEventForm = useCallback((patch: Partial<EventFormState>) => {
    setEventForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetEventForm = useCallback(() => {
    setEventForm(INITIAL_EVENT_FORM);
  }, []);

  const initialFees = initialMonthlyFees[selectedMonth];
  const isRowModified = useCallback(
    (index: number) => {
      if (!initialFees || index >= currentFees.length) return false;
      const current = currentFees[index];
      const initial = initialFees[index];
      if (!initial) return true;
      return (
        current.productCode !== initial.productCode ||
        current.feeRate !== initial.feeRate ||
        (current.ediCode ?? '') !== (initial.ediCode ?? '')
      );
    },
    [currentFees, initialFees]
  );

  const modifiedCount = useMemo(
    () => currentFees.filter((_, index) => isRowModified(index)).length,
    [currentFees, isRowModified]
  );

  const handleSave = useCallback(() => {
    setInitialMonthlyFees((prev) => ({
      ...prev,
      [selectedMonth]: currentFees.map((p) => ({ ...p })),
    }));
  }, [selectedMonth, currentFees]);

  const addableProducts = useMemo(() => {
    const currentCodes = new Set((monthlyFees[selectedMonth] ?? [...mockProductFees]).map((p) => p.productCode));
    const q = addProductForm.search.trim().toLowerCase();
    return mockProductFees.filter(
      (p) =>
        !currentCodes.has(p.productCode) &&
        (!q || p.productName.toLowerCase().includes(q) || p.productCode.toLowerCase().includes(q))
    );
  }, [selectedMonth, monthlyFees, addProductForm.search]);

  useEffect(() => {
    const { selectedProduct } = addProductForm;
    if (selectedProduct && !addableProducts.some((p) => p.productCode === selectedProduct.productCode)) {
      setAddProductForm((prev) => ({ ...prev, selectedProduct: null }));
    }
  }, [addableProducts, addProductForm.selectedProduct]);

  const addProduct = useCallback(() => {
    const { selectedProduct, feeRate } = addProductForm;
    if (!selectedProduct) {
      setAddProductForm((prev) => ({ ...prev, error: '품목을 검색 후 목록에서 선택하세요.' }));
      return;
    }
    const list = monthlyFees[selectedMonth] ?? [...mockProductFees];
    if (list.some((p) => p.productCode === selectedProduct.productCode)) {
      setAddProductForm((prev) => ({ ...prev, error: '이미 존재하는 품목입니다.' }));
      return;
    }
    setAddProductForm(INITIAL_ADD_PRODUCT_FORM);
    setMonthlyFees((prev) => {
      const base = prev[selectedMonth] ?? [...mockProductFees];
      return {
        ...prev,
        [selectedMonth]: [
          ...base,
          {
            productCode: selectedProduct.productCode,
            productName: selectedProduct.productName,
            feeRate,
            ediCode: selectedProduct.ediCode,
            createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
            updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
            createdBy: 'admin',
            updatedBy: 'admin',
          },
        ],
      };
    });
    setRightPanelMode('event');
  }, [selectedMonth, monthlyFees, addProductForm]);

  const eventsByProduct = useMemo(() => {
    const map = new Map<string, FeeEvent[]>();
    for (const p of currentFees) {
      const list = feeEvents
        .filter((e) => e.productCode === p.productCode)
        .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
      if (list.length > 0) map.set(p.productCode, list);
    }
    return map;
  }, [currentFees, feeEvents]);

  const corpOptions = useMemo(
    () => mockCorporations.map((c) => ({ label: c.name, value: c.id })),
    []
  );

  const hospitalOptions = useMemo(() => {
    if (!eventForm.corporationId) return [];
    return mockHospitals
      .filter((h) => h.corporationId === eventForm.corporationId)
      .map((h) => ({
        label: `${h.name}${h.accountCode ? ` (${h.accountCode})` : ''}`,
        value: h.id,
      }));
  }, [eventForm.corporationId]);

  const handleAddEvent = useCallback(() => {
    const {
      productCode,
      type,
      name,
      startDate,
      endDate,
      isFixedFee,
      fixedFeeRate,
      additionalFeeRate,
      note,
      corporationId,
      hospitalId,
      priority,
    } = eventForm;

    const n = name.trim();
    if (!productCode) {
      setEventForm((prev) => ({ ...prev, error: '좌측 표에서 품목을 선택하세요.' }));
      return;
    }
    if (!n) {
      setEventForm((prev) => ({ ...prev, error: '이벤트 이름을 입력하세요.' }));
      return;
    }
    if (!startDate || !endDate) {
      setEventForm((prev) => ({ ...prev, error: '시작일·종료일을 입력하세요.' }));
      return;
    }
    if (new Date(startDate) > new Date(endDate)) {
      setEventForm((prev) => ({ ...prev, error: '종료일은 시작일 이후여야 합니다.' }));
      return;
    }
    if (type !== 'item' && !corporationId) {
      setEventForm((prev) => ({ ...prev, error: '법인을 선택하세요.' }));
      return;
    }
    if (type === 'corporation_hospital' && !hospitalId) {
      setEventForm((prev) => ({ ...prev, error: '병의원을 선택하세요.' }));
      return;
    }
    const rate = isFixedFee ? fixedFeeRate : additionalFeeRate;
    if (isFixedFee && (rate < 1 || rate > 100)) {
      setEventForm((prev) => ({ ...prev, error: '고정수수료율은 1~100 사이로 입력하세요.' }));
      return;
    }
    if (!isFixedFee && (rate < -100 || rate > 100)) {
      setEventForm((prev) => ({ ...prev, error: '추가수수료율은 -100~100 사이로 입력하세요.' }));
      return;
    }

    const newEvent: FeeEvent = {
      id: generateEventId(),
      productCode,
      type,
      name: n,
      startDate,
      endDate,
      isFixedFee,
      ...(isFixedFee ? { fixedFeeRate: rate } : { additionalFeeRate: rate }),
      note: note.trim() || undefined,
      ...(type !== 'item' && { corporationId }),
      ...(type === 'corporation_hospital' && { hospitalId }),
      priority,
    };
    setFeeEvents((prev) => [...prev, newEvent]);
    setExpandedProducts((prev) => new Set(prev).add(productCode));
    setEventForm(INITIAL_EVENT_FORM);
  }, [eventForm]);

  const handleDeleteEvent = useCallback((eventId: string) => {
    setFeeEvents((prev) => prev.filter((e) => e.id !== eventId));
  }, []);


  const handleRowClickForEvent = useCallback(
    (productCode: string, e: React.MouseEvent) => {
      if (rightPanelMode !== 'event') return;
      if ((e.target as HTMLElement).closest('input, button')) return;
      updateEventForm({ productCode });
    },
    [rightPanelMode, updateEventForm]
  );

  const handleSwitchToEventMode = useCallback(
    (productCode: string) => {
      setRightPanelMode('event');
      updateEventForm({ productCode });
    },
    [updateEventForm]
  );

  return (
    <div css={pageStyles}>
      <h1>수수료관리</h1>
      <p>월별·품목별 수수료율(%)을 설정하고, 품목별 이벤트를 등록합니다.</p>

      <div css={layoutWrap}>
        <div css={leftCard}>
          <div css={filterRow}>
            <Row alignItems="center" gap={theme.spacing(1)}>
              <span css={css({ fontSize: 12, fontWeight: 600, color: theme.colors.textMuted, whiteSpace: 'nowrap' })}>적용 월</span>
              <SingleSelect
                id="fee-month"
                options={MONTH_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
                selected={selectedMonth}
                onChange={(v) => setSelectedMonth(String(v))}
                placeholder="월 선택"
                aria-label="적용 월"
              />
            </Row>
            <Row alignItems="center" gap={theme.spacing(1)}>
              <span css={css({ fontSize: 12, fontWeight: 600, color: theme.colors.textMuted, whiteSpace: 'nowrap' })}>품목 검색</span>
              <FilterInput
                id="table-product-search"
                type="search"
                placeholder="품목명·품목코드"
                value={tableProductSearch}
                onChange={(e) => setTableProductSearch(e.target.value)}
                aria-label="품목명 검색"
                css={css({ minHeight: 36, width: 160, fontSize: 13, padding: `0 ${theme.spacing(2)}px` })}
              />
            </Row>
            <div css={css({ display: 'flex', alignItems: 'center', gap: theme.spacing(1) })}>
              <span css={css({ fontSize: 12, fontWeight: 600, color: theme.colors.textMuted, whiteSpace: 'nowrap' })}>최종수수료 기준</span>
              <SingleSelect
                id="table-corporation"
                options={[
                  { label: '전체', value: '' },
                  ...mockCorporations.map((c) => ({ label: c.name, value: c.id })),
                ]}
                selected={tableCorporationId}
                onChange={(v) => {
                  setTableCorporationId(String(v));
                  setTableHospitalId('');
                }}
                placeholder="법인"
                enableSearch
                aria-label="법인"
              />
              <SingleSelect
                id="table-hospital"
                options={[
                  { label: '전체', value: '' },
                  ...mockHospitals
                    .filter((h) => !tableCorporationId || h.corporationId === tableCorporationId)
                    .map((h) => ({ label: h.name, value: h.id })),
                ]}
                selected={tableHospitalId}
                onChange={(v) => setTableHospitalId(String(v))}
                placeholder="병원"
                enableSearch
                aria-label="병원"
              />
            </div>
            {modifiedCount > 0 && (
              <Button variant="primary" size="small" onClick={handleSave}>
                저장 ({modifiedCount}건)
              </Button>
            )}
            <div css={css({ display: 'flex', alignItems: 'center', gap: theme.spacing(1), marginLeft: 'auto' })}>
              <Button
                variant={tableCriteria === 'product' ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setTableCriteria('product')}
              >
                품목별
              </Button>
              <Button
                variant={tableCriteria === 'corporation' ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setTableCriteria('corporation')}
              >
                법인별
              </Button>
              <Button
                variant={tableCriteria === 'hospital' ? 'primary' : 'secondary'}
                size="small"
                onClick={() => setTableCriteria('hospital')}
              >
                병원별
              </Button>
            </div>
          </div>

          <div css={tableWrap}>
          <ProductFeeTable
            filteredFees={filteredFees}
            currentFees={currentFees}
            eventsByProduct={eventsByProduct}
            expandedProducts={expandedProducts}
            rightPanelMode={rightPanelMode}
            eventProductCode={eventForm.productCode}
            isRowModified={isRowModified}
            feeScope={tableCorporationId ? { corporationId: tableCorporationId, hospitalId: tableHospitalId || undefined } : { type: 'item' }}
            tableCriteria={tableCriteria}
            onToggleExpand={toggleProductEvents}
            onUpdateFeeRate={updateFeeRate}
            onUpdateProductCode={updateProductCode}
            onRowClickForEvent={handleRowClickForEvent}
            onDeleteEvent={handleDeleteEvent}
            onSwitchToEventMode={handleSwitchToEventMode}
          />
          </div>
        </div>

        <aside css={rightPanel}>
          <div css={css({ display: 'flex', gap: theme.spacing(1), marginBottom: theme.spacing(3) })}>
            <Button
              variant={rightPanelMode === 'product' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setRightPanelMode('product')}
            >
              수수료 추가
            </Button>
            <Button
              variant={rightPanelMode === 'event' ? 'primary' : 'secondary'}
              size="small"
              onClick={() => setRightPanelMode('event')}
            >
              이벤트 추가
            </Button>
          </div>

          {rightPanelMode === 'product' ? (
            <>
              <h3 css={css({ fontSize: 16, marginBottom: theme.spacing(3) })}>수수료 추가</h3>

              <div css={formField}>
                <label htmlFor="product-search">품목명 검색</label>
                <input
                  id="product-search"
                  type="search"
                  placeholder="품목명·품목코드로 검색"
                  value={addProductForm.search}
                  onChange={(e) => setAddProductForm((prev) => ({ ...prev, search: e.target.value }))}
                  aria-label="품목명 검색"
                />
              </div>
              <div css={formField}>
                <label htmlFor="product-select">품목 선택 *</label>
                <SingleSelect
                  id="product-select"
                  options={[
                    { label: '선택하세요 (품목코드 · 품목명)', value: '' },
                    ...addableProducts.map((p) => ({
                      label: `${p.productCode} · ${p.productName}`,
                      value: p.productCode,
                    })),
                  ]}
                  selected={addProductForm.selectedProduct ? addProductForm.selectedProduct.productCode : ''}
                  onChange={(v) => {
                    const p = addableProducts.find((x) => x.productCode === v) ?? null;
                    setAddProductForm((prev) => ({ ...prev, selectedProduct: p }));
                  }}
                  placeholder="선택하세요 (품목코드 · 품목명)"
                  aria-label="추가할 품목 선택"
                />
              </div>
              <div css={formField}>
                <label htmlFor="new-fee-rate">기본 수수료 (%)</label>
                <div css={css({ display: 'flex', alignItems: 'center', gap: 4 })}>
                  <input
                    css={feeInputStyles}
                    id="new-fee-rate"
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={addProductForm.feeRate === 0 ? '' : addProductForm.feeRate}
                    onChange={(e) => setAddProductForm((prev) => ({ ...prev, feeRate: Number(e.target.value) || 0 }))}
                    placeholder="0"
                    aria-label="수수료율 입력"
                  />
                  <span css={css({ fontSize: 14, color: theme.colors.textMuted })}>%</span>
                </div>
              </div>
              <Button variant="primary" onClick={addProduct} css={css({ width: '100%' })}>
                수수료 추가
              </Button>
              <div css={formField}>
                <label>수수료 엑셀 업로드</label>
                <label
                  css={excelUploadZone}
                  data-has-file={!!addProductForm.excelFileName}
                  htmlFor="fee-excel-upload"
                >
                  <input
                    id="fee-excel-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setAddProductForm((prev) => ({ ...prev, excelFileName: file?.name ?? null }));
                    }}
                    aria-label="수수료 엑셀 파일 선택"
                  />
                  <Upload size={24} className="upload-icon" aria-hidden />
                  <span className="upload-text">
                    {addProductForm.excelFileName ?? '클릭하여 엑셀 파일 선택'}
                  </span>
                  <span className="upload-hint">.xlsx, .xls 지원</span>
                </label>
              </div>
              <Button
                variant="secondary"
                size="small"
                onClick={() => {}}
                css={css({ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: theme.spacing(1) })}
              >
                <Download size={16} />
                엑셀 양식 다운로드
              </Button>
              {addProductForm.error && (
                <p css={css({ marginTop: theme.spacing(2), fontSize: 13, color: theme.colors.error })}>
                  {addProductForm.error}
                </p>
              )}
            </>
          ) : (
            <>
          <h3 css={css({ fontSize: 16, marginBottom: theme.spacing(3) })}>이벤트 추가</h3>
          <div css={formField}>
            <label>품목</label>
            <div css={css({ padding: theme.spacing(1.5), backgroundColor: theme.colors.background, borderRadius: theme.radius.md, fontSize: 14 })}>
              {eventForm.productCode ? (
                <span>
                  {currentFees.find((x) => x.productCode === eventForm.productCode)?.productName ?? eventForm.productCode}{' '}
                  <span css={css({ color: theme.colors.textMuted, fontSize: 13 })}>({eventForm.productCode})</span>
                </span>
              ) : (
                <span css={css({ color: theme.colors.textMuted })}>좌측 표에서 품목을 선택하세요</span>
              )}
            </div>
          </div>
          <div css={formField}>
            <label htmlFor="event-type">이벤트 종류</label>
            <SingleSelect
              id="event-type"
              options={[
                { label: '품목 이벤트', value: 'item' },
                { label: '법인별 이벤트', value: 'corporation' },
                { label: '법인·병원 이벤트', value: 'corporation_hospital' },
              ]}
              selected={eventForm.type}
              onChange={(v) => updateEventForm({ type: v as FeeEventType, corporationId: '', hospitalId: '' })}
            />
          </div>
          {eventForm.type !== 'item' && (
            <>
              <div css={formField}>
                <label htmlFor="event-corp">법인 *</label>
                <SingleSelect
                  id="event-corp"
                  options={[{ label: '선택', value: '' }, ...corpOptions]}
                  selected={eventForm.corporationId}
                  onChange={(v) => updateEventForm({ corporationId: String(v), hospitalId: '' })}
                />
              </div>
              {eventForm.type === 'corporation_hospital' && (
                <div css={formField}>
                  <label htmlFor="event-hospital">병의원 *</label>
                  <SingleSelect
                    id="event-hospital"
                    options={[{ label: '선택', value: '' }, ...hospitalOptions]}
                    selected={eventForm.hospitalId}
                    onChange={(v) => updateEventForm({ hospitalId: String(v) })}
                  />
                </div>
              )}
            </>
          )}
          <div css={formField}>
            <label htmlFor="event-name">이벤트 이름 *</label>
            <input
              id="event-name"
              type="text"
              value={eventForm.name}
              onChange={(e) => updateEventForm({ name: e.target.value })}
              placeholder="이벤트 이름"
            />
          </div>
          <div css={formField}>
            <label htmlFor="event-priority">우선순위 (숫자 높을수록 최우선 적용)</label>
            <input
              id="event-priority"
              type="number"
              min={1}
              value={eventForm.priority}
              onChange={(e) => updateEventForm({ priority: Math.max(1, Number(e.target.value) || 1) })}
            />
          </div>
          <div css={css({ display: 'flex', gap: theme.spacing(2), marginBottom: theme.spacing(3) })}>
            <div css={[formField, css({ flex: 1 })]}>
              <label htmlFor="event-start">시작일 *</label>
              <input
                id="event-start"
                type="date"
                value={eventForm.startDate}
                onChange={(e) => updateEventForm({ startDate: e.target.value })}
              />
            </div>
            <div css={[formField, css({ flex: 1 })]}>
              <label htmlFor="event-end">종료일 *</label>
              <input
                id="event-end"
                type="date"
                value={eventForm.endDate}
                onChange={(e) => updateEventForm({ endDate: e.target.value })}
              />
            </div>
          </div>
          <div css={formField}>
            <Checkbox
              id="event-fixed-fee"
              checked={eventForm.isFixedFee}
              onChange={(v) => updateEventForm({ isFixedFee: v })}
              layout="vertical"
              label={eventForm.isFixedFee ? '고정수수료' : '추가수수료'}
              description={
                eventForm.isFixedFee
                  ? '다른 수수료에 영향받지 않고 해당 고정율만 사용'
                  : '기본수수료에 추가하여 적용'
              }
              aria-label="고정수수료 여부"
            />
          </div>
          {eventForm.isFixedFee ? (
            <div css={formField}>
              <label htmlFor="event-fixed-rate">고정수수료율 (1~100)% *</label>
              <input
                id="event-fixed-rate"
                type="number"
                min={1}
                max={100}
                value={eventForm.fixedFeeRate}
                onChange={(e) => updateEventForm({ fixedFeeRate: Number(e.target.value) || 1 })}
              />
            </div>
          ) : (
            <div css={formField}>
              <label htmlFor="event-add-rate">추가수수료율 (-100~100)% *</label>
              <input
                id="event-add-rate"
                type="number"
                min={-100}
                max={100}
                step={0.1}
                value={eventForm.additionalFeeRate}
                onChange={(e) => updateEventForm({ additionalFeeRate: Number(e.target.value) || 0 })}
              />
            </div>
          )}
          <div css={formField}>
            <label htmlFor="event-note">비고 (설명)</label>
            <textarea
              id="event-note"
              value={eventForm.note}
              onChange={(e) => updateEventForm({ note: e.target.value })}
              placeholder="설명"
            />
          </div>
          <div css={css({ display: 'flex', gap: theme.spacing(2), marginTop: theme.spacing(1) })}>
            <Button variant="primary" onClick={handleAddEvent} css={css({ flex: 1 })}>
              이벤트 추가
            </Button>
            <Button variant="secondary" onClick={resetEventForm}>
              초기화
            </Button>
          </div>
          {eventForm.error && (
            <p css={css({ marginTop: theme.spacing(2), fontSize: 13, color: theme.colors.error })}>
              {eventForm.error}
            </p>
          )}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
