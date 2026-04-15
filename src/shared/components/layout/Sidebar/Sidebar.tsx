'use client';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/store/appStore';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import { logoutUser } from '@/utils/authActions';
import { useThemeMode } from '@/store/themeStore';
import type { UserRole } from '@/types';
import {
  Bell,
  Building2,
  ChevronRight,
  ClipboardList,
  Home,
  UserRound,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Column } from '@/shared/components/ui/Flex';
import { clsx } from 'clsx';
import { SingleSelect } from '@/shared/components/ui/Select';
import { NotificationBell } from '@/shared/components/layout/NotificationBell/NotificationBell';
import * as s from './Sidebar.css';

/** 대시보드 홈 단일 경로 (`DashboardHomePage`에서 역할 분기) */
const DASHBOARD_HOME_PATH = '/home';

type NavLink = { to: string; label: string; icon?: LucideIcon };

type NavSection = {
  label: string;
  children: NavLink[];
  icon?: LucideIcon;
};

type NavItem = NavLink | NavSection;

function isNavSection(item: NavItem): item is NavSection {
  return 'children' in item;
}

function isDashboardRole(role: string): role is UserRole {
  return role === 'corporation' || role === 'pharma' || role === 'admin';
}

const corporationNavItems: NavItem[] = [
  // { to: '/corporation/upload', label: '실적 등록' },
  { to: '/corporation/upload/notice', label: '공지사항', icon: Bell },
  { to: '/corporation/contract-manage', label: '계약관리', icon: ClipboardList },
  // { to: '/corporation/aggregate', label: '법인 실적 조회' },
  // { to: '/corporation/filter-request', label: '필터링 요청' },
];

const pharmaNavItems: NavItem[] = [
  // {
  //   label: '기준정보 관리',
  //   icon: Building2,
  //   children: [
  //     { to: '/pharma/hospitals', label: '병의원 관리' },
  //     { to: '/pharma/fees', label: '수수료관리' },
  //     { to: '/pharma/corp-manage', label: '법인 관리' },
  //   ],
  // },
  // {
  //   label: '정산',
  //   children: [
  //     { to: '/pharma/aggregate', label: '정산확인' },
  //     { to: '/pharma/settlement', label: '법인별 정산확인' },
  //     { to: '/pharma/settlement-by-region', label: '지역별 정산확인' },
  //   ],
  // },
  // { to: '/pharma/filter-approval', label: '거래선 관리' },
  {
    label: '계약관리',
    icon: ClipboardList,
    children: [
      // { to: '/pharma/contract-management', label: '대시보드' },
      { to: '/pharma/contract-management/view', label: '법인별 계약' },
      { to: '/pharma/contract-management/review', label: '계약서 검토' },
      { to: '/pharma/contract-management/request', label: '재위탁 확인' },
      // { to: '/pharma/contract-management/manage', label: '계약서 관리' },
    ],
  },
  // {
  //   label: '흡수율',
  //   children: [
  //     { to: '/pharma/absorption/pharmacy-mapping', label: '문전약국 매핑' },
  //     { to: '/pharma/absorption/pharmacy-settings', label: '문전약국 설정' },
  //     { to: '/pharma/absorption/calculation', label: '흡수율 계산' },
  //   ],
  // },
];

/** 어드민: 병의원 관리만 노출 */
const adminNavItems: NavItem[] = [
  { to: '/admin/hospitals', label: '병의원 관리', icon: Building2 },
  { to: '/admin/notices', label: '공지사항', icon: Bell },
  { to: '/admin/pharma-manage', label: '제약사 관리', icon: Building2 },
  { to: '/admin/corp-manage', label: '법인 관리', icon: Building2 },
  { to: '/admin/user-manage', label: '사용자 관리', icon: UserRound },
];

function getNavItems(role: UserRole): NavItem[] {
  if (role === 'corporation') return corporationNavItems;
  if (role === 'admin') return adminNavItems;
  return pharmaNavItems;
}

function isSectionActive(section: NavSection, pathname: string): boolean {
  return section.children.some((c) => c.to === pathname || pathname.startsWith(c.to + '/'));
}

