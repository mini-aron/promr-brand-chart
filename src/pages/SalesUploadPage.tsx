/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import * as XLSX from 'xlsx';
import { useApp } from '@/context/AppContext';
import { mockProductFees } from '@/store/mockData';
import type { SalesRow, Hospital } from '@/types';
import { theme } from '@/theme';

/** 엑셀 양식 다운로드 */
function downloadExcelTemplate() {
  const wb = XLSX.utils.book_new();
  const headers = ['병원', '제품명', '수량', '금액'];
  const ws = XLSX.utils.aoa_to_sheet([headers]);
  XLSX.utils.book_append_sheet(wb, ws, '실적');
  XLSX.writeFile(wb, '실적_업로드_양식.xlsx');
}

/** 품목 다운로드 */
function downloadProductFees() {
  const wb = XLSX.utils.book_new();
  const rows = [
    ['품목코드', '품목명', '수수료율(%)'],
    ...mockProductFees.map((p) => [p.productCode, p.productName, p.feeRate]),
  ];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, '품목');
  XLSX.writeFile(wb, '품목.xlsx');
}

/** 거래처 다운로드 (해당 법인 소속 거래처만) */
function downloadHospitalCodes(hospitals: { id: string; name: string }[]) {
  const wb = XLSX.utils.book_new();
  const rows = [['거래처코드', '거래처명'], ...hospitals.map((h) => [h.id, h.name])];
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, '거래처');
  XLSX.writeFile(wb, '거래처.xlsx');
}

/** 더미데이터 다운로드 (업로드 테스트용, 양식과 동일 컬럼) */
function downloadDummyExcel(hospitals: { id: string; name: string }[], productNames: string[]) {
  const headers = ['병원', '제품명', '수량', '금액'];
  const rows: (string | number)[][] = [headers];
  const hospitalNames = hospitals.map((h) => h.name);
  if (hospitalNames.length === 0 || productNames.length === 0) return;
  for (let i = 0; i < 15; i++) {
    const hospital = hospitalNames[i % hospitalNames.length];
    const product = productNames[i % productNames.length];
    const quantity = 5 + (i % 20);
    const amount = quantity * (40000 + (i % 10) * 3000);
    rows.push([hospital, product, quantity, amount]);
  }
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(rows);
  XLSX.utils.book_append_sheet(wb, ws, '실적');
  XLSX.writeFile(wb, '실적_더미데이터.xlsx');
}

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { color: theme.colors.textMuted, marginBottom: theme.spacing(4) },
});

const dropzoneStyles = (isDrag: boolean) =>
  css({
    border: `2px dashed ${isDrag ? theme.colors.primary : theme.colors.border}`,
    borderRadius: theme.radius.lg,
    padding: theme.spacing(8),
    textAlign: 'center',
    backgroundColor: isDrag ? `${theme.colors.primary}08` : theme.colors.surface,
    cursor: 'pointer',
    transition: 'background-color 0.2s, border-color 0.2s',
    '&:hover': { borderColor: theme.colors.primary, backgroundColor: `${theme.colors.primary}08` },
  });

