'use client';

import { useAppStore } from '@/store/appStore';
import { HomePage } from '@/features/home/HomePage';
import { PharmaHomePage } from '@/features/pharma-dashboard/PharmaHomePage';
import { CorporationHomePage } from '@/features/corporation-dashboard/CorporationHomePage';

/** 대시보드 홈 단일 진입점(`/home`). `userRole`에 따라 화면만 분기합니다. */
export function DashboardHomePage() {
  const userRole = useAppStore((s) => s.userRole);

  if (userRole === 'corporation') {
    return <CorporationHomePage />;
  }

  if (userRole === 'pharma') {
    return <PharmaHomePage />;
  }

  return <HomePage />;
}
