/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Navigate, Link } from 'react-router-dom';
import { HiPhotograph, HiDocumentText } from 'react-icons/hi';
import { useApp } from '@/context/AppContext';
import { theme } from '@/theme';
import { SingleSelect } from '@/components/Common/Select';
import { Column } from '@/components/Common/Flex';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { color: theme.colors.textMuted, marginBottom: theme.spacing(4) },
});

const pharmaCard = css({
  padding: theme.spacing(3),
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  marginBottom: theme.spacing(4),
  maxWidth: 360,
  '& label': {
    display: 'block',
    fontSize: 13,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing(1),
    fontWeight: 500,
  },
});

const sectionTitle = css({
  fontSize: 16,
  fontWeight: 600,
  color: theme.colors.text,
  marginBottom: theme.spacing(3),
});

const cardGrid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: theme.spacing(4),
  alignItems: 'start',
});

const noticeCardWrap = css({
  gridColumn: '1 / -1',
});

const dashboardCard = css({
  padding: theme.spacing(5),
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadow.sm,
  minHeight: 200,
  '& h2': { fontSize: 20, marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { fontSize: 15, margin: 0, color: theme.colors.textMuted, marginBottom: theme.spacing(3) },
  '& a': {
    color: theme.colors.primary,
    fontWeight: 600,
    fontSize: 15,
    textDecoration: 'none',
  },
  '& a:hover': { textDecoration: 'underline' },
});

const noticeList = css({
  listStyle: 'none',
  padding: 0,
  margin: `0 0 ${theme.spacing(3)}px 0`,
  borderTop: `1px solid ${theme.colors.border}`,
  paddingTop: theme.spacing(3),
  '& li': {
    fontSize: 15,
    padding: `${theme.spacing(2)}px 0`,
    borderBottom: `1px solid ${theme.colors.border}30`,
    '&:last-child': { borderBottom: 'none' },
  },
  '& .notice-title': { color: theme.colors.text, fontWeight: 600 },
  '& .notice-date': { fontSize: 14, color: theme.colors.textMuted, marginLeft: theme.spacing(2) },
});

const menuCardDesc = css({
  fontSize: 13,
  color: theme.colors.textMuted,
  fontWeight: 400,
  marginTop: theme.spacing(0.5),
});

const menuCard = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(4),
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  textDecoration: 'none',
  color: theme.colors.text,
  fontWeight: 600,
  fontSize: 16,
  boxShadow: theme.shadow.sm,
  transition: 'border-color 0.2s, box-shadow 0.2s',
  '&:hover': {
    borderColor: theme.colors.primary,
    boxShadow: theme.shadow.md,
  },
  '& .icon': {
    flexShrink: 0,
    width: 48,
    height: 48,
    borderRadius: theme.radius.md,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${theme.colors.primary}14`,
    color: theme.colors.primary,
  },
  '& .card-inner': { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' },
});

const NOTICE_PREVIEW: { title: string; date: string }[] = [
  { title: '2025년 1분기 실적 제출 일정 안내', date: '2025.02.28' },
  { title: '엑셀 양식 개편 안내 (v2.0)', date: '2025.02.15' },
  { title: '처방사진 업로드 규격 안내', date: '2025.02.01' },
];

export function SalesRegisterPage() {
  const { userRole, currentPharmaId, setCurrentPharmaId, pharmas } = useApp();

  if (userRole === 'pharma') return <Navigate to="/" replace />;

  const showMenu = userRole === 'corporation' && pharmas.length > 0 && currentPharmaId;

  return (
    <div css={pageStyles}>
      <h1>실적 등록</h1>
      <p>제출할 제약사를 고른 뒤 아래 메뉴를 이용하세요.</p>

      <div css={pharmaCard}>
        <label>제출할 제약사</label>
        <SingleSelect
          options={pharmas.map((p) => ({ label: p.name, value: p.id }))}
          selected={currentPharmaId}
          onChange={(v) => setCurrentPharmaId(String(v))}
          placeholder="제약사를 선택하세요"
          aria-label="제출할 제약사"
        />
      </div>

      {showMenu && (
        <Column gap={theme.spacing(2)}>
          <h2 css={sectionTitle}>메뉴 선택</h2>
          <div css={cardGrid}>
            <div css={[noticeCardWrap, dashboardCard]}>
              <h2>공지사항</h2>
              <p>실적 등록·업로드 관련 공지와 안내를 확인하세요.</p>
              <ul css={noticeList}>
                {NOTICE_PREVIEW.map((n, i) => (
                  <li key={i}>
                    <span className="notice-title">{n.title}</span>
                    <span className="notice-date">{n.date}</span>
                  </li>
                ))}
              </ul>
              <Link to="/upload/notice">공지사항 보기 →</Link>
            </div>
            <Link to="/upload/sales" css={menuCard}>
              <span className="icon" aria-hidden>
                <HiDocumentText size={24} />
              </span>
              <span className="card-inner">
                실적 업로드
                <span css={menuCardDesc}>엑셀(.xlsx, .xls) 파일로 업로드</span>
              </span>
            </Link>
            <Link to="/upload/prescription" css={menuCard}>
              <span className="icon" aria-hidden>
                <HiPhotograph size={24} />
              </span>
              <span className="card-inner">
                처방사진 업로드
              </span>
            </Link>
          </div>
        </Column>
      )}
    </div>
  );
}
