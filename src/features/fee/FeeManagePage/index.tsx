'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import type { Corporation, CorpHospitalFee, ProductFee, FeeEvent } from '@/types';
import { SingleSelect } from '@/shared/components/ui/Select';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { ProductFeeTable, CorporationFeeTable } from './widgets/FeeTable';
import {
  ProductFeeAddForm,
  CorporationFeeAddForm,
  type EventFormState,
  type AddProductFormState,
} from './widgets/FeeAddForm';
import CardWrapper from '@/shared/components/layout/CardWrapper/CardWrapper';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import * as s from './index.css';

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

const INITIAL_ADD_PRODUCT_FORM: AddProductFormState = {
  search: '',
  selectedProduct: null,
  feeRate: 0,
  error: null,
  excelFileName: null,
};

export type FeeTableType = 'product' | 'corporation';

function getMonthOptions(count: number): { value: string; label: string }[] {
  const list: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    list.push({
      value,
      label: `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월`,
    });
  }
  return list;
}

const MONTH_OPTIONS = getMonthOptions(24);

function generateEventId(): string {
  return `ev-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function feeEventToForm(ev: FeeEvent): EventFormState {
  return {
    productCode: ev.productCode,
    type: ev.type,
    name: ev.name,
    startDate: ev.startDate,
    endDate: ev.endDate,
    isFixedFee: ev.isFixedFee,
    fixedFeeRate: ev.fixedFeeRate ?? 1,
    additionalFeeRate: ev.additionalFeeRate ?? 0,
    note: ev.note ?? '',
    corporationId: ev.corporationId ?? '',
    hospitalId: ev.hospitalId ?? '',
    priority: ev.priority ?? 1,
    error: null,
  };
}

export function FeeManagePage() {
  const productFees = useDemoPlayStore((s) => s.productFees);
  const feeMonthlyFees = useDemoPlayStore((s) => s.feeMonthlyFees);
  const setFeeMonthlyFees = useDemoPlayStore((s) => s.setFeeMonthlyFees);
  const feeInitialMonthlyFees = useDemoPlayStore((s) => s.feeInitialMonthlyFees);
  const setFeeInitialMonthlyFees = useDemoPlayStore((s) => s.setFeeInitialMonthlyFees);
  const feeEvents = useDemoPlayStore((s) => s.feeEvents);
  const setFeeEvents = useDemoPlayStore((s) => s.setFeeEvents);
  const corporations = useDemoPlayStore((s) => s.corporations);
  const setCorporations = useDemoPlayStore((s) => s.setCorporations);
  const corpHospitalFees = useDemoPlayStore((s) => s.corpHospitalFees);
  const setCorpHospitalFees = useDemoPlayStore((s) => s.setCorpHospitalFees);
  const hospitals = useDemoPlayStore((s) => s.hospitals);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`;
  });
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(() => new Set());
  const [tableProductSearch, setTableProductSearch] = useState('');
  const [tableCorporationId, setTableCorporationId] = useState('');
  const [tableHospitalId, setTableHospitalId] = useState('');
  const [tableType, setTableType] = useState<FeeTableType>('product');
  const [selectedCorporationId, setSelectedCorporationId] = useState<string | null>(null);

  const toggleProductEvents = useCallback((productCode: string) => {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productCode)) next.delete(productCode);
      else next.add(productCode);
      return next;
    });
  }, []);

  useEffect(() => {
    setFeeInitialMonthlyFees((prev) => ({
      ...prev,
      [selectedMonth]: (feeMonthlyFees[selectedMonth] ?? [...productFees]).map((p) => ({ ...p })),
    }));
  }, [selectedMonth, feeMonthlyFees, productFees, setFeeInitialMonthlyFees]);

  const currentFees = useMemo(() => {
    if (feeMonthlyFees[selectedMonth]) return feeMonthlyFees[selectedMonth];
    return [...productFees];
  }, [selectedMonth, feeMonthlyFees, productFees]);

  const filteredFees = useMemo(() => {
    const q = tableProductSearch.trim().toLowerCase();
    if (!q) return currentFees;
    return currentFees.filter(
      (p) => p.productName.toLowerCase().includes(q) || p.productCode.toLowerCase().includes(q),
    );
  }, [currentFees, tableProductSearch]);

  const updateFeeRate = useCallback(
    (productCode: string, feeRate: number) => {
      const now = new Date().toISOString().slice(0, 19).replace('T', ' ');
      setFeeMonthlyFees((prev) => {
        const list = prev[selectedMonth] ?? [...productFees];
        const next = list.map((p) =>
          p.productCode === productCode ? { ...p, feeRate, updatedAt: now, updatedBy: 'admin' } : p,
        );
        return { ...prev, [selectedMonth]: next };
      });
    },
    [selectedMonth, productFees, setFeeMonthlyFees],
  );

  const [addProductForm, setAddProductForm] =
    useState<AddProductFormState>(INITIAL_ADD_PRODUCT_FORM);
  const [eventForm, setEventForm] = useState<EventFormState>(INITIAL_EVENT_FORM);
  const [rightPanelMode, setRightPanelMode] = useState<'event' | 'product'>('product');
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const prevRightPanelModeRef = useRef(rightPanelMode);
  /** 행 클릭으로 이벤트 수정 진입 시 product→event effect가 폼을 비우지 않도록 함 */
  const skipEventFormResetOnModeChangeRef = useRef(false);

  const updateEventForm = useCallback((patch: Partial<EventFormState>) => {
    setEventForm((prev) => ({ ...prev, ...patch }));
  }, []);

  const resetEventForm = useCallback(() => {
    setEventForm(INITIAL_EVENT_FORM);
    setEditingEventId(null);
  }, []);

  useEffect(() => {
    if (rightPanelMode === 'product') {
      setEditingEventId(null);
    } else if (rightPanelMode === 'event' && prevRightPanelModeRef.current === 'product') {
      if (skipEventFormResetOnModeChangeRef.current) {
        skipEventFormResetOnModeChangeRef.current = false;
      } else {
        setEditingEventId(null);
        setEventForm(INITIAL_EVENT_FORM);
      }
    }
    prevRightPanelModeRef.current = rightPanelMode;
  }, [rightPanelMode]);

  const initialFees = feeInitialMonthlyFees[selectedMonth];
  const isRowModified = useCallback(
    (index: number) => {
      if (!initialFees || index >= currentFees.length) return false;
      const current = currentFees[index];
      const initial = initialFees[index];
      if (!initial) return true;
      return (
        current.feeRate !== initial.feeRate || (current.ediCode ?? '') !== (initial.ediCode ?? '')
      );
    },
    [currentFees, initialFees],
  );

  const modifiedCount = useMemo(
    () => currentFees.filter((_, index) => isRowModified(index)).length,
    [currentFees, isRowModified],
  );

  const handleSave = useCallback(() => {
    setFeeInitialMonthlyFees((prev) => ({
      ...prev,
      [selectedMonth]: currentFees.map((p) => ({ ...p })),
    }));
  }, [selectedMonth, currentFees, setFeeInitialMonthlyFees]);

  const addableProducts = useMemo(() => {
    const currentCodes = new Set(
      (feeMonthlyFees[selectedMonth] ?? [...productFees]).map((p) => p.productCode),
    );
    const q = addProductForm.search.trim().toLowerCase();
    return productFees.filter(
      (p) =>
        !currentCodes.has(p.productCode) &&
        (!q || p.productName.toLowerCase().includes(q) || p.productCode.toLowerCase().includes(q)),
    );
  }, [selectedMonth, feeMonthlyFees, productFees, addProductForm.search]);

  useEffect(() => {
    const { selectedProduct } = addProductForm;
    if (
      selectedProduct &&
      !addableProducts.some((p) => p.productCode === selectedProduct.productCode)
    ) {
      setAddProductForm((prev) => ({ ...prev, selectedProduct: null }));
    }
  }, [addableProducts, addProductForm.selectedProduct]);

  const addProduct = useCallback(() => {
    const { selectedProduct, feeRate } = addProductForm;
    if (!selectedProduct) {
      setAddProductForm((prev) => ({ ...prev, error: '품목을 검색 후 목록에서 선택하세요.' }));
      return;
    }
    const list = feeMonthlyFees[selectedMonth] ?? [...productFees];
    if (list.some((p) => p.productCode === selectedProduct.productCode)) {
      setAddProductForm((prev) => ({ ...prev, error: '이미 존재하는 품목입니다.' }));
      return;
    }
    setAddProductForm(INITIAL_ADD_PRODUCT_FORM);
    setFeeMonthlyFees((prev) => {
      const base = prev[selectedMonth] ?? [...productFees];
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
  }, [selectedMonth, feeMonthlyFees, productFees, addProductForm, setFeeMonthlyFees]);

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
    () => corporations.map((c) => ({ label: c.name, value: c.id })),
    [corporations],
  );

  const hospitalOptions = useMemo(() => {
    if (!eventForm.corporationId) return [];
    return hospitals
      .filter((h) => h.corporationId === eventForm.corporationId)
      .map((h) => ({
        label: `${h.name}${h.accountCode ? ` (${h.accountCode})` : ''}`,
        value: h.id,
      }));
  }, [eventForm.corporationId, hospitals]);

  const handleSaveEvent = useCallback(() => {
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

    const now = new Date().toISOString().slice(0, 19);

    if (editingEventId) {
      setFeeEvents((prev) =>
        prev.map((e) => {
          if (e.id !== editingEventId) return e;
          const next: FeeEvent = {
            ...e,
            productCode,
            type,
            name: n,
            startDate,
            endDate,
            isFixedFee,
            ...(isFixedFee
              ? { fixedFeeRate: rate, additionalFeeRate: undefined }
              : { additionalFeeRate: rate, fixedFeeRate: undefined }),
            note: note.trim() || undefined,
            priority,
            updatedBy: 'admin',
            updatedAt: now,
            corporationId: type !== 'item' ? corporationId : undefined,
            hospitalId: type === 'corporation_hospital' ? hospitalId : undefined,
          };
          return next;
        }),
      );
      setEditingEventId(null);
      setEventForm(INITIAL_EVENT_FORM);
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
      ...(isFixedFee
        ? { fixedFeeRate: rate, additionalFeeRate: undefined }
        : { additionalFeeRate: rate, fixedFeeRate: undefined }),
      note: note.trim() || undefined,
      ...(type !== 'item' && { corporationId }),
      ...(type === 'corporation_hospital' && { hospitalId }),
      priority,
    };
    setFeeEvents((prev) => [...prev, newEvent]);
    setExpandedProducts((prev) => new Set(prev).add(productCode));
    setEventForm(INITIAL_EVENT_FORM);
  }, [eventForm, editingEventId, setFeeEvents]);

  const handleEditEvent = useCallback((ev: FeeEvent) => {
    skipEventFormResetOnModeChangeRef.current = true;
    setRightPanelMode('event');
    setEditingEventId(ev.id);
    setEventForm(feeEventToForm(ev));
    setExpandedProducts((prev) => new Set(prev).add(ev.productCode));
  }, []);

  const handleDeleteEvent = useCallback(
    (eventId: string) => {
      setFeeEvents((prev) => prev.filter((e) => e.id !== eventId));
      setEditingEventId((id) => (id === eventId ? null : id));
    },
    [setFeeEvents],
  );

  const handleRowClickForEvent = useCallback(
    (productCode: string, e: React.MouseEvent) => {
      if (rightPanelMode !== 'event') return;
      if ((e.target as HTMLElement).closest('input, button')) return;
      setEditingEventId(null);
      updateEventForm({ productCode });
    },
    [rightPanelMode, updateEventForm],
  );

  const handleSwitchToEventMode = useCallback(
    (productCode: string) => {
      setRightPanelMode('event');
      setEditingEventId(null);
      updateEventForm({ productCode });
    },
    [updateEventForm],
  );

  return (
    <div className={s.page}>
      <PageHeader
        title="수수료관리"
        description="월별·품목별 수수료율(%)을 설정하고, 품목별 이벤트를 등록합니다."
      />

      <div className={s.tableTypeButtons}>
        <Button
          variant={tableType === 'product' ? 'primary' : 'secondary'}
          size="small"
          onClick={() => setTableType('product')}
        >
          품목별
        </Button>
        <Button
          variant={tableType === 'corporation' ? 'primary' : 'secondary'}
          size="small"
          onClick={() => setTableType('corporation')}
        >
          법인별
        </Button>
      </div>

      <div className={s.layoutWrap}>
        <CardWrapper
          className={
            tableType === 'corporation' ? `${s.leftCardLayout} ${s.leftCardWide}` : s.leftCardLayout
          }
          padding={0}
        >
          <div className={s.feeFilterSection}>
            <div className={s.filterRow}>
              <div className={s.filterField}>
                <label htmlFor="fee-month">적용 월</label>
                <SingleSelect
                  id="fee-month"
                  options={MONTH_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
                  selected={selectedMonth}
                  onChange={(v) => setSelectedMonth(String(v))}
                  placeholder="월 선택"
                  aria-label="적용 월"
                />
              </div>
              {tableType === 'product' && (
                <>
                  <div className={s.filterField}>
                    <label htmlFor="table-product-search">품목 검색</label>
                    <Input
                      size="default"
                      id="table-product-search"
                      type="search"
                      placeholder="품목명·품목코드"
                      value={tableProductSearch}
                      onChange={(e) => setTableProductSearch(e.target.value)}
                      aria-label="품목명 검색"
                      className={s.productSearchInput}
                    />
                  </div>
                  <div className={s.filterField}>
                    <label htmlFor="table-corporation">최종수수료 기준 - 법인</label>
                    <SingleSelect
                      id="table-corporation"
                      options={[
                        { label: '전체', value: '' },
                        ...corporations.map((c) => ({ label: c.name, value: c.id })),
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
                  </div>
                  <div className={s.filterField}>
                    <label htmlFor="table-hospital">병원</label>
                    <SingleSelect
                      id="table-hospital"
                      options={[
                        { label: '전체', value: '' },
                        ...hospitals
                          .filter(
                            (h) => !tableCorporationId || h.corporationId === tableCorporationId,
                          )
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
                </>
              )}
            </div>
          </div>

          <div className={s.tableWrap}>
            {tableType === 'product' && (
              <ProductFeeTable
                filteredFees={filteredFees}
                currentFees={currentFees}
                eventsByProduct={eventsByProduct}
                expandedProducts={expandedProducts}
                rightPanelMode={rightPanelMode}
                eventProductCode={eventForm.productCode}
                isRowModified={isRowModified}
                feeScope={
                  tableCorporationId
                    ? {
                        corporationId: tableCorporationId,
                        hospitalId: tableHospitalId || undefined,
                      }
                    : { type: 'item' }
                }
                corporations={corporations}
                hospitals={hospitals}
                onToggleExpand={toggleProductEvents}
                onUpdateFeeRate={updateFeeRate}
                onRowClickForEvent={handleRowClickForEvent}
                onDeleteEvent={handleDeleteEvent}
                onSwitchToEventMode={handleSwitchToEventMode}
                onEditEvent={handleEditEvent}
                editingEventId={editingEventId}
              />
            )}
            {tableType === 'corporation' && (
              <CorporationFeeTable
                corporations={corporations}
                hospitals={hospitals}
                corpHospitalFees={corpHospitalFees}
                selectedCorporationId={selectedCorporationId}
                onCorporationSelect={setSelectedCorporationId}
                onUpdateHospitalFee={(corpId, hospitalId, patch) => {
                  setCorpHospitalFees((prev) => {
                    const existing = prev.find(
                      (f) => f.corporationId === corpId && f.hospitalId === hospitalId,
                    );
                    const updated: CorpHospitalFee = {
                      corporationId: corpId,
                      hospitalId,
                      isFixedFee: patch.isFixedFee ?? existing?.isFixedFee ?? false,
                      feeRate: patch.feeRate ?? existing?.feeRate ?? 0,
                    };
                    const filtered = prev.filter(
                      (f) => !(f.corporationId === corpId && f.hospitalId === hospitalId),
                    );
                    return [...filtered, updated];
                  });
                }}
              />
            )}
          </div>
        </CardWrapper>

        <CardWrapper
          className={
            tableType === 'corporation'
              ? `${s.rightPanelLayout} ${s.rightPanelWide}`
              : s.rightPanelLayout
          }
          padding={16}
        >
          {tableType === 'product' && (
            <ProductFeeAddForm
              rightPanelMode={rightPanelMode}
              onSetRightPanelMode={setRightPanelMode}
              addProductForm={addProductForm}
              onAddProductFormChange={(patch) =>
                setAddProductForm((prev) => ({ ...prev, ...patch }))
              }
              eventForm={eventForm}
              onEventFormChange={updateEventForm}
              addableProducts={addableProducts}
              currentFees={currentFees}
              corpOptions={corpOptions}
              hospitalOptions={hospitalOptions}
              onAddProduct={addProduct}
              onAddEvent={handleSaveEvent}
              onResetEventForm={resetEventForm}
              editingEventId={editingEventId}
            />
          )}
          {tableType === 'corporation' && (
            <CorporationFeeAddForm
              corporation={corporations.find((c) => c.id === selectedCorporationId) ?? null}
              onSave={(corpData) => {
                setCorporations((prev) =>
                  prev.map((c) =>
                    c.id === corpData.id
                      ? {
                          ...c,
                          additionalFeeRate: corpData.additionalFeeRate,
                          tieredFeeTiers: corpData.tieredFeeTiers,
                        }
                      : c,
                  ),
                );
              }}
            />
          )}
        </CardWrapper>
      </div>
    </div>
  );
}
