/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import { css } from '@emotion/react';
import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useAuthContext } from '@/context/AuthContext';
import { useThemeMode } from '@/context/ThemeContext';
import { HiChevronRight } from 'react-icons/hi';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';
import { Column } from '@/components/Common/Flex';
import { SingleSelect } from '@/components/Common/Select';

const asideStyles = css({
  width: 220,
  minWidth: 220,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  backgroundColor: theme.colors.surface,
  borderRight: `1px solid ${theme.colors.border}`,
  padding: theme.spacing(3),
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

const navLinks = css({
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

const subNavWrap = css({
  paddingLeft: theme.spacing(2),
  marginTop: 2,
  borderLeft: `2px solid ${theme.colors.border}`,
  marginLeft: theme.spacing(1),
  '& a': {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    fontSize: 14,
  },
});

const chevronStyles = (open: boolean) =>
  css({
    fontSize: 12,
    transition: 'transform 0.2s',
    transform: open ? 'rotate(90deg)' : 'rotate(0)',
  });

const themeToggleStyles = css({
  fontSize: 13,
  padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
});

const bottomBlockStyles = css({
  marginTop: 'auto',
  paddingTop: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
});

type NavLink = { to: string; label: string };

type NavSection = {
  label: string;
  children: NavLink[];
};

type NavItem = NavLink | NavSection;

function isNavSection(item: NavItem): item is NavSection {
  return 'children' in item;
}

const corporationNavItems: NavItem[] = [
  {
    label: '실적 등록',
    children: [
      { to: '/upload/sales', label: '실적 업로드' },
      { to: '/upload/prescription', label: '처방사진 업로드' },
    ],
  },
  { to: '/dealer-manage', label: '계약관리' },
  { to: '/aggregate', label: '법인 실적 조회' },
  { to: '/filter-request', label: '필터링 요청' },
];

const pharmaNavItems: NavItem[] = [
  {
    label: '기준정보 관리',
    children: [
      { to: '/hospitals', label: '병의원 관리' },
      { to: '/fees', label: '수수료관리' },
    ],
  },
  { to: '/aggregate', label: '정산확인' },
  { to: '/settlement', label: '법인별 정산확인' },
  { to: '/filter-approval', label: '법인별 필터링 승인요청' },
  { to: '/dealer-view', label: '법인별 계약 조회' },
];

function getNavItems(role: 'corporation' | 'pharma'): NavItem[] {
  return role === 'corporation' ? corporationNavItems : pharmaNavItems;
}

function isSectionActive(section: NavSection, pathname: string): boolean {
  return section.children.some((c) => c.to === pathname || pathname.startsWith(c.to + '/'));
}

export function Sidebar() {
  const location = useLocation();
  const { userRole, setUserRole, pharmas, currentPharmaId, setCurrentPharmaId } = useApp();
  const { logout } = useAuthContext();
  const { themeMode, toggleTheme } = useThemeMode();

  const navItems = userRole === 'corporation' || userRole === 'pharma' ? getNavItems(userRole) : [];
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (userRole !== 'corporation' && userRole !== 'pharma') return;
    const items = getNavItems(userRole);
    const next: Record<string, boolean> = {};
    items.forEach((item) => {
      if (isNavSection(item) && isSectionActive(item, location.pathname)) {
        next[item.label] = true;
      }
    });
    setOpenSections((prev) => ({ ...prev, ...next }));
  }, [location.pathname, userRole]);

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside css={asideStyles}>
      <Link to="/" css={logoStyles} aria-label="PROPF 홈">
        <span className="logo-pro">PRO</span>
        <span className="logo-pf">PF</span>
      </Link>
      {userRole === 'corporation' && pharmas.length > 0 && (
        <SingleSelect
          options={pharmas.map((p) => ({ label: p.name, value: p.id }))}
          selected={currentPharmaId}
          onChange={(v) => setCurrentPharmaId(String(v))}
          placeholder="제약사 선택"
          aria-label="제약사"
        />
      )}
      <nav>
        <Column gap={theme.spacing(1)} css={navLinks}>
          <Link to="/" css={isActive('/') ? activeLinkStyles : undefined}>
            홈
          </Link>
          {navItems.map((item) =>
            isNavSection(item) ? (
              <div key={item.label}>
                <Button
                  variant="menu"
                  size="menu"
                  css={isSectionActive(item, location.pathname) ? activeLinkStyles : undefined}
                  onClick={() => toggleSection(item.label)}
                  aria-expanded={openSections[item.label]}
                >
                  {item.label}
                  <span css={chevronStyles(!!openSections[item.label])}>
                    <HiChevronRight size={14} />
                  </span>
                </Button>
                {openSections[item.label] && (
                  <Column gap={1} css={subNavWrap}>
                    {item.children.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        css={isActive(link.to) ? activeLinkStyles : undefined}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </Column>
                )}
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                css={isActive(item.to) ? activeLinkStyles : undefined}
              >
                {item.label}
              </Link>
            )
          )}
        </Column>
      </nav>
      <div css={bottomBlockStyles}>
        <Button variant="ghost" css={themeToggleStyles} onClick={toggleTheme} aria-label="테마 전환">
          {themeMode === 'light' ? '다크 모드' : '라이트 모드'}
        </Button>
        <Button variant="ghost" css={themeToggleStyles} onClick={() => logout()} aria-label="로그아웃">
          로그아웃
        </Button>
        <SingleSelect
          options={[
            { label: '법인', value: 'corporation' },
            { label: '제약사', value: 'pharma' },
          ]}
          selected={userRole}
          onChange={(v) => setUserRole(v as 'corporation' | 'pharma')}
          placeholder="역할 선택"
          aria-label="사용자 역할"
        />
      </div>
    </aside>
  );
}
