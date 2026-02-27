/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { HiOutlineX } from 'react-icons/hi';
import { useApp } from '@/context/AppContext';
import type { PrescriptionUpload } from '@/types';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { color: theme.colors.textMuted, marginBottom: theme.spacing(4) },
});

const selectCardStyles = css({
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadow.sm,
});

const selectRowStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: theme.spacing(4),
  alignItems: 'flex-start',
});

const fieldStyles = css({
  '& label': {
    display: 'block',
    marginBottom: theme.spacing(2),
    fontWeight: 600,
    fontSize: 15,
    color: theme.colors.text,
  },
  '& select': {
    display: 'block',
    width: '100%',
    minHeight: 48,
    padding: `0 ${theme.spacing(3)}px`,
    fontSize: 15,
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    paddingRight: 36,
    '&:hover': { borderColor: theme.colors.primary },
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.primary,
      boxShadow: `0 0 0 3px ${theme.colors.primary}20`,
    },
  },
  '& .field-hint': {
    marginTop: theme.spacing(1),
    fontSize: 13,
    color: theme.colors.textMuted,
  },
});

const dropzoneStyles = (isDrag: boolean, disabled: boolean) =>
  css({
    border: `2px dashed ${disabled ? theme.colors.border : isDrag ? theme.colors.primary : theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(6),
    textAlign: 'center',
    backgroundColor: disabled ? theme.colors.background : isDrag ? `${theme.colors.primary}08` : theme.colors.surface,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.7 : 1,
    transition: 'background-color 0.2s, border-color 0.2s',
    ...(!disabled && {
      '&:hover': { borderColor: theme.colors.primary, backgroundColor: `${theme.colors.primary}08` },
    }),
  });

const previewGrid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  '& img': { width: '100%', height: 120, objectFit: 'cover', borderRadius: theme.radius.sm },
});

const previewItemWrap = css({
  position: 'relative',
  '& img': { display: 'block', width: '100%', height: 120, objectFit: 'cover', borderRadius: theme.radius.sm },
});

const removeImageBtn = css({
  position: 'absolute',
  top: 4,
  right: 4,
  width: 24,
  height: 24,
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  backgroundColor: theme.colors.overlayStrong,
  color: theme.colors.buttonText,
  fontSize: 16,
  lineHeight: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:hover': { backgroundColor: theme.colors.error },
  '&:focus': { outline: 'none' },
});

const buttonStyles = css({
  marginTop: theme.spacing(3),
});

const successStyles = css({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: `${theme.colors.success}14`,
  color: theme.colors.success,
  borderRadius: theme.radius.md,
});

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
  const { userRole, currentCorporationId, hospitals, salesRows, addPrescriptionUpload } = useApp();
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
      imageUrls: previewUrls.slice(), // 실제 구현에서는 서버 업로드 후 URL 반영
      uploadedAt: new Date().toISOString(),
      settlementMonth,
    };
    addPrescriptionUpload(upload);
    setMessage(`처방 사진 ${files.length}장이 업로드되었습니다. (${hospitalId ? '병의원별' : '전체'})`);
    clearPreviews();
  }, [files.length, targetSalesRows, currentCorporationId, hospitalId, settlementMonth, previewUrls, addPrescriptionUpload, clearPreviews]);

  if (userRole === 'pharma') return <Navigate to="/" replace />;

  return (
    <div css={pageStyles}>
      <h1>처방사진 업로드</h1>
      <p>대상(월 · 병의원)을 선택한 뒤, 해당 실적에 대한 처방 사진을 업로드합니다.</p>

      <section css={selectCardStyles}>
        <h2 css={css({ fontSize: 16, fontWeight: 600, marginBottom: theme.spacing(3), color: theme.colors.text })}>
          1. 대상 선택
        </h2>
        <div css={selectRowStyles}>
          <div css={fieldStyles}>
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
          <div css={fieldStyles}>
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
        <p css={css({ marginTop: theme.spacing(2), fontSize: 14, color: theme.colors.textMuted })}>
          해당 조건의 실적: <strong css={css({ color: theme.colors.text })}>{targetSalesRows.length}건</strong>
        </p>
      </section>

      <section css={css({ marginBottom: theme.spacing(4) })}>
        <h2 css={css({ fontSize: 16, fontWeight: 600, marginBottom: theme.spacing(2), color: theme.colors.text })}>
          2. 처방 사진 업로드
        </h2>
        <label htmlFor="rx-input" css={css({ display: 'block', marginBottom: theme.spacing(1), fontSize: 15, color: theme.colors.textMuted })}>
          해당 실적 {targetSalesRows.length}건에 연결됩니다.
        </label>
        <div
          css={dropzoneStyles(isDrag, !canUploadImages)}
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
            css={css({ display: 'none' })}
          />
          {canUploadImages
            ? '이미지를 여기에 놓거나 클릭하여 선택하세요'
            : '먼저 위에서 처방월과 병의원을 선택하세요.'}
        </div>
        {previewUrls.length > 0 && (
          <div css={previewGrid}>
            {previewUrls.map((url, i) => (
              <div key={url} css={previewItemWrap}>
                <img src={url} alt={`처방 ${i + 1}`} />
                <Button
                  variant="ghost"
                  size="icon"
                  css={removeImageBtn}
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

      {message && <div css={successStyles}>{message}</div>}

      <Button variant="primary" css={buttonStyles} onClick={submitUpload} disabled={!canUploadImages || files.length === 0}>
        처방사진 등록
      </Button>
    </div>
  );
}
