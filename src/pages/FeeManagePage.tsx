/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import { mockProductFees } from '@/store/mockData';
import type { ProductFee } from '@/types';
import { theme } from '@/theme';
import { SingleSelect } from '@/components/Common/Select';
import { Button } from '@/components/Common/Button';
import { DataTable } from '@/components/Common/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { tableRowModified } from '@/style/TableStyles';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2) },
  '& p': { marginBottom: theme.spacing(4) },
});

const cardStyles = css({
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadow.sm,
});

const feeTableWrap = css({
  '& table': { minWidth: 400 },
  '& th:first-child, & td:first-child': { width: 220, minWidth: 220, maxWidth: 220 },
  '& td:first-child': { padding: 0, verticalAlign: 'middle' },
});

const feeInputStyles = css({
  width: 88,
  minHeight: 36,
  padding: `0 ${theme.spacing(2)}px`,
  fontSize: 14,
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

const productCodeInputStyles = css({
  width: '100%',
  minHeight: 48,
  padding: theme.spacing(1.5),
  fontSize: 14,
  borderRadius: 0,
  border: 'none',
  backgroundColor: 'transparent',
  color: theme.colors.text,
  boxSizing: 'border-box',
  display: 'block',
  '&:focus': {
    outline: 'none',
    boxShadow: 'inset 0 0 0 2px ' + theme.colors.primary,
  },
});

const feeInputCell = css({
  '& .fee-suffix': {
    marginLeft: 4,
    fontSize: 13,
    color: theme.colors.textMuted,
  },
});

const addFormRow = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  alignItems: 'flex-end',
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(4),
  borderTop: `1px solid ${theme.colors.border}`,
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

  useEffect(() => {
    setInitialMonthlyFees((prev) => ({
      ...prev,
      [selectedMonth]: (monthlyFees[selectedMonth] ?? [...mockProductFees]).map((p) => ({ ...p })),
    }));
  }, [selectedMonth]);

  const currentFees = useMemo(() => {
    if (monthlyFees[selectedMonth]) return monthlyFees[selectedMonth];
    return [...mockProductFees];
  }, [selectedMonth, monthlyFees]);

  const updateFeeRate = useCallback(
    (productCode: string, feeRate: number) => {
      setMonthlyFees((prev) => {
        const list = prev[selectedMonth] ?? [...mockProductFees];
        const next = list.map((p) =>
          p.productCode === productCode ? { ...p, feeRate } : p
        );
        return { ...prev, [selectedMonth]: next };
      });
    },
    [selectedMonth]
  );

  const updateProductCode = useCallback(
    (index: number, newCode: string) => {
      setMonthlyFees((prev) => {
        const list = prev[selectedMonth] ?? [...mockProductFees];
        if (index < 0 || index >= list.length) return prev;
        const next = list.map((p, i) =>
          i === index ? { ...p, productCode: newCode } : p
        );
        return { ...prev, [selectedMonth]: next };
      });
    },
    [selectedMonth]
  );

  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductFee | null>(null);
  const [newFeeRate, setNewFeeRate] = useState<number>(0);
  const [addError, setAddError] = useState<string | null>(null);

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
    const q = productSearch.trim().toLowerCase();
    return mockProductFees.filter(
      (p) =>
        !currentCodes.has(p.productCode) &&
        (!q || p.productName.toLowerCase().includes(q) || p.productCode.toLowerCase().includes(q))
    );
  }, [selectedMonth, monthlyFees, productSearch]);

  useEffect(() => {
    if (
      selectedProduct &&
      !addableProducts.some((p) => p.productCode === selectedProduct.productCode)
    ) {
      setSelectedProduct(null);
    }
  }, [addableProducts, selectedProduct]);

  const addProduct = useCallback(() => {
    if (!selectedProduct) {
      setAddError('품목을 검색 후 목록에서 선택하세요.');
      return;
    }
    const list = monthlyFees[selectedMonth] ?? [...mockProductFees];
    if (list.some((p) => p.productCode === selectedProduct.productCode)) {
      setAddError('이미 존재하는 품목입니다.');
      return;
    }
    setAddError(null);
    setMonthlyFees((prev) => {
      const base = prev[selectedMonth] ?? [...mockProductFees];
      return {
        ...prev,
        [selectedMonth]: [
          ...base,
          { productCode: selectedProduct.productCode, productName: selectedProduct.productName, feeRate: newFeeRate },
        ],
      };
    });
    setSelectedProduct(null);
    setProductSearch('');
    setNewFeeRate(0);
  }, [selectedMonth, monthlyFees, selectedProduct, newFeeRate]);

  const columnHelper = createColumnHelper<ProductFee>();
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'productCode',
        header: '품목코드',
        cell: (info) => {
          const idx = currentFees.findIndex((p) => p.productCode === info.row.original.productCode);
          return (
            <input
              type="text"
              css={productCodeInputStyles}
              value={info.row.original.productCode}
              onChange={(e) => updateProductCode(idx, e.target.value)}
              aria-label={`${info.row.original.productName} 품목코드`}
            />
          );
        },
      }),
      columnHelper.accessor('productName', { header: '품목명' }),
      columnHelper.accessor('ediCode', { header: 'EDI코드', cell: (info) => info.getValue() ?? '-' }),
      columnHelper.display({
        id: 'feeRate',
        header: '수수료율 (%)',
        cell: (info) => (
          <span css={feeInputCell}>
            <input
              css={feeInputStyles}
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={info.row.original.feeRate}
              onChange={(e) =>
                updateFeeRate(info.row.original.productCode, Number(e.target.value) || 0)
              }
              aria-label={`${info.row.original.productName} 수수료율`}
            />
            <span className="fee-suffix">%</span>
          </span>
        ),
      }),
    ],
    [columnHelper, currentFees, updateProductCode, updateFeeRate]
  );

  const getRowCss = useCallback(
    (p: ProductFee) => {
      const idx = currentFees.findIndex((x) => x.productCode === p.productCode);
      return isRowModified(idx) ? tableRowModified : undefined;
    },
    [currentFees, isRowModified]
  );

  return (
    <div css={pageStyles}>
      <h1>수수료관리</h1>
      <p>월별·품목별 수수료율(%)을 설정합니다.</p>
      <div css={cardStyles}>
        <div css={css({ display: 'flex', alignItems: 'flex-end', gap: theme.spacing(2), marginBottom: theme.spacing(4), flexWrap: 'wrap' })}>
          <div css={css({ minWidth: 200, '& label': { display: 'block', marginBottom: theme.spacing(2), fontWeight: 600, fontSize: 15 } })}>
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
          {modifiedCount > 0 && (
            <Button variant="primary" onClick={handleSave}>
              저장 ({modifiedCount}건)
            </Button>
          )}
        </div>

        <DataTable<ProductFee>
          columns={columns}
          data={currentFees}
          getRowId={(p) => `${selectedMonth}-${p.productCode}`}
          variant="plain"
          tableCss={feeTableWrap}
          getRowCss={getRowCss}
        />
        <div css={addFormRow}>
          <div>
            <label htmlFor="product-search">품목명 검색</label>
            <input
              id="product-search"
              type="search"
              placeholder="품목명·품목코드로 검색"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              aria-label="품목명 검색"
            />
            <SingleSelect
              id="product-select"
              options={[
                { label: '선택하세요 (품목코드 · 품목명)', value: '' },
                ...addableProducts.map((p) => ({
                  label: `${p.productCode} · ${p.productName}`,
                  value: p.productCode,
                })),
              ]}
              selected={selectedProduct ? selectedProduct.productCode : ''}
              onChange={(v) => {
                const p = addableProducts.find((x) => x.productCode === v) ?? null;
                setSelectedProduct(p);
              }}
              placeholder="선택하세요 (품목코드 · 품목명)"
              aria-label="추가할 품목 선택"
            />
          </div>
          <div className="fee-input-wrap">
            <label htmlFor="new-fee-rate">수수료율</label>
            <div css={css({ display: 'flex', alignItems: 'center', gap: 4 })}>
              <input
                css={feeInputStyles}
                id="new-fee-rate"
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={newFeeRate === 0 ? '' : newFeeRate}
                onChange={(e) => setNewFeeRate(Number(e.target.value) || 0)}
                placeholder="0"
                aria-label="수수료율 입력"
              />
              <span css={css({ fontSize: 14, color: theme.colors.textMuted })}>%</span>
            </div>
          </div>
          <Button variant="primary" onClick={addProduct}>
            품목 추가
          </Button>
        </div>
        {addError && (
          <p css={css({ marginTop: theme.spacing(2), fontSize: 14, color: theme.colors.error })}>
            {addError}
          </p>
        )}
      </div>
    </div>
  );
}