const tableWrapStyles = css({
  marginTop: theme.spacing(4),
  overflow: 'auto',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  fontSize: 12,
  '& table': { width: '100%', borderCollapse: 'collapse' },
  '& th, & td': {
    padding: theme.spacing(1.5),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
    borderRight: `1px solid ${theme.colors.border}`,
  },
  '& th:last-child, & td:last-child': { borderRight: 'none' },
  '& th': { backgroundColor: theme.colors.background, fontWeight: 600 },
  '& .col-num': { textAlign: 'right' },
  '& tfoot tr': {
    fontWeight: 700,
    borderTop: `2px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.background,
  },
  '& tfoot td': { padding: theme.spacing(2) },
});

const separatorRowStyles = css({
  '& td': {
    borderBottom: `2px solid ${theme.colors.border}`,
    padding: theme.spacing(1),
    backgroundColor: theme.colors.background,
  },
});

const fileSumRowStyles = css({
  '& td': {
    borderBottom: `2px solid ${theme.colors.border}`,
    padding: theme.spacing(2),
    backgroundColor: theme.colors.background,
    fontWeight: 600,
    fontSize: 13,
  },
  '& .col-num': { textAlign: 'right' },
});

const uploadedFilesRowStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
  alignItems: 'center',
  '& .file-chip': {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    fontSize: 13,
    backgroundColor: theme.colors.background,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    maxWidth: 220,
    '& .name': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
    '& button': {
      flexShrink: 0,
      width: 22,
      height: 22,
      padding: 0,
      border: 'none',
      borderRadius: '50%',
      backgroundColor: theme.colors.border,
      color: theme.colors.text,
      cursor: 'pointer',
      fontSize: 14,
      lineHeight: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&:hover': { backgroundColor: theme.colors.error, color: 'white' },
    },
  },
});

const successStyles = css({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: `${theme.colors.success}14`,
  color: theme.colors.success,
  borderRadius: theme.radius.md,
});

const errorStyles = css({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: `${theme.colors.error}14`,
  color: theme.colors.error,
  borderRadius: theme.radius.md,
});

const downloadRowStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  '& button': {
    padding: `${theme.buttonPadding.y}px ${theme.buttonPadding.x}px`,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.surface,
    cursor: 'pointer',
    fontWeight: 500,
    '&:hover': { backgroundColor: theme.colors.background },
  },
});

/** 엑셀 컬럼 매핑 (실제 시트 컬럼명에 맞게 수정 가능) */
const COLUMNS = {
  hospital: ['병원', '병의원', '병원명', 'hospital'],
  product: ['제품', '품목', '제품명', 'product'],
  quantity: ['수량', 'quantity', 'qty'],
  amount: ['금액', '매출', 'amount', 'sales'],
} as const;

function findColumnKey(row: Record<string, unknown>, keys: readonly string[]): string | null {
  const header = Object.keys(row).find((k) => keys.some((key) => String(k).trim() === key || String(k).toLowerCase() === key.toLowerCase()));
  return header ?? null;
}

function parseExcelToSalesRows(
  file: File,
  corporationId: string,
  hospitals: Hospital[]
): Promise<{ rows: SalesRow[]; error?: string }> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data || typeof data !== 'object') {
          resolve({ rows: [], error: '파일을 읽을 수 없습니다.' });
          return;
        }
        const wb = XLSX.read(data, { type: 'array' });
        const firstSheet = wb.SheetNames[0];
        const sheet = wb.Sheets[firstSheet];
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);
        if (json.length === 0) {
          resolve({ rows: [], error: '시트에 데이터가 없습니다.' });
          return;
        }
        const first = json[0];
        const hospitalKey = findColumnKey(first, COLUMNS.hospital);
        const productKey = findColumnKey(first, COLUMNS.product);
        const quantityKey = findColumnKey(first, COLUMNS.quantity);
        const amountKey = findColumnKey(first, COLUMNS.amount);
        if (!hospitalKey || !productKey) {
          resolve({
            rows: [],
            error: '필수 컬럼을 찾을 수 없습니다. (병원명, 제품명 등)',
          });
          return;
        }
        const hospitalByName = new Map(hospitals.map((h) => [h.name, h]));
        const now = new Date().toISOString();
        const rows: SalesRow[] = [];
        for (let i = 0; i < json.length; i++) {
          const r = json[i];
          const hospitalName = String(r[hospitalKey] ?? '').trim();
          const productName = String(r[productKey] ?? '').trim();
          const q = quantityKey ? r[quantityKey] : undefined;
          const a = amountKey ? r[amountKey] : undefined;
          const quantity = typeof q === 'number' ? q : Number(q) || 0;
          const amount = typeof a === 'number' ? a : Number(String(a).replace(/,/g, '')) || 0;
          const hospital = hospitalByName.get(hospitalName);
          const hospitalId = hospital?.id ?? `unknown-${hospitalName}`;
          rows.push({
            id: `s-${Date.now()}-${i}`,
            corporationId,
            hospitalId,
            productName,
            quantity,
            amount,
            uploadedAt: now,
          });
        }
        resolve({ rows });
      } catch (err) {
        resolve({ rows: [], error: err instanceof Error ? err.message : '파싱 오류' });
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

export function SalesUploadPage() {
  const { userRole, currentCorporationId, hospitals, addSalesRows } = useApp();
  const corporationHospitals = hospitals.filter((h) => h.corporationId === currentCorporationId);
  const [isDrag, setIsDrag] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ fileName: string; rows: SalesRow[] }[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const previewSectionRef = useRef<HTMLDivElement>(null);

  const { preview, separatorAfterIndices, totals, fileTotals, showFileSums } = useMemo(() => {
    const allRows: SalesRow[] = [];
    const separators: number[] = [];
    uploadedFiles.forEach((f) => {
      f.rows.forEach((r) => allRows.push(r));
      if (f.rows.length > 0) separators.push(allRows.length - 1);
    });
    const totalQuantity = allRows.reduce((s, r) => s + r.quantity, 0);
    const totalAmount = allRows.reduce((s, r) => s + r.amount, 0);
    const fileTotalsList = uploadedFiles.map((f) => ({
      fileName: f.fileName,
      totalQuantity: f.rows.reduce((s, r) => s + r.quantity, 0),
      totalAmount: f.rows.reduce((s, r) => s + r.amount, 0),
    }));
    return {
      preview: allRows,
      separatorAfterIndices: separators.slice(0, -1),
      totals: { totalQuantity, totalAmount },
      fileTotals: fileTotalsList,
      showFileSums: uploadedFiles.length > 1,
    };
  }, [uploadedFiles]);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileList = Array.from(files).filter((f) => f.name.match(/\.(xlsx|xls)$/i));
      if (fileList.length === 0) {
        setMessage({ type: 'error', text: '엑셀 파일(.xlsx, .xls)만 업로드 가능합니다.' });
        return;
      }
      setMessage(null);
      const next: { fileName: string; rows: SalesRow[] }[] = [];
      const now = Date.now();
      for (let fi = 0; fi < fileList.length; fi++) {
        const file = fileList[fi];
        const { rows, error } = await parseExcelToSalesRows(file, currentCorporationId, hospitals);
        if (error) {
          setMessage({ type: 'error', text: `"${file.name}": ${error}` });
          setUploadedFiles([]);
          return;
        }
        const rowsWithId = rows.map((r, ri) => ({ ...r, id: `s-${now}-${fi}-${ri}` }));
        next.push({ fileName: file.name, rows: rowsWithId });
      }
      setUploadedFiles(next);
      setTimeout(() => previewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    },
    [currentCorporationId, hospitals]
  );

  const removeFileAt = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDrag(false);
      const files = e.dataTransfer.files;
      if (files?.length) handleFiles(files);
    },
    [handleFiles]
  );

  const onFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files?.length) handleFiles(files);
      e.target.value = '';
    },
    [handleFiles]
  );

  const doRegister = useCallback(() => {
    if (!preview?.length) return;
    addSalesRows(preview);
    setMessage({ type: 'success', text: `${preview.length}건의 실적이 업로드되었습니다.` });
    setUploadedFiles([]);
    setShowConfirmModal(false);
  }, [preview, addSalesRows]);

  const openConfirmModal = useCallback(() => {
    if (preview?.length) setShowConfirmModal(true);
  }, [preview?.length]);

  const hospitalName = (id: string) => hospitals.find((h) => h.id === id)?.name ?? id;

  if (userRole === 'pharma') return <Navigate to="/" replace />;

  return (
    <div css={pageStyles}>
      <h1>실적 업로드</h1>
      <p>엑셀 파일을 업로드하여 판매 실적을 등록합니다. (일반 실적은 병의원·월 구분 없이 등록됩니다.)</p>

      <div css={downloadRowStyles}>
        <button type="button" onClick={downloadExcelTemplate}>
          엑셀 양식 다운로드
        </button>
        <button type="button" onClick={downloadProductFees}>
          품목 다운로드
        </button>
        <button
          type="button"
          onClick={() => downloadHospitalCodes(corporationHospitals)}
        >
          거래처 다운로드
        </button>
        <button
          type="button"
          onClick={() => downloadDummyExcel(corporationHospitals, mockProductFees.map((p) => p.productName))}
        >
          더미데이터 다운로드
        </button>
      </div>

      <h2 css={css({ fontSize: 16, marginBottom: theme.spacing(2), color: theme.colors.text })}>
        1. 엑셀 업로드
      </h2>
      <div
        css={dropzoneStyles(isDrag)}
        onDragOver={(e) => { e.preventDefault(); setIsDrag(true); }}
        onDragLeave={() => setIsDrag(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById('excel-input')?.click()}
      >
        <input
          id="excel-input"
          type="file"
          accept=".xlsx,.xls"
          multiple
          onChange={onFileInput}
          css={css({ display: 'none' })}
        />
        엑셀 파일을 여기에 놓거나 클릭하여 선택하세요 (.xlsx, .xls) — 여러 개 선택 가능
      </div>

      {uploadedFiles.length > 0 && (
        <div css={uploadedFilesRowStyles}>
          <span css={css({ fontSize: 13, color: theme.colors.textMuted, marginRight: theme.spacing(1) })}>
            업로드된 파일:
          </span>
          {uploadedFiles.map((f, i) => (
            <span key={`${f.fileName}-${i}`} className="file-chip">
              <span className="name" title={f.fileName}>{f.fileName}</span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeFileAt(i); }}
                aria-label={`${f.fileName} 제거`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      {message && (
        <div css={message.type === 'success' ? successStyles : errorStyles}>{message.text}</div>
      )}

      {preview.length > 0 && (
        <div
          ref={previewSectionRef}
          css={css({
            marginTop: theme.spacing(4),
            padding: theme.spacing(4),
            backgroundColor: theme.colors.surface,
            border: `2px solid ${theme.colors.primary}30`,
            borderRadius: theme.radius.lg,
            boxShadow: theme.shadow.md,
          })}
        >
          <h2 css={css({ fontSize: 18, marginBottom: theme.spacing(1), color: theme.colors.text })}>
            2. 업로드 결과 확인
          </h2>
          <p css={css({ color: theme.colors.textMuted, marginBottom: theme.spacing(3), fontSize: 14 })}>
            아래 표의 데이터가 맞는지 확인한 뒤 <strong>실적 등록</strong> 버튼을 클릭하세요.
          </p>
          <div css={tableWrapStyles}>
            <table>
              <thead>
                <tr>
                  <th>병의원</th>
                  <th>제품명</th>
                  <th className="col-num">수량</th>
                  <th className="col-num">금액</th>
                </tr>
              </thead>
              <tbody>
                {preview.flatMap((r, i) => {
                  const row = (
                    <tr key={r.id}>
                      <td>{hospitalName(r.hospitalId)}</td>
                      <td>{r.productName}</td>
                      <td className="col-num">{r.quantity}</td>
                      <td className="col-num">{r.amount.toLocaleString()}</td>
                    </tr>
                  );
                  const sep = separatorAfterIndices.includes(i) ? (
                    showFileSums ? (
                      (() => {
                        const fileIndex = separatorAfterIndices.indexOf(i);
                        const ft = fileTotals[fileIndex];
                        return ft ? (
                          <tr key={`sum-${i}`} css={fileSumRowStyles}>
                            <td colSpan={2}>
                              {ft.fileName} 합계
                            </td>
                            <td className="col-num">{ft.totalQuantity.toLocaleString()}</td>
                            <td className="col-num">{ft.totalAmount.toLocaleString()}</td>
                          </tr>
                        ) : (
                          <tr key={`sep-${i}`} css={separatorRowStyles}>
                            <td colSpan={4} />
                          </tr>
                        );
                      })()
                    ) : (
                      <tr key={`sep-${i}`} css={separatorRowStyles}>
                        <td colSpan={4} />
                      </tr>
                    )
                  ) : null;
                  return sep ? [row, sep] : [row];
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2}>합계</td>
                  <td className="col-num">{totals.totalQuantity.toLocaleString()}</td>
                  <td className="col-num">{totals.totalAmount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <button
            type="button"
            onClick={openConfirmModal}
            css={css({
              marginTop: theme.spacing(2),
              padding: `${theme.buttonPadding.y}px ${theme.buttonPadding.x * 1.5}px`,
              backgroundColor: theme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: theme.radius.md,
              cursor: 'pointer',
              fontWeight: 600,
              '&:hover': { backgroundColor: theme.colors.primaryHover },
            })}
          >
            실적 등록
          </button>
        </div>
      )}

      {showConfirmModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          css={css({
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          })}
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            css={css({
              backgroundColor: theme.colors.surface,
              padding: theme.spacing(4),
              borderRadius: theme.radius.lg,
              boxShadow: theme.shadow.md,
              minWidth: 320,
            })}
            onClick={(e) => e.stopPropagation()}
          >
            <p id="confirm-title" css={css({ marginBottom: theme.spacing(3), fontWeight: 600, color: theme.colors.text })}>
              정말로 등록하시겠습니까?
            </p>
            <div css={css({ display: 'flex', gap: theme.spacing(2), justifyContent: 'flex-end' })}>
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                css={css({
                  padding: `${theme.buttonPadding.y}px ${theme.spacing(3)}px`,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radius.md,
                  backgroundColor: theme.colors.surface,
                  cursor: 'pointer',
                  fontWeight: 500,
                })}
              >
                아니오
              </button>
              <button
                type="button"
                onClick={doRegister}
                css={css({
                  padding: `${theme.buttonPadding.y}px ${theme.spacing(3)}px`,
                  border: 'none',
                  borderRadius: theme.radius.md,
                  backgroundColor: theme.colors.primary,
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  '&:hover': { backgroundColor: theme.colors.primaryHover },
                })}
              >
                네
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
