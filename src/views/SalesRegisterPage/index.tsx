'use client';

import Link from 'next/link';
import { HiPhotograph, HiDocumentText } from 'react-icons/hi';
import { useApp } from '@/store/appStore';
import { mockPharmas } from '@/store/mockData';
import { theme } from '@/theme';
import { SingleSelect } from '@/components/Common/Select';
import { Column } from '@/components/Common/Flex';
import * as s from './index.css';

const NOTICE_PREVIEW: { title: string; date: string }[] = [
  { title: '2025년 1분기 실적 제출 일정 안내', date: '2025.02.28' },
  { title: '엑셀 양식 개편 안내 (v2.0)', date: '2025.02.15' },
  { title: '처방사진 업로드 규격 안내', date: '2025.02.01' },
];

export function SalesRegisterPage() {
  const { userRole, currentPharmaId, setCurrentPharmaId } = useApp();
  const pharmas = mockPharmas;

  const showMenu = userRole === 'corporation' && pharmas.length > 0 && currentPharmaId;

  return (
    <div className={s.page}>
      <h1>실적 등록</h1>
      <p>제출할 제약사를 고른 뒤 아래 메뉴를 이용하세요.</p>

      <div className={s.pharmaCard}>
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
          <h2 className={s.sectionTitle}>메뉴 선택</h2>
          <div className={s.cardGrid}>
            <div className={`${s.noticeCardWrap} ${s.dashboardCard}`}>
              <h2>공지사항</h2>
              <p>실적 등록·업로드 관련 공지와 안내를 확인하세요.</p>
              <ul className={s.noticeList}>
                {NOTICE_PREVIEW.map((n, i) => (
                  <li key={i}>
                    <span className="notice-title">{n.title}</span>
                    <span className="notice-date">{n.date}</span>
                  </li>
                ))}
              </ul>
              <Link href="/upload/notice">공지사항 보기 →</Link>
            </div>
            <Link href="/upload/sales" className={s.menuCard}>
              <span className="icon" aria-hidden>
                <HiDocumentText size={24} />
              </span>
              <span className="card-inner">
                실적 업로드
                <span className={s.menuCardDesc}>엑셀(.xlsx, .xls) 파일로 업로드</span>
              </span>
            </Link>
            <Link href="/upload/prescription" className={s.menuCard}>
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
