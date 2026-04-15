'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { ArrowRight, Building2, FileText, Image } from 'lucide-react';
import { useApp } from '@/store/appStore';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import type { Pharma } from '@/types';
import * as s from './index.css';

type Props = {
  pharma: Pharma;
  onSelect: () => void;
};

function PharmaEntryCard({ pharma, onSelect }: Props) {
  return (
    <button
      type="button"
      className={s.pharmaEntryCard}
      onClick={onSelect}
      aria-label={`${pharma.name} 실적 등록하기`}
    >
      <span className={s.pharmaEntryIcon} aria-hidden>
        <Building2 size={28} aria-hidden />
      </span>
      <span className={s.pharmaEntryName}>{pharma.name}</span>
      <span className={s.pharmaEntryArrow} aria-hidden>
        <ArrowRight size={20} aria-hidden />
      </span>
    </button>
  );
}

export function SalesRegisterPage() {
  const { userRole, currentPharmaId, setCurrentPharmaId } = useApp();
  const pharmas = useDemoPlayStore((s) => s.pharmas);
  const notices = useDemoPlayStore((s) => s.notices);
  const selectedPharma = pharmas.find((p) => p.id === currentPharmaId);
  const showPortal = userRole === 'corporation' && pharmas.length > 0 && selectedPharma;

  /** 위탁사 포털: 시스템 공지 mock·스토어 기준 최신 3건 */
  const systemNoticePreview = useMemo(() => {
    return [...notices]
      .filter((n) => n.noticeScope === 'system')
      .sort((a, b) => b.no - a.no)
      .slice(0, 3);
  }, [notices]);

  return (
    <div className={s.page}>
      {!showPortal ? (
        <div className={s.selectPhase}>
          <div className={s.selectPhaseHeader}>
            <h1 className={s.selectPhaseTitle}>실적 등록</h1>
            <p className={s.selectPhaseDesc}>제출할 제약사를 선택하세요</p>
          </div>
          <div className={s.pharmaEntryGrid}>
            {pharmas.map((pharma) => (
              <PharmaEntryCard
                key={pharma.id}
                pharma={pharma}
                onSelect={() => setCurrentPharmaId(pharma.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={s.portalPhase}>
          <div className={s.portalHeader}>
            <div className={s.portalHeaderInner}>
              <span className={s.portalPharmaName}>{selectedPharma.name}</span>
              <span className={s.portalTitle}>실적 등록</span>
            </div>
            <p className={s.portalSubtitle}>{selectedPharma.name} 실적 제출 포털</p>
            <button
              type="button"
              className={s.switchPharmaBtn}
              onClick={() => setCurrentPharmaId('')}
              aria-label="다른 제약사 선택"
            >
              다른 제약사 선택
            </button>
          </div>

          <div className={s.portalContent}>
            <div className={s.cardGrid}>
              <div className={`${s.noticeCardWrap} ${s.dashboardCard}`}>
                <h2>공지사항</h2>
                <p>실적 등록·업로드 관련 공지와 안내를 확인하세요.</p>
                <ul className={s.noticeList}>
                  {systemNoticePreview.map((n) => (
                    <li key={n.id}>
                      <Link
                        href={`/corporation/upload/notice/${n.id}`}
                        className={s.noticePreviewLink}
                      >
                        <span className="notice-title">{n.title}</span>
                        <span className="notice-date">{n.createdAt}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/corporation/upload/notice" className={s.noticeLinkBtn}>
                  공지사항 보기 →
                </Link>
              </div>
              <Link href="/corporation/upload/sales" className={s.menuCard}>
                <span className="icon" aria-hidden>
                  <FileText size={24} aria-hidden />
                </span>
                <span className="card-inner">
                  실적 업로드
                  <span className={s.menuCardDesc}>엑셀(.xlsx, .xls) 파일로 업로드</span>
                </span>
              </Link>
              <Link href="/corporation/upload/prescription" className={s.menuCard}>
                <span className="icon" aria-hidden>
                  <Image size={24} aria-hidden />
                </span>
                <span className="card-inner">처방사진 업로드</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
