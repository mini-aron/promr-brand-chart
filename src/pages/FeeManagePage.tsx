/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { useApp } from '@/context/AppContext';
import { mockProductFees } from '@/store/mockData';
import type { ProductFee } from '@/types';
import { theme } from '@/theme';
import { SingleSelect } from '@/components/Common/Select';
import { Button } from '@/components/Common/Button';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { color: theme.colors.textMuted, marginBottom: theme.spacing(4) },
});

const cardStyles = css({
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadow.sm,
});

const monthSelectStyles = css({
  marginBottom: theme.spacing(4),
  '& label': { display: 'block', marginBottom: theme.spacing(2), fontWeight: 600, fontSize: 15 },
  '& select': {
    minHeight: 48,
    padding: `0 ${theme.spacing(3)}px`,
    paddingRight: 40,
    fontSize: 15,
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.border}`,
    minWidth: 200,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    '&:focus': { outline: 'none', borderColor: theme.colors.primary },
  },
});

const tableWrap = css({
  fontSize: 12,
  '& table': { width: '100%', borderCollapse: 'collapse', minWidth: 400 },
  '& th, & td': {
    padding: theme.spacing(1.5),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
    borderRight: `1px solid ${theme.colors.border}`,
  },
  '& th:first-child, & td:first-child': { width: 220, minWidth: 220, maxWidth: 220 },
  '& td:first-child': { padding: 0, verticalAlign: 'middle' },
  '& th:last-child, & td:last-child': { borderRight: 'none' },
  '& th': { backgroundColor: theme.colors.background, fontWeight: 600 },
});

const rowModified = css({
  backgroundColor: `color-mix(in srgb, ${theme.colors.primary} 22%, transparent)`,
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
  '& label': { display: 'block', marginBottom: theme.spacing(1), fontSize: 13, fontWeight: 600 },
  '& .fee-input-wrap input': { width: 88, minHeight: 36, textAlign: 'right' },
  '& select': {
    minHeight: 40,
    padding: `0 ${theme.spacing(2)}px`,
    paddingRight: 36,
    fontSize: 14,
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.border}`,
    minWidth: 220,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    '&:focus': { outline: 'none', borderColor: theme.colors.primary },
  },
  '& button': {
    padding: `${theme.buttonPadding.y}px ${theme.spacing(3)}px`,
    fontSize: 14,
    fontWeight: 600,
    borderRadius: theme.radius.md,
    border: 'none',
    backgroundColor: theme.colors.primary,
    color: theme.colors.buttonText,
    cursor: 'pointer',
    '&:hover': { backgroundColor: theme.colors.primaryHover },
  },
});

const productSearchBlock = css({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  '& input[type="search"]': {
    maxWidth: 320,
    padding: `${theme.spacing(1.5)}px ${theme.spacing(2)}px`,
    fontSize: 14,
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.border}`,
    '&:focus': { outline: 'none', borderColor: theme.colors.primary },
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

export function FeeManagePage() {
  const { userRole } = useApp();
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

  if (userRole === 'corporation') return <Navigate to="/" replace />;

  return (
    <div css={pageStyles}>
      <h1>수수료관리</h1>
      <p>월별·품목별 수수료율(%)을 설정합니다.</p>

      <div css={cardStyles}>
        <div css={css({ display: 'flex', alignItems: 'flex-end', gap: theme.spacing(2), marginBottom: theme.spacing(4), flexWrap: 'wrap' })}>
          <div css={[monthSelectStyles, css({ marginBottom: 0 })]}>
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

        <div css={tableWrap}>
          <table>
            <thead>
              <tr>
                <th>품목코드</th>
                <th>품목명</th>
                <th>EDI코드</th>
                <th>수수료율 (%)</th>
              </tr>
            </thead>
            <tbody>
              {currentFees.map((p, index) => (
                <tr key={`${selectedMonth}-${index}`} css={isRowModified(index) ? rowModified : undefined}>
                  <td css={css({ padding: theme.spacing(1.5) })}>
                    <input
                      type="text"
                      css={productCodeInputStyles}
                      value={p.productCode}
                      onChange={(e) => updateProductCode(index, e.target.value)}
                      aria-label={`${p.productName} 품목코드`}
                    />
                  </td>
                  <td>{p.productName}</td>
                  <td>{p.ediCode ?? '-'}</td>
                  <td css={feeInputCell}>
                    <input
                      css={feeInputStyles}
                      type="number"
                      min={0}
                      max={100}
                      step={0.1}
                      value={p.feeRate}
                      onChange={(e) =>
                        updateFeeRate(p.productCode, Number(e.target.value) || 0)
                      }
                      aria-label={`${p.productName} 수수료율`}
                    />
                    <span className="fee-suffix">%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div css={addFormRow}>
          <div css={productSearchBlock}>
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
