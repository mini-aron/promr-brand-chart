'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/store/appStore';
import { useAuthContext } from '@/context/AuthContext';
import { useThemeMode } from '@/context/ThemeContext';
import { HiChevronRight } from 'react-icons/hi';
import { Button } from '@/components/Common/Button';
import { Column } from '@/components/Common/Flex';
import { clsx } from 'clsx';
import { SingleSelect } from '@/components/Common/Select';
import * as s from './Sidebar.css';

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
  { to: '/upload', label: '실적 등록' },
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
  { to: '/filter-approval', label: '거래선 관리' },
  { to: '/dealer-view', label: '법인별 계약 조회' },
];

function getNavItems(role: 'corporation' | 'pharma'): NavItem[] {
  return role === 'corporation' ? corporationNavItems : pharmaNavItems;
}

function isSectionActive(section: NavSection, pathname: string): boolean {
  return section.children.some((c) => c.to === pathname || pathname.startsWith(c.to + '/'));
}

export function Sidebar() {
  const pathname = usePathname();
  const { userRole, setUserRole } = useApp();
  const { logout } = useAuthContext();
  const { themeMode, toggleTheme } = useThemeMode();

  const navItems = userRole === 'corporation' || userRole === 'pharma' ? getNavItems(userRole) : [];
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (userRole !== 'corporation' && userRole !== 'pharma') return;
    const items = getNavItems(userRole);
    const next: Record<string, boolean> = {};
    items.forEach((item) => {
      if (isNavSection(item) && isSectionActive(item, pathname)) {
        next[item.label] = true;
      }
    });
    setOpenSections((prev) => ({ ...prev, ...next }));
  }, [pathname, userRole]);

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (path: string) =>
    pathname === path || (path === '/upload' && pathname.startsWith('/upload'));

  return (
    <aside className={s.aside}>
      <Link href="/home" className={s.logo} aria-label="PROPF 홈">
        <span className={s.logoPro}>PRO</span>
        <span className={s.logoPf}>PF</span>
      </Link>
      <nav>
        <Column gap={4} className={s.navLinks}>
          <Link href="/home" className={clsx(s.navLink, isActive('/home') && s.activeLink)}>
            홈
          </Link>
          {navItems.map((item) =>
            isNavSection(item) ? (
              <div key={item.label}>
                <Button
                  variant="menu"
                  size="menu"
                  className={isSectionActive(item, pathname) ? s.activeLink : undefined}
                  onClick={() => toggleSection(item.label)}
                  aria-expanded={openSections[item.label]}
                >
                  {item.label}
                  <span className={openSections[item.label] ? s.chevronOpen : s.chevronClosed}>
                    <HiChevronRight size={14} />
                  </span>
                </Button>
                {openSections[item.label] && (
                  <Column gap={4} className={s.subNavWrap}>
                    {item.children.map((link) => (
                      <Link
                        key={link.to}
                        href={link.to}
                        className={clsx(s.subNavLink, isActive(link.to) && s.activeLink)}
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
                href={item.to}
                className={clsx(s.navLink, isActive(item.to) && s.activeLink)}
              >
                {item.label}
              </Link>
            )
          )}
        </Column>
      </nav>
      <div className={s.bottomBlock}>
        <Button variant="ghost" className={s.themeToggle} onClick={toggleTheme} aria-label="테마 전환">
          {themeMode === 'light' ? '다크 모드' : '라이트 모드'}
        </Button>
        <Button variant="ghost" className={s.themeToggle} onClick={() => logout()} aria-label="로그아웃">
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
