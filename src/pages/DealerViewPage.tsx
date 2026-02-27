/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { useApp } from '@/context/AppContext';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';

const pageStyles = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  '& .page-header': {
    flexShrink: 0,
    marginBottom: theme.spacing(1),
  },
  '& .page-header h1': { margin: 0, fontSize: '1.25rem', fontWeight: 600, color: theme.colors.text },
  '& .page-header p': { margin: 0, fontSize: 13, color: theme.colors.textMuted },
});

const layoutWrap = css({
  display: 'flex',
  gap: theme.spacing(4),
  flex: 1,
  minHeight: 0,
  alignItems: 'stretch',
});

const mainArea = css({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const corpListSidebar = css({
  width: 260,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.sm,
  '& .corp-search': {
    flexShrink: 0,
    padding: theme.spacing(2),
    '& input': {
      width: '100%',
      minHeight: 44,
      padding: `0 ${theme.spacing(2)}px`,
      fontSize: 14,
      borderRadius: theme.radius.md,
      border: `2px solid ${theme.colors.border}`,
      '&:focus': {
        outline: 'none',
        borderColor: theme.colors.primary,
        boxShadow: `0 0 0 2px ${theme.colors.primary}20`,
      },
      '&::placeholder': { color: theme.colors.textMuted },
    },
  },
  '& .corp-list': {
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  '& button': {
    display: 'block',
    width: '100%',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    textAlign: 'left',
    border: 'none',
    borderRadius: theme.radius.md,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    color: theme.colors.text,
    '&:hover': { backgroundColor: theme.colors.background },
  },
  '& button[data-active="true"]': {
    backgroundColor: `${theme.colors.primary}14`,
    color: theme.colors.primary,
    fontWeight: 600,
  },
});

const dealerCountBadge = css({
  display: 'inline-block',
  marginLeft: theme.spacing(1),
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 12,
  backgroundColor: theme.colors.background,
  color: theme.colors.textMuted,
});

const promrBadge = css({
  display: 'inline-block',
  marginLeft: theme.spacing(1),
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 12,
  backgroundColor: `${theme.colors.primary}20`,
  color: theme.colors.primary,
});

const contentWrap = css({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.sm,
  overflow: 'hidden',
});

const contentHeader = css({
  flexShrink: 0,
  padding: theme.spacing(3),
  borderBottom: `1px solid ${theme.colors.border}`,
  '& h2': { margin: 0, fontSize: 18, fontWeight: 600, color: theme.colors.text },
  '& p': { margin: `${theme.spacing(1)}px 0 0`, fontSize: 13, color: theme.colors.textMuted },
});

const tableWrap = css({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 12,
  },
  '& th, & td': {
    padding: theme.spacing(1.5),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  '& th': {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colors.background,
    fontWeight: 600,
    zIndex: 1,
  },
  '& tbody tr:hover': {
    backgroundColor: `${theme.colors.primary}06`,
  },
});

const linkStyles = css({
  color: theme.colors.primary,
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
});

const fileActionGroup = css({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
});

const linkButton = css({
  color: theme.colors.primary,
  background: 'none',
  border: 'none',
  padding: 0,
  fontSize: 'inherit',
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': { textDecoration: 'underline' },
});

const modalOverlay = css({
  position: 'fixed',
  inset: 0,
  backgroundColor: theme.colors.overlay,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
});

const previewModalBox = css({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.md,
  width: '90vw',
  maxWidth: 1200,
  maxHeight: '90vh',
  overflow: 'auto',
  padding: theme.spacing(4),
  position: 'relative',
});

const modalHeader = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(4),
  '& h2': { margin: 0, fontSize: 18, fontWeight: 600, color: theme.colors.text },
});

const previewContent = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 400,
  '& img': {
    maxWidth: '100%',
    maxHeight: '70vh',
    objectFit: 'contain',
  },
});

const emptyState = css({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.colors.textMuted,
  fontSize: 14,
});

