/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { useApp } from '@/context/AppContext';
import { theme } from '@/theme';
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

const fieldRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  '& label': { fontWeight: 600, fontSize: 14, color: theme.colors.text },
});

const dayInput = css({
  width: 72,
  minHeight: 40,
  padding: `0 ${theme.spacing(2)}px`,
  fontSize: 14,
  border: `2px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  textAlign: 'right',
  boxSizing: 'border-box',
  '&:focus': {
    outline: 'none',
    borderColor: theme.colors.primary,
    boxShadow: `0 0 0 2px ${theme.colors.primary}20`,
  },
});

const actionRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
});

function getThisMonthLabel(): string {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
}

export function DeadlineManagePage() {
  const { userRole } = useApp();
  const thisMonthLabel = useMemo(getThisMonthLabel, []);
  const [deadlineDay, setDeadlineDay] = useState(5);

  const updateDay = useCallback((value: number) => {
    setDeadlineDay(Math.min(31, Math.max(1, value)));
  }, []);

  const handleSave = useCallback(() => {
    // TODO: API 연동
  }, []);

  if (userRole === 'corporation') return <Navigate to="/" replace />;

  return (
    <div css={pageStyles}>
      <h1>마감일 관리</h1>
      <p>이번 달 실적·정산 마감일(일)을 설정합니다.</p>

      <div css={cardStyles}>
        <div css={fieldRow}>
          <label htmlFor="deadline-day">이번 달 ({thisMonthLabel}) 마감일</label>
          <input
            id="deadline-day"
            type="number"
            css={dayInput}
            min={1}
            max={31}
            value={deadlineDay}
            onChange={(e) =>
              updateDay(e.target.value === '' ? 1 : Number(e.target.value) || 1)
            }
            aria-label="마감일 일자"
          />
          <span css={css({ color: theme.colors.textMuted, fontSize: 14 })}>일</span>
        </div>
        <div css={actionRow}>
          <Button variant="primary" onClick={handleSave}>
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
