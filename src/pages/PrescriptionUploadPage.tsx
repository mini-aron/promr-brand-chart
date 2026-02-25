/** @jsxImportSource @emotion/react */
import { useCallback, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { useApp } from '@/context/AppContext';
import type { PrescriptionUpload } from '@/types';
import { theme } from '@/theme';

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

const dropzoneStyles = (isDrag: boolean) =>
  css({
    border: `2px dashed ${isDrag ? theme.colors.primary : theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(6),
    textAlign: 'center',
    backgroundColor: isDrag ? `${theme.colors.primary}08` : theme.colors.surface,
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
    '&:hover': { borderColor: theme.colors.primary, backgroundColor: `${theme.colors.primary}08` },
  });

const previewGrid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  '& img': { width: '100%', height: 120, objectFit: 'cover', borderRadius: theme.radius.sm },
});

const buttonStyles = css({
  marginTop: theme.spacing(3),
  padding: `${theme.buttonPadding.y}px ${theme.buttonPadding.x * 1.5}px`,
  backgroundColor: theme.colors.primary,
  color: 'white',
  border: 'none',
  borderRadius: theme.radius.md,
  cursor: 'pointer',
  fontWeight: 600,
  '&:hover': { backgroundColor: theme.colors.primaryHover },
  '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
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
    const items = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (items.length === 0) return;
    setFiles((prev) => [...prev, ...items]);
    setPreviewUrls((prev) => [...prev, ...items.map((f) => URL.createObjectURL(f))]);
  }, []);

  const onFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const items = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith('image/'));
    if (items.length === 0) return;
    setFiles((prev) => [...prev, ...items]);
    setPreviewUrls((prev) => [...prev, ...items.map((f) => URL.createObjectURL(f))]);
    e.target.value = '';
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
          css={dropzoneStyles(isDrag)}
          onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
          onDragLeave={() => setIsDrag(false)}
          onDrop={onDrop}
          onClick={() => document.getElementById('rx-input')?.click()}
        >
          <input
            id="rx-input"
            type="file"
            accept="image/*"
            multiple
            onChange={onFileInput}
            css={css({ display: 'none' })}
          />
          이미지를 여기에 놓거나 클릭하여 선택하세요
        </div>
        {previewUrls.length > 0 && (
          <div css={previewGrid}>
            {previewUrls.map((url, i) => (
              <img key={url} src={url} alt={`처방 ${i + 1}`} />
            ))}
          </div>
        )}
      </section>

      {message && <div css={successStyles}>{message}</div>}

      <button
        type="button"
        css={buttonStyles}
        onClick={submitUpload}
        disabled={files.length === 0}
      >
        처방사진 등록
      </button>
    </div>
  );
}
