'use client';

import { useCallback, useState } from 'react';
import Link from 'next/link';
import { HiOutlineX } from 'react-icons/hi';
import { useApp } from '@/store/appStore';
import { mockHospitals, mockPrescriptionUploads, mockSalesRows } from '@/store/mockData';
import type { PrescriptionUpload } from '@/types';
import { Button } from '@/components/Common/Button';
import { PageTitle } from '@/components/Common/Text';
import { clsx } from 'clsx';
import * as s from './index.css';

/** 최근 N개월 옵션 (YYYY-MM) */
function getMonthOptions(count: number): { value: string; label: string }[] {
  const list: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    list.push({ value, label: `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월` });
  }
  return list;
}

const MONTH_OPTIONS = getMonthOptions(24);

export function PrescriptionUploadPage() {
  const { currentCorporationId } = useApp();
  const [prescriptionUploads, setPrescriptionUploads] = useState<PrescriptionUpload[]>(mockPrescriptionUploads);
  const hospitals = mockHospitals;
  const salesRows = mockSalesRows;
  const addPrescriptionUpload = useCallback((upload: PrescriptionUpload) => {
    setPrescriptionUploads((prev) => [...prev, upload]);
  }, []);
  const [settlementMonth, setSettlementMonth] = useState<string>(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`;
  });
  const [hospitalId, setHospitalId] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isDrag, setIsDrag] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const filteredHospitals = hospitals.filter((h) => h.corporationId === currentCorporationId);
  const canUploadImages = Boolean(settlementMonth && hospitalId);
  const targetSalesRows = salesRows.filter((r) => {
    if (r.corporationId !== currentCorporationId) return false;
    if (hospitalId && r.hospitalId !== hospitalId) return false;
    if (r.settlementMonth && r.settlementMonth !== settlementMonth) return false;
    return true;
  });

  const clearPreviews = useCallback(() => {
    setPreviewUrls((prev) => {
      prev.forEach((url) => URL.revokeObjectURL(url));
      return [];
    });
    setFiles([]);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDrag(false);
    if (!settlementMonth || !hospitalId) return;
    const items = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (items.length === 0) return;
    setFiles((prev) => [...prev, ...items]);
    setPreviewUrls((prev) => [...prev, ...items.map((f) => URL.createObjectURL(f))]);
  }, [settlementMonth, hospitalId]);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!settlementMonth || !hospitalId) return;
    const items = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'));
    if (items.length === 0) return;
    setFiles((prev) => [...prev, ...items]);
    setPreviewUrls((prev) => [...prev, ...items.map((f) => URL.createObjectURL(f))]);
    e.target.value = '';
  }, [settlementMonth, hospitalId]);

  const removeImageAt = useCallback((index: number) => {
    setPreviewUrls((prev) => {
      const url = prev[index];
      if (url) URL.revokeObjectURL(url);
      return prev.filter((_, i) => i !== index);
    });
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const submitUpload = useCallback(() => {
    if (files.length === 0 || targetSalesRows.length === 0) {
      setMessage('이미지를 선택하고, 해당 실적이 존재하는지 확인해 주세요. (병의원·월에 맞는 실적이 있어야 합니다.)');
      return;
    }
    const upload: PrescriptionUpload = {
      id: `p-${Date.now()}`,
      salesRowIds: targetSalesRows.map((r) => r.id),
      hospitalId: hospitalId || null,
      corporationId: currentCorporationId,
      imageUrls: previewUrls.slice(),
      uploadedAt: new Date().toISOString(),
      settlementMonth,
    };
    addPrescriptionUpload(upload);
    setMessage(`처방 사진 ${files.length}장이 업로드되었습니다. (${hospitalId ? '병의원별' : '전체'})`);
    clearPreviews();
  }, [files.length, targetSalesRows, currentCorporationId, hospitalId, settlementMonth, previewUrls, addPrescriptionUpload, clearPreviews]);

  const dropzoneClass = clsx(
    canUploadImages ? (isDrag ? s.dropzoneDrag : s.dropzoneBase) : s.dropzoneDisabled
  );

  return (
    <div className={s.page}>
      <p>
        <Link href="/corporation/upload" className={s.backLink}>
          ← 실적 등록으로 돌아가기
        </Link>
      </p>
      <PageTitle title="처방사진 업로드" />
      <p>대상(월 · 병의원)을 선택한 뒤, 해당 실적에 대한 처방 사진을 업로드합니다.</p>

      <section className={s.selectCard}>
        <h2 className={s.sectionTitle}>
          1. 대상 선택
        </h2>
        <div className={s.selectRow}>
          <div className={s.field}>
            <label htmlFor="prescription-month">처방월</label>
            <select
              id="prescription-month"
              value={settlementMonth}
              onChange={(e) => setSettlementMonth(e.target.value)}
              aria-describedby="month-hint"
            >
              {MONTH_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <p id="month-hint" className="field-hint">
              정산/처방 기준 월을 선택하세요.
            </p>
          </div>
          <div className={s.field}>
            <label htmlFor="prescription-hospital">병의원</label>
            <select
              id="prescription-hospital"
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
              aria-describedby="hospital-hint"
            >
              <option value="">전체 (해당 월 실적 전체)</option>
              {filteredHospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
            <p id="hospital-hint" className="field-hint">
              거래처를 선택하세요. 전체를 선택하면 해당 월 실적 전체에 연결됩니다.
            </p>
          </div>
        </div>
        <p className={s.targetCount}>
          해당 조건의 실적: <strong className={s.targetCountStrong}>{targetSalesRows.length}건</strong>
        </p>
      </section>

      <section className={s.sectionWrap}>
        <h2 className={s.sectionTitle2}>
          2. 처방 사진 업로드
        </h2>
        <label htmlFor="rx-input" className={s.uploadLabel}>
          해당 실적 {targetSalesRows.length}건에 연결됩니다.
        </label>
        <div
          className={dropzoneClass}
          onDragOver={(e) => { e.preventDefault(); if (canUploadImages) setIsDrag(true); }}
          onDragLeave={() => setIsDrag(false)}
          onDrop={onDrop}
          onClick={() => canUploadImages && document.getElementById('rx-input')?.click()}
          role="button"
          aria-disabled={!canUploadImages}
          tabIndex={canUploadImages ? 0 : undefined}
        >
          <input
            id="rx-input"
            type="file"
            accept="image/*"
            multiple
            disabled={!canUploadImages}
            onChange={onFileInput}
            className={s.fileInputHidden}
          />
          {canUploadImages
            ? '이미지를 여기에 놓거나 클릭하여 선택하세요'
            : '먼저 위에서 처방월과 병의원을 선택하세요.'}
        </div>
        {previewUrls.length > 0 && (
          <div className={s.previewGrid}>
            {previewUrls.map((url, i) => (
              <div key={url} className={s.previewItemWrap}>
                <img src={url} alt={`처방 ${i + 1}`} />
                <Button
                  variant="ghost"
                  size="icon"
                  className={s.removeImageBtn}
                  onClick={(e) => { e.stopPropagation(); removeImageAt(i); }}
                  aria-label={`이미지 ${i + 1} 삭제`}
                >
                  <HiOutlineX size={18} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      {message && <div className={s.success}>{message}</div>}

      <Button variant="primary" className={s.buttonWrap} onClick={submitUpload} disabled={!canUploadImages || files.length === 0}>
        처방사진 등록
      </Button>
    </div>
  );
}
