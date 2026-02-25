/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { useApp } from '@/context/AppContext';
import { mockProductFees } from '@/store/mockData';
import type { ProductFee } from '@/types';
import { theme } from '@/theme';

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
  '& th:last-child, & td:last-child': { borderRight: 'none' },
  '& th': { backgroundColor: theme.colors.background, fontWeight: 600 },
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
    color: 'white',
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

  const [productSearch, setProductSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<ProductFee | null>(null);
  const [newFeeRate, setNewFeeRate] = useState<number>(0);
  const [addError, setAddError] = useState<string | null>(null);

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
        <div css={monthSelectStyles}>
          <label htmlFor="fee-month">적용 월</label>
          <select
            id="fee-month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {MONTH_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div css={tableWrap}>
          <table>
            <thead>
              <tr>
                <th>품목코드</th>
                <th>품목명</th>
                <th>수수료율 (%)</th>
              </tr>
            </thead>
            <tbody>
              {currentFees.map((p) => (
                <tr key={p.productCode}>
                  <td>{p.productCode}</td>
                  <td>{p.productName}</td>
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
            <select
              id="product-select"
              value={selectedProduct ? selectedProduct.productCode : ''}
              onChange={(e) => {
                const code = e.target.value;
                const p = addableProducts.find((x) => x.productCode === code) ?? null;
                setSelectedProduct(p);
              }}
              aria-label="추가할 품목 선택"
            >
              <option value="">선택하세요 (품목코드 · 품목명)</option>
              {addableProducts.map((p) => (
                <option key={p.productCode} value={p.productCode}>
                  {p.productCode} · {p.productName}
                </option>
              ))}
            </select>
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
          <button type="button" onClick={addProduct}>
            품목 추가
          </button>
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