function iconForNavItem(item: NavItem): React.ReactNode {
  const Icon = item.icon ?? ClipboardList;
  return <Icon size={16} className={s.navIcon} aria-hidden />;
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { userRole, setUserRole, setCurrentCorporationId, setCurrentPharmaId, currentPharmaId } =
    useApp();
  const pharmas = useDemoPlayStore((st) => st.pharmas);
  const { themeMode, toggleTheme } = useThemeMode();

  const homePath = DASHBOARD_HOME_PATH;

  const navItems = useMemo(
    () => (isDashboardRole(userRole) ? getNavItems(userRole) : []),
    [userRole],
  );
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!isDashboardRole(userRole)) return;
    const items = navItems;
    const next: Record<string, boolean> = {};
    items.forEach((item) => {
      if (isNavSection(item) && isSectionActive(item, pathname)) {
        next[item.label] = true;
      }
    });
    setOpenSections((prev) => ({ ...prev, ...next }));
  }, [pathname, userRole, navItems]);

  const toggleSection = (label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const flatNavLinks = useMemo(
    () => navItems.flatMap((item) => (isNavSection(item) ? item.children : [item])),
    [navItems],
  );

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const isActiveNavLink = (to: string) => {
    const shouldBeExact = flatNavLinks.some((x) => x.to !== to && x.to.startsWith(to + '/'));
    if (shouldBeExact) return pathname === to;
    return isActive(to);
  };

  const sidebarLogoSrc = useMemo(() => {
    if (userRole !== 'pharma') return '/logo.svg';
    const p = pharmas.find((x) => x.id === currentPharmaId);
    return p?.logoUrl?.trim() ? p.logoUrl : '/logo.svg';
  }, [userRole, currentPharmaId, pharmas]);

  return (
    <aside className={s.aside}>
      <div className={s.topBar}>
        <Link href={homePath} className={s.logo} aria-label="PROPF 홈">
          <img src={sidebarLogoSrc} alt="PROPF" width={122} height={56} className={s.logoImg} />
        </Link>
        <NotificationBell />
      </div>
      <nav>
        <Column gap={4} className={s.navLinks}>
          <Link href={homePath} className={clsx(s.navLink, isActive(homePath) && s.activeLink)}>
            {iconForNavItem({ to: homePath, label: '홈', icon: Home })}
            <span className={s.navLabel}>홈</span>
          </Link>
          {userRole === 'corporation' && (
            <Link
              href="/corporation/mypage"
              className={clsx(s.navLink, isActiveNavLink('/corporation/mypage') && s.activeLink)}
            >
              {iconForNavItem({ to: '/corporation/mypage', label: '마이페이지', icon: UserRound })}
              <span className={s.navLabel}>마이페이지</span>
            </Link>
          )}
          {userRole === 'pharma' && (
            <Link
              href="/pharma/my-page"
              className={clsx(s.navLink, isActiveNavLink('/pharma/my-page') && s.activeLink)}
            >
              {iconForNavItem({ to: '/pharma/my-page', label: '마이페이지', icon: UserRound })}
              <span className={s.navLabel}>마이페이지</span>
            </Link>
          )}
          {userRole === 'pharma' && (
            <Link
              href="/pharma/notices"
              className={clsx(s.navLink, isActiveNavLink('/pharma/notices') && s.activeLink)}
            >
              {iconForNavItem({ to: '/pharma/notices', label: '공지사항', icon: Bell })}
              <span className={s.navLabel}>공지사항</span>
            </Link>
          )}
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
                  <span className={s.navLink}>
                    {iconForNavItem(item)}
                    <span className={s.navLabel}>{item.label}</span>
                  </span>
                  <span className={openSections[item.label] ? s.chevronOpen : s.chevronClosed}>
                    <ChevronRight size={14} aria-hidden />
                  </span>
                </Button>
                {openSections[item.label] && (
                  <Column gap={4} className={s.subNavWrap}>
                    {item.children.map((link) => (
                      <Link
                        key={link.to}
                        href={link.to}
                        className={clsx(s.subNavLink, isActiveNavLink(link.to) && s.activeLink)}
                      >
                        <span className={s.navLabel}>{link.label}</span>
                      </Link>
                    ))}
                  </Column>
                )}
              </div>
            ) : (
              <Link
                key={item.to}
                href={item.to}
                className={clsx(s.navLink, isActiveNavLink(item.to) && s.activeLink)}
              >
                {iconForNavItem(item)}
                <span className={s.navLabel}>{item.label}</span>
              </Link>
            ),
          )}
        </Column>
      </nav>
      <div className={s.bottomBlock}>
        <Button
          variant="ghost"
          className={s.themeToggle}
          onClick={toggleTheme}
          aria-label="테마 전환"
        >
          {themeMode === 'light' ? '다크 모드' : '라이트 모드'}
        </Button>
        <Button
          variant="ghost"
          className={s.themeToggle}
          onClick={() => {
            void logoutUser().then(() => router.replace('/promotion'));
          }}
          aria-label="로그아웃"
        >
          로그아웃
        </Button>
        <SingleSelect
          menuPlacement="above"
          options={[
            { label: '한국메디컬-CSO', value: 'corporation' },
            { label: '샘플제약-제약', value: 'pharma' },
            // { label: '어드민', value: 'admin' },
          ]}
          selected={userRole}
          onChange={(v) => {
            const role = v as UserRole;
            setUserRole(role);
            if (role === 'corporation') setCurrentCorporationId('corp-1');
            if (role === 'pharma') setCurrentPharmaId('pharma-1');
            router.replace(DASHBOARD_HOME_PATH);
          }}
          placeholder="역할 선택"
          aria-label="사용자 역할"
        />
      </div>
    </aside>
  );
}
