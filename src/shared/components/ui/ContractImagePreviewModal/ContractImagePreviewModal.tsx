'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { Download, RotateCcw, X, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import * as s from './ContractImagePreviewModal.css';

function sanitizeDownloadBase(name: string): string {
  const t = name
    .replace(/[<>:"/\\|?*]/g, '_')
    .replace(/\s*·\s*/g, '_')
    .trim()
    .slice(0, 120);
  return t || 'document';
}

function extFromBlobType(ct: string): string {
  if (ct.includes('pdf')) return 'pdf';
  if (ct.includes('jpeg') || ct.includes('jpg')) return 'jpg';
  if (ct.includes('png')) return 'png';
  if (ct.includes('webp')) return 'webp';
  return 'bin';
}

export type ContractImagePreviewModalProps = {
  previewUrl: string;
  previewTitle: string;
  onClose: () => void;
};

/**
 * 제약사 DealerViewPage와 동일한 풀스크린 이미지 뷰어(줌·패닝·휠 줌).
 */
export function ContractImagePreviewModal({
  previewUrl,
  previewTitle,
  onClose,
}: ContractImagePreviewModalProps) {
  const [previewScale, setPreviewScale] = useState(1);
  const [previewPan, setPreviewPan] = useState({ x: 0, y: 0 });
  const [isPreviewDragging, setIsPreviewDragging] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [downloadBusy, setDownloadBusy] = useState(false);
  const previewDragRef = useRef({ startX: 0, startY: 0, originX: 0, originY: 0 });
  const downloadBusyRef = useRef(false);

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
    setPreviewPan({ x: 0, y: 0 });
    setPreviewScale(1);
  }, [previewUrl]);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const handleClose = useCallback(() => {
    setPreviewScale(1);
    setPreviewPan({ x: 0, y: 0 });
    onClose();
  }, [onClose]);

  const handleDownload = useCallback(async () => {
    if (downloadBusyRef.current) return;
    downloadBusyRef.current = true;
    setDownloadBusy(true);
    const base = sanitizeDownloadBase(previewTitle);
    try {
      if (previewUrl.startsWith('blob:')) {
        const a = document.createElement('a');
        a.href = previewUrl;
        a.download = `${base}.png`;
        a.click();
        return;
      }
      const res = await fetch(previewUrl);
      if (!res.ok) throw new Error('fetch failed');
      const blob = await res.blob();
      const ext = extFromBlobType(blob.type);
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = `${base}.${ext}`;
      a.click();
      URL.revokeObjectURL(href);
    } catch {
      alert('다운로드에 실패했습니다. 네트워크 또는 파일 접근을 확인해 주세요.');
    } finally {
      downloadBusyRef.current = false;
      setDownloadBusy(false);
    }
  }, [previewUrl, previewTitle]);

  return (
    <div
      className={s.previewModalOverlay}
      role="dialog"
      aria-modal="true"
      aria-label="계약서 미리보기"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className={s.previewModalBox}>
        <div className={s.previewModalHeader}>
          <div className={s.previewModalTitle}>{previewTitle}</div>
          <div className={s.previewModalActions}>
            <Button
              variant="ghost"
              size="icon"
              aria-label="이미지 다운로드"
              title="다운로드"
              disabled={downloadBusy}
              onClick={() => void handleDownload()}
            >
              <Download size={18} aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="줌 아웃"
              title="줌 아웃"
              onClick={() => setPreviewScale((sc) => Math.max(0.5, Number((sc - 0.25).toFixed(2))))}
            >
              <ZoomOut size={18} aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="줌 인"
              title="줌 인"
              onClick={() => setPreviewScale((sc) => Math.min(3, Number((sc + 0.25).toFixed(2))))}
            >
              <ZoomIn size={18} aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="줌·위치 초기화"
              title="줌·위치 초기화"
              onClick={() => {
                setPreviewScale(1);
                setPreviewPan({ x: 0, y: 0 });
              }}
            >
              <RotateCcw size={18} aria-hidden />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="닫기"
              title="닫기"
              onClick={handleClose}
            >
              <X size={18} aria-hidden />
            </Button>
          </div>
        </div>

        <div
          className={s.previewModalBody}
          onWheel={(e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.12 : 0.12;
            setPreviewScale((sc) => {
              const next = Math.min(3, Math.max(0.5, sc + delta));
              return Number(next.toFixed(2));
            });
          }}
        >
          <img
            className={clsx(
              s.previewModalImage,
              isPreviewDragging && s.previewModalImageDragging,
              !finePointer && s.previewModalImageNoPan,
            )}
            src={previewUrl}
            alt={previewTitle}
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
    </div>
  );
}
