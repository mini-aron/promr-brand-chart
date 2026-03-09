/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { HiOutlineTrash } from 'react-icons/hi';
import { useApp } from '@/context/AppContext';
import { mockProductFees, mockCorporations } from '@/store/mockData';
import type { FeeEvent } from '@/types';
import { theme } from '@/theme';
import { SingleSelect } from '@/components/Common/Select';
import { Button } from '@/components/Common/Button';
import { tableWrapPlain } from '@/style';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { color: theme.colors.textMuted, marginBottom: theme.spacing(4) },
});

const layout = css({
  display: 'grid',
  gridTemplateColumns: '1fr 380px',
  gap: theme.spacing(4),
  alignItems: 'start',
  '@media (max-width: 900px)': { gridTemplateColumns: '1fr' },
});

const cardStyles = css({
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  padding: theme.spacing(4),
  boxShadow: theme.shadow.sm,
});

const listTitle = css({
  marginBottom: theme.spacing(2),
  fontSize: 16,
  fontWeight: 600,
  color: theme.colors.text,
});

const eventTableWrap = css(tableWrapPlain, {
  overflowX: 'auto',
  '& table': { minWidth: 520 },
  '& th:last-child, & td:last-child': { borderRight: 'none', width: 48, textAlign: 'center' },
});

const formTitle = css({
  marginBottom: theme.spacing(3),
  fontSize: 16,
  fontWeight: 600,
  color: theme.colors.text,
});

const field = css({
  marginBottom: theme.spacing(3),
  '& label': {
    display: 'block',
    marginBottom: theme.spacing(1),
    fontSize: 13,
    fontWeight: 600,
    color: theme.colors.text,
  },
});

const checkboxRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  '& input[type="checkbox"]': {
    width: 18,
    height: 18,
    accentColor: theme.colors.primary,
    cursor: 'pointer',
  },
  '& label': { fontSize: 13, fontWeight: 600, cursor: 'pointer', margin: 0 },
});

const inputText = css({
  width: '100%',
  minHeight: 40,
  padding: `0 ${theme.spacing(2)}px`,
  fontSize: 14,
  border: `2px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  boxSizing: 'border-box',
  '&:focus': { outline: 'none', borderColor: theme.colors.primary },
});

const inputNum = css({
  width: '100%',
  minHeight: 40,
  padding: `0 ${theme.spacing(2)}px`,
  fontSize: 14,
  border: `2px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  textAlign: 'right',
  boxSizing: 'border-box',
  '&:focus': { outline: 'none', borderColor: theme.colors.primary },
});

const periodRow = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  '& label': {
    display: 'block',
    marginBottom: theme.spacing(1),
    fontSize: 13,
    fontWeight: 600,
    color: theme.colors.text,
  },
  '& input[type="date"]': {
    width: '100%',
    minHeight: 40,
    padding: `0 ${theme.spacing(2)}px`,
    fontSize: 14,
    border: `2px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    boxSizing: 'border-box',
    '&:focus': { outline: 'none', borderColor: theme.colors.primary },
  },
});

const submitRow = css({
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${theme.colors.border}`,
});

const emptyList = css({
  padding: theme.spacing(4),
  textAlign: 'center',
  color: theme.colors.textMuted,
  fontSize: 14,
});

