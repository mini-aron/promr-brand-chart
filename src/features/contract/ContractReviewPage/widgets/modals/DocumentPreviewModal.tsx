'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/shared/components/ui/Button';
import { formatRelativeTime } from '../../lib/utils';
import * as b from '../../contractReviewBadges.css';
import * as s from './DocumentPreviewModal.css';

export type PreviewSidebarItem = {
  id: number;
  title: string;
  receivedAt: string;
  badgeLabel: string;
  badgeClass: string;
};

export type DocumentPreviewStackNav = {
  counterLabel: string;
  onPrev: () => void;
  onNext: () => void;
};

type Props = {
  previewUrl: string;
  previewCorporationName: string;
  previewDocumentName: string;
  contractStartDate?: string;
  contractEndDate?: string;
  sidebarItems?: PreviewSidebarItem[];
  selectedSidebarId?: number | null;
  onSelectSidebar?: (id: number) => void;
  stackNav?: DocumentPreviewStackNav | null;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
};

const INITIAL_PAN = { x: 0, y: 0 };

export function DocumentPreviewModal({
  previewUrl,
  previewCorporationName,
  previewDocumentName,
  contractStartDate = '',
  contractEndDate = '',
  sidebarItems = [],
  selectedSidebarId,
  onSelectSidebar,
  stackNav,
  onClose,
  onApprove,
  onReject,
}: Props) {
  const [sideListOpen, setSideListOpen] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [previewPan, setPreviewPan] = useState(INITIAL_PAN);
  const [isPreviewDragging, setIsPreviewDragging] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const previewDragRef = useRef({ startX: 0, startY: 0, originX: 0, originY: 0 });
  const modalBodyRef = useRef<HTMLDivElement>(null);
  const selectedRowRef = useRef<HTMLButtonElement>(null);
  const previewAlt = `${previewCorporationName} · ${previewDocumentName}`;

  useEffect(() => {
    const el = modalBodyRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.12 : 0.12;
      setPreviewScale((sc) => Number(Math.min(3, Math.max(0.5, sc + delta)).toFixed(2)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (!stackNav) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stackNav.onPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        stackNav.onNext();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, stackNav]);

  useEffect(() => {
    if (!sideListOpen) return;
    selectedRowRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [selectedSidebarId, sideListOpen]);

  useEffect(() => {
    if (previewUrl) {
      setPreviewPan(INITIAL_PAN);
      setPreviewScale(1);
    }
  }, [previewUrl]);

  useEffect(() => {
    if (!isPreviewDragging) return;
    const onMove = (e: PointerEvent) => {
      setPreviewPan({
        x: previewDragRef.current.originX + (e.clientX - previewDragRef.current.startX),
        y: previewDragRef.current.originY + (e.clientY - previewDragRef.current.startY),
      });
    };
    const onUp = () => setIsPreviewDragging(false);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [isPreviewDragging]);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <div
      className={s.previewModalOverlay}
      role="dialog"
      aria-modal="true"
      aria-label="계약서 미리보기"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={s.previewModalBox}>
        {/* 사이드바 */}
        {sideListOpen ? (
          <aside className={s.previewModalSideList} aria-label="계약서 목록">
            <div className={s.previewModalSideListTitleRow}>
              <span className={s.previewModalSideListHeading}>계약서 목록</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="계약서 목록 접기"
                onClick={() => setSideListOpen(false)}
              >
                <ChevronLeft size={18} aria-hidden />
              </Button>
            </div>
            <div className={s.previewModalSideListScroll}>
              {sidebarItems.length === 0 ? (
                <p className={s.previewModalSideEmpty}>표시할 항목이 없습니다.</p>
              ) : (
                sidebarItems.map((item) => {
                  const isActive = item.id === selectedSidebarId;
                  return (
                    <button
                      key={item.id}
                      ref={isActive ? selectedRowRef : undefined}
                      type="button"
                      className={clsx(
                        s.previewModalSideItem,
                        isActive && s.previewModalSideItemActive,
                      )}
                      onClick={() => onSelectSidebar?.(item.id)}
                    >
                      <div className={s.previewModalSideItemBody}>
                        <div className={s.previewModalSideItemTitle}>{item.title}</div>
                        <span
                          className={s.previewModalSideItemReceived}
                          title={formatRelativeTime(item.receivedAt)}
                        >
                          제출{' '}
                          {new Date(item.receivedAt).toLocaleString('ko-KR', {
                            dateStyle: 'short',
                            timeStyle: 'short',
                          })}
                        </span>
                        <span className={clsx(item.badgeClass, s.previewModalStatusChip)}>
                          {item.badgeLabel}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </aside>
        ) : (
          <div className={s.previewModalSideListRail}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="계약서 목록 펼치기"
              onClick={() => setSideListOpen(true)}
            >
              <ChevronRight size={18} aria-hidden />
            </Button>
          </div>
        )}

        {/* 메인 영역 */}
        <div className={s.previewModalMain}>
          <div className={s.previewModalHeader}>
            <div className={s.previewModalHeaderMain}>
              <div className={s.previewModalCorpRow}>
                <div className={s.previewModalCorpName}>{previewCorporationName}</div>
              </div>
              <div className={s.previewModalHeaderSub}>
                {stackNav && (
                  <div className={s.previewModalStackNav}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      aria-label="이전 서류"
                      onClick={(e) => {
                        e.stopPropagation();
                        stackNav.onPrev();
                      }}
                    >
                      <ChevronLeft size={18} aria-hidden />
                    </Button>
                    <span className={s.previewModalStackNavCounter}>{stackNav.counterLabel}</span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="small"
                      aria-label="다음 서류"
                      onClick={(e) => {
                        e.stopPropagation();
                        stackNav.onNext();
                      }}
                    >
                      <ChevronRight size={18} aria-hidden />
                    </Button>
                  </div>
                )}
                <div className={s.previewModalDocName}>{previewDocumentName}</div>
              </div>
            </div>
            <div className={s.previewModalActions}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="줌 아웃"
                onClick={() =>
                  setPreviewScale((sc) => Math.max(0.5, Number((sc - 0.25).toFixed(2))))
                }
              >
                <ZoomOut size={18} aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="줌 인"
                onClick={() => setPreviewScale((sc) => Math.min(3, Number((sc + 0.25).toFixed(2))))}
              >
                <ZoomIn size={18} aria-hidden />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="줌·위치 초기화"
                onClick={() => {
                  setPreviewScale(1);
                  setPreviewPan({ x: 0, y: 0 });
                }}
              >
                <RotateCcw size={18} aria-hidden />
              </Button>
              <Button variant="ghost" size="icon" aria-label="닫기" onClick={onClose}>
                <X size={18} aria-hidden />
              </Button>
            </div>
          </div>

          <div ref={modalBodyRef} className={s.previewModalBody}>
            <div className={s.previewModalImageArea}>
              <div className={s.previewModalImageWrap}>
                <img
                  className={clsx(
                    s.previewModalImage,
                    isPreviewDragging && s.previewModalImageDragging,
                    !finePointer && s.previewModalImageNoPan,
                  )}
                  src={previewUrl}
                  alt={previewAlt}
                  style={{
                    transform: `translate(${previewPan.x}px, ${previewPan.y}px) scale(${previewScale})`,
                  }}
                  draggable={false}
                  onPointerDown={(e) => {
                    if (!finePointer || e.button !== 0) return;
                    e.preventDefault();
                    previewDragRef.current = {
                      startX: e.clientX,
                      startY: e.clientY,
                      originX: previewPan.x,
                      originY: previewPan.y,
                    };
                    setIsPreviewDragging(true);
                  }}
                />
              </div>
            </div>
            <aside className={s.previewModalRightPanel} aria-label="검토 액션">
              <h4 className={s.previewModalRightPanelTitle}>계약 검토</h4>
              {contractStartDate && (
                <div className={s.previewModalDateRow}>
                  <div className={s.previewModalDateField}>
                    <span className={s.previewModalDateLabel}>계약 시작일</span>
                    <span>{contractStartDate}</span>
                  </div>
                  <div className={s.previewModalDateField}>
                    <span className={s.previewModalDateLabel}>계약 종료일</span>
                    <span>{contractEndDate}</span>
                  </div>
                </div>
              )}
              <div className={s.previewModalFooterActions}>
                <Button type="button" variant="primary" onClick={onApprove}>
                  <Check size={18} aria-hidden />
                  승인
                </Button>
                <Button type="button" variant="danger" onClick={onReject}>
                  <X size={18} aria-hidden />
                  반려
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
