/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useThemeMode } from '@/context/ThemeContext';
import { theme } from '@/theme';

const layoutStyles = css({
  height: '100vh',
  maxHeight: '100dvh',
  overflow: 'hidden',
  backgroundColor: theme.colors.background,
  display: 'flex',
  paddingLeft: theme.spacing(3),
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  boxSizing: 'border-box',
});

const sidebarStyles = css({
  width: 220,
  minWidth: 220,
  flexShrink: 0,
  backgroundColor: theme.colors.surface,
  borderRight: `1px solid ${theme.colors.border}`,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  boxShadow: theme.shadow.sm,
  borderRadius: theme.radius.lg,
});

const logoStyles = css({
  fontFamily: theme.fontFamily,
  display: 'block',
  fontSize: 24,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  textDecoration: 'none',
  marginBottom: theme.spacing(2),
  '& .logo-pro': { color: theme.colors.primary },
  '& .logo-pf': { color: theme.colors.text },
});

const navStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  '& a': {
    color: theme.colors.text,
    textDecoration: 'none',
    fontWeight: 600,
    padding: `${theme.buttonPadding.y}px ${theme.spacing(2)}px`,
    borderRadius: theme.radius.md,
    '&:hover': { backgroundColor: theme.colors.background },
  },
});

const activeLinkStyles = css({
  color: `${theme.colors.primary} !important`,
  backgroundColor: `${theme.colors.primary}12`,
});

const menuParentStyles = css({
  padding: `${theme.buttonPadding.y}px ${theme.spacing(2)}px`,
  borderRadius: theme.radius.md,
  fontWeight: 600,
  color: theme.colors.text,
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  width: '100%',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  '&:hover': { backgroundColor: theme.colors.background },
});

const subNavStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  paddingLeft: theme.spacing(2),
  marginTop: 2,
  borderLeft: `2px solid ${theme.colors.border}`,
  marginLeft: theme.spacing(1),
  '& a': {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    fontSize: 14,
  },
});

const themeToggleStyles = css({
  marginTop: 'auto',
  marginBottom: theme.spacing(1),
  fontSize: 13,
  padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.background,
  color: theme.colors.text,
  cursor: 'pointer',
  '&:hover': { backgroundColor: theme.colors.border },
});

const roleBadgeStyles = css({
  fontSize: 14,
  color: theme.colors.textMuted,
  padding: `${theme.buttonPadding.y}px ${theme.spacing(2)}px`,
  backgroundColor: theme.colors.background,
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.border}`,
});

const mainStyles = css({
  flex: 1,
  minWidth: 320,
  minHeight: 0,
  maxWidth: 2400,
  padding: theme.spacing(4),
  overflow: 'auto',
  boxSizing: 'border-box',
});

export function Layout() {
  const location = useLocation();
  const { userRole, setUserRole } = useApp();
  const { themeMode, toggleTheme } = useThemeMode();
  const isUploadPath = location.pathname.startsWith('/upload/');
  const [uploadOpen, setUploadOpen] = useState(isUploadPath);

  useEffect(() => {
    if (isUploadPath) setUploadOpen(true);
  }, [isUploadPath]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div css={layoutStyles}>
      <aside css={sidebarStyles}>
        <Link to="/" css={logoStyles} aria-label="PROPF 홈">
          <span className="logo-pro">PRO</span>
          <span className="logo-pf">PF</span>
        </Link>
        <nav css={navStyles}>
          <Link to="/" css={isActive('/') ? activeLinkStyles : undefined}>
            홈
          </Link>
          {userRole === 'corporation' && (
            <>
              <button
                type="button"
                css={[menuParentStyles, isUploadPath && activeLinkStyles]}
                onClick={() => setUploadOpen((o) => !o)}
                aria-expanded={uploadOpen}
              >
                실적 등록
                <span css={css({ fontSize: 12, transition: 'transform 0.2s', transform: uploadOpen ? 'rotate(90deg)' : 'rotate(0)' })}>›</span>
              </button>
              {uploadOpen && (
                <div css={subNavStyles}>
                  <Link
                    to="/upload/sales"
                    css={isActive('/upload/sales') ? activeLinkStyles : undefined}
                  >
                    실적 업로드
                  </Link>
                  <Link
                    to="/upload/prescription"
                    css={isActive('/upload/prescription') ? activeLinkStyles : undefined}
                  >
                    처방사진 업로드
                  </Link>
                </div>
              )}
              <Link
                to="/dealer-manage"
                css={isActive('/dealer-manage') ? activeLinkStyles : undefined}
              >
                계약관리
              </Link>
            </>
          )}
          {userRole === 'pharma' && (
            <>
              <Link
                to="/accounts"
                css={isActive('/accounts') ? activeLinkStyles : undefined}
              >
                거래처관리
              </Link>
              <Link
                to="/fees"
                css={isActive('/fees') ? activeLinkStyles : undefined}
              >
                수수료관리
              </Link>
              <Link
                to="/aggregate"
                css={isActive('/aggregate') ? activeLinkStyles : undefined}
              >
                정산확인
              </Link>
              <Link
                to="/settlement"
                css={isActive('/settlement') ? activeLinkStyles : undefined}
              >
                법인별 정산확인
              </Link>
              <Link
                to="/filter-approval"
                css={isActive('/filter-approval') ? activeLinkStyles : undefined}
              >
                법인별 필터링 승인요청
              </Link>
            </>
          )}
          {userRole === 'corporation' && (
            <>
              <Link
                to="/aggregate"
                css={isActive('/aggregate') ? activeLinkStyles : undefined}
              >
                법인 실적 조회
              </Link>
              <Link
                to="/filter-request"
                css={isActive('/filter-request') ? activeLinkStyles : undefined}
              >
                필터링 요청
              </Link>
            </>
          )}
        </nav>
        <button type="button" css={themeToggleStyles} onClick={toggleTheme} aria-label="테마 전환">
          {themeMode === 'light' ? '다크 모드' : '라이트 모드'}
        </button>
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value as 'corporation' | 'pharma')}
          css={roleBadgeStyles}
        >
          <option value="corporation">법인</option>
          <option value="pharma">제약사</option>
        </select>
      </aside>
      <main css={mainStyles}>
        <Outlet />
      </main>
    </div>
  );
}
