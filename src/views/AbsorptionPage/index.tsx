'use client';

import { PageTitle, PageDesc } from '@/components/Common/Text';
import * as s from './index.css';

export function AbsorptionPage() {
  return (
    <div className={s.page}>
      <PageTitle title="흡수율" />
      <PageDesc>흡수율 조회 및 관리 화면입니다.</PageDesc>
    </div>
  );
}