export function DealerViewPage() {
  const { userRole, corporations, dealers } = useApp();
  const [selectedCorpId, setSelectedCorpId] = useState<string | null>(corporations[0]?.id ?? null);
  const [corpSearch, setCorpSearch] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  const filteredCorps = useMemo(() => {
    const query = corpSearch.trim().toLowerCase();
    if (!query) return corporations;
    return corporations.filter((c) => c.name.toLowerCase().includes(query));
  }, [corporations, corpSearch]);

  const dealersForCorp = useMemo(() => {
    if (!selectedCorpId) return [];
    return dealers.filter((d) => d.corporationId === selectedCorpId);
  }, [dealers, selectedCorpId]);

  const selectedCorp = useMemo(
    () => corporations.find((c) => c.id === selectedCorpId),
    [corporations, selectedCorpId]
  );

  const dealerCountByCorpId = useMemo(() => {
    const map = new Map<string, number>();
    dealers.forEach((d) => {
      map.set(d.corporationId, (map.get(d.corporationId) || 0) + 1);
    });
    return map;
  }, [dealers]);

  const handleCorpSelect = useCallback((corpId: string) => {
    setSelectedCorpId(corpId);
  }, []);

  const handlePreview = useCallback((url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
  }, []);

  const closePreviewModal = useCallback(() => {
    setPreviewUrl(null);
    setPreviewTitle('');
  }, []);

  if (userRole === 'corporation') return <Navigate to="/" replace />;

  return (
    <div css={pageStyles}>
      <div className="page-header">
        <h1>법인별 계약 조회</h1>
        <p>법인별 딜러(영업사원) 계약 정보를 조회합니다.</p>
      </div>

      <div css={layoutWrap}>
        <aside css={corpListSidebar}>
          <div className="corp-search">
            <input
              type="search"
              placeholder="법인명 검색"
              value={corpSearch}
              onChange={(e) => setCorpSearch(e.target.value)}
              aria-label="법인 검색"
            />
          </div>
          <div className="corp-list">
            {filteredCorps.map((corp) => {
              const dealerCount = dealerCountByCorpId.get(corp.id) || 0;
              return (
                <button
                  key={corp.id}
                  type="button"
                  data-active={selectedCorpId === corp.id}
                  onClick={() => handleCorpSelect(corp.id)}
                >
                  {corp.name}
                  {corp.isPromr && <span css={promrBadge}>프로엠알</span>}
                  {dealerCount > 0 && (
                    <span css={dealerCountBadge}>{dealerCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <div css={mainArea}>
          <div css={contentWrap}>
            <div css={contentHeader}>
              <h2>
                {selectedCorp?.name ?? '법인 선택'}
                {selectedCorp?.isPromr && <span css={promrBadge}>프로엠알</span>}
              </h2>
              <p>
                {dealersForCorp.length > 0
                  ? `총 ${dealersForCorp.length}명의 딜러가 등록되어 있습니다.`
                  : '등록된 딜러가 없습니다.'}
              </p>
            </div>

            {dealersForCorp.length > 0 ? (
              <div css={tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>영업사원명</th>
                      <th>전화번호</th>
                      <th>이메일</th>
                      <th>신고필증</th>
                      <th>계약서</th>
                      <th>사업자 등록증</th>
                      <th>등록일</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dealersForCorp.map((d) => (
                      <tr key={d.id}>
                        <td>{d.salespersonName}</td>
                        <td>{d.phone}</td>
                        <td>{d.email}</td>
                        <td>
                          {d.reportCertUrl ? (
                            <div css={fileActionGroup}>
                              <button
                                type="button"
                                css={linkButton}
                                onClick={() => handlePreview(d.reportCertUrl!, '신고필증 미리보기')}
                              >
                                미리보기
                              </button>
                              <span css={css({ color: theme.colors.textMuted })}>|</span>
                              <a href={d.reportCertUrl} download css={linkStyles}>
                                다운로드
                              </a>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>
                          {d.contractUrl ? (
                            <div css={fileActionGroup}>
                              <button
                                type="button"
                                css={linkButton}
                                onClick={() => handlePreview(d.contractUrl!, '계약서 미리보기')}
                              >
                                미리보기
                              </button>
                              <span css={css({ color: theme.colors.textMuted })}>|</span>
                              <a href={d.contractUrl} download css={linkStyles}>
                                다운로드
                              </a>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>
                          {d.businessLicenseUrl ? (
                            <div css={fileActionGroup}>
                              <button
                                type="button"
                                css={linkButton}
                                onClick={() => handlePreview(d.businessLicenseUrl!, '사업자 등록증 미리보기')}
                              >
                                미리보기
                              </button>
                              <span css={css({ color: theme.colors.textMuted })}>|</span>
                              <a href={d.businessLicenseUrl} download css={linkStyles}>
                                다운로드
                              </a>
                            </div>
                          ) : (
                            '-'
                          )}
                        </td>
                        <td>{d.createdAt.slice(0, 10)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div css={emptyState}>
                {selectedCorp ? '등록된 딜러가 없습니다.' : '법인을 선택하세요.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {previewUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-modal-title"
          css={modalOverlay}
          onClick={closePreviewModal}
        >
          <div css={previewModalBox} onClick={(e) => e.stopPropagation()}>
            <div css={modalHeader}>
              <h2 id="preview-modal-title">{previewTitle}</h2>
              <Button variant="ghost" size="icon" onClick={closePreviewModal} aria-label="닫기">×</Button>
            </div>
            <div css={previewContent}>
              <img src={previewUrl} alt={previewTitle} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