function createEvent(form: {
  productCode: string;
  corporationId: string;
  startDate?: string;
  endDate?: string;
  useAppliedFee: boolean;
  appliedFee?: number;
  additionalFee?: number;
  remark?: string;
}): FeeEvent {
  return {
    id: `ev-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    productCode: form.productCode,
    corporationId: form.corporationId,
    startDate: form.startDate || undefined,
    endDate: form.endDate || undefined,
    useAppliedFee: form.useAppliedFee,
    appliedFee: form.useAppliedFee ? (form.appliedFee ?? 0) : undefined,
    additionalFee: form.useAppliedFee ? undefined : (form.additionalFee ?? 0),
    remark: form.remark ?? '',
  };
}

function getInitialForm() {
  return {
    productCode: '',
    corporationId: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
    useAppliedFee: true,
    appliedFee: 0,
    additionalFee: 0,
    remark: '',
  };
}

export function EventManagePage() {
  const { userRole } = useApp();
  const [events, setEvents] = useState<FeeEvent[]>([]);
  const [form, setForm] = useState(getInitialForm);

  const productOptions = useMemo(
    () =>
      mockProductFees.map((p) => ({
        label: `${p.productName} (${p.productCode})`,
        value: p.productCode,
      })),
    []
  );

  const corporationOptions = useMemo(
    () => [{ label: '전체', value: 'all' }, ...mockCorporations.map((c) => ({ label: c.name, value: c.id }))],
    []
  );

  const productNameByCode = useMemo(
    () => Object.fromEntries(mockProductFees.map((p) => [p.productCode, p.productName])),
    []
  );
  const corporationNameById = useMemo<Record<string, string>>(
    () => ({ all: '전체', ...Object.fromEntries(mockCorporations.map((c) => [c.id, c.name])) }),
    []
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!form.productCode || !form.corporationId) return;
      const newEvent = createEvent(form);
      setEvents((prev) => [...prev, newEvent]);
      setForm(getInitialForm());
    },
    [form]
  );

  const removeEvent = useCallback((eventId: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
  }, []);

  if (userRole === 'corporation') return <Navigate to="/" replace />;

  return (
    <div css={pageStyles}>
      <h1>이벤트관리</h1>
      <p>등록된 이벤트 목록을 확인하고, 우측 폼으로 새 이벤트를 등록합니다.</p>

      <div css={layout}>
        <div css={cardStyles}>
          <h2 css={listTitle}>등록된 이벤트 목록</h2>
          {events.length === 0 ? (
            <p css={emptyList}>등록된 이벤트가 없습니다.</p>
          ) : (
            <div css={eventTableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>품목</th>
                    <th>법인</th>
                    <th>기간</th>
                    <th>적용수수료 사용</th>
                    <th>적용수수료 / 추가수수료</th>
                    <th>비고</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((ev) => (
                    <tr key={ev.id}>
                      <td>
                        {productNameByCode[ev.productCode] ?? ev.productCode} ({ev.productCode})
                      </td>
                      <td>{corporationNameById[ev.corporationId] ?? ev.corporationId}</td>
                      <td>
                        {ev.startDate || ev.endDate
                          ? [ev.startDate, ev.endDate].filter(Boolean).join(' ~ ')
                          : '-'}
                      </td>
                      <td>{ev.useAppliedFee ? '사용' : '미사용'}</td>
                      <td>
                        {ev.useAppliedFee
                          ? `${ev.appliedFee ?? 0}%`
                          : `${ev.additionalFee ?? 0}`}
                      </td>
                      <td>{ev.remark ?? '-'}</td>
                      <td>
                        <Button
                          variant="ghost"
                          size="small"
                          onClick={() => removeEvent(ev.id)}
                          aria-label="이벤트 삭제"
                          css={css({ padding: theme.spacing(1), minWidth: 32 })}
                        >
                          <HiOutlineTrash size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div css={cardStyles}>
          <h2 css={formTitle}>이벤트 등록</h2>
          <form onSubmit={handleSubmit}>
            <div css={field}>
              <label htmlFor="event-product">품목</label>
              <SingleSelect
                id="event-product"
                options={productOptions}
                selected={form.productCode || null}
                onChange={(v) =>
                  setForm((prev) => ({ ...prev, productCode: v == null ? '' : String(v) }))
                }
                placeholder="품목 선택"
                aria-label="품목"
              />
            </div>
            <div css={field}>
              <label htmlFor="event-corporation">법인</label>
              <SingleSelect
                id="event-corporation"
                options={corporationOptions}
                selected={form.corporationId || null}
                onChange={(v) =>
                  setForm((prev) => ({ ...prev, corporationId: v == null ? '' : String(v) }))
                }
                placeholder="법인 선택"
                aria-label="법인"
              />
            </div>
            <div css={periodRow}>
              <div>
                <label htmlFor="event-start-date">시작일</label>
                <input
                  id="event-start-date"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                  aria-label="기간 시작일"
                />
              </div>
              <div>
                <label htmlFor="event-end-date">종료일</label>
                <input
                  id="event-end-date"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                  aria-label="기간 종료일"
                />
              </div>
            </div>
            <div css={checkboxRow}>
              <input
                type="checkbox"
                id="event-use-applied-fee"
                checked={form.useAppliedFee}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, useAppliedFee: e.target.checked }))
                }
                aria-label="적용수수료 사용여부"
              />
              <label htmlFor="event-use-applied-fee">적용수수료 사용여부</label>
            </div>
            {form.useAppliedFee ? (
              <div css={field}>
                <label htmlFor="event-applied-fee">적용수수료 (%)</label>
                <input
                  id="event-applied-fee"
                  type="number"
                  css={inputNum}
                  min={0}
                  step={0.1}
                  value={form.appliedFee}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      appliedFee: e.target.value === '' ? 0 : Number(e.target.value) || 0,
                    }))
                  }
                  aria-label="적용수수료"
                />
              </div>
            ) : (
              <div css={field}>
                <label htmlFor="event-additional-fee">추가수수료</label>
                <input
                  id="event-additional-fee"
                  type="number"
                  css={inputNum}
                  min={0}
                  step={0.1}
                  value={form.additionalFee}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      additionalFee: e.target.value === '' ? 0 : Number(e.target.value) || 0,
                    }))
                  }
                  aria-label="추가수수료"
                />
              </div>
            )}
            <div css={field}>
              <label htmlFor="event-remark">비고</label>
              <input
                id="event-remark"
                type="text"
                css={inputText}
                value={form.remark}
                onChange={(e) => setForm((prev) => ({ ...prev, remark: e.target.value }))}
                placeholder="비고 입력"
                aria-label="비고"
              />
            </div>
            <div css={submitRow}>
              <Button type="submit" variant="primary" disabled={!form.productCode || !form.corporationId}>
                등록
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
