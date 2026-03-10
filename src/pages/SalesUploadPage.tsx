/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useRef, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { css } from '@emotion/react';
import { useApp } from '@/context/AppContext';
import { mockProductFees } from '@/store/mockData';
import type { SalesRow } from '@/types';
import { HiOutlineX } from 'react-icons/hi';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';
import { Flex, Row } from '@/components/Common/Flex';
import { SingleSelect } from '@/components/Common/Select';
import { parseExcelToSalesRows } from '@/utils/salesUploadExcelParser';
import { downloadRowsAsExcel } from '@/utils/salesUploadExcelDownload';
import { tableWrap } from '@/style/TableStyles';

const EXCEL_TEMPLATE_HEADERS = ['병원', '사업자번호', '제품명', '제품코드', '수량', '금액'];
const VALID_PRODUCT_CODES = ['P001', 'P002', 'P003', 'P004', 'P005', 'P006', 'P007', 'P008', 'P009'];
const INVALID_PRODUCT_CODES = ['P999', 'INVALID', 'X001', 'BAD123'];

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2) },
  '& p': { marginBottom: theme.spacing(4) },
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

const salesTableWrap = css(tableWrap, {
  marginTop: theme.spacing(4),
  '& .col-num': { textAlign: 'right' },
  '& tfoot tr': {
    fontWeight: 700,
    borderTop: `2px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.background,
  },
  '& tfoot td': { padding: theme.spacing(2) },
  '& td input, & td select': {
    padding: `${theme.spacing(1)}px ${theme.spacing(1.5)}px`,
    fontSize: 12,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.surface,
    boxSizing: 'border-box',
    '&:focus': { outline: 'none', borderColor: theme.colors.primary },
  },
  '& td input[type="text"]': { width: '100%', minWidth: 80 },
  '& td select': { 
    width: '100%', 
    minWidth: 120,
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    paddingRight: 28,
  },
  '& td input[type="number"]': {
    width: 56,
    minWidth: 56,
    textAlign: 'right',
  },
  '& td[data-invalid="true"]': {
    outline: `2px solid ${theme.colors.error}`,
    outlineOffset: -2,
    backgroundColor: `${theme.colors.error}14`,
  },
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

const uploadedFilesWrap = css({
  marginTop: theme.spacing(2),
  '& .file-chip': {
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
      '&:hover': { backgroundColor: theme.colors.error, color: theme.colors.buttonText },
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

const downloadRowWrap = css({
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

/** 적용 월 옵션 (최근 12개월) */
function getMonthOptions(): { label: string; value: string }[] {
  const list: { label: string; value: string }[] = [];
  const d = new Date();
  for (let i = 0; i < 12; i++) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    list.push({ label: `${y}년 ${Number(m)}월`, value: `${y}-${m}` });
    d.setMonth(d.getMonth() - 1);
  }
  return list;
}

export function SalesUploadPage() {
  const { userRole, currentCorporationId, currentPharmaId, pharmas, hospitals, salesRows, addSalesRows } = useApp();
  const corporationHospitals = hospitals.filter((h) => h.corporationId === currentCorporationId);
  const [settlementMonth, setSettlementMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [isDrag, setIsDrag] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{ fileName: string; rows: SalesRow[] }[]>([]);
  const [editedOverrides, setEditedOverrides] = useState<Record<string, { quantity?: number; productName?: string; hospitalId?: string }>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const previewSectionRef = useRef<HTMLDivElement>(null);

  const validProductCodes = useMemo(() => new Set(mockProductFees.map((p) => p.productCode)), []);
  const validBusinessNumbers = useMemo(
    () => new Set(corporationHospitals.map((h) => h.businessNumber).filter(Boolean)),
    [corporationHospitals]
  );

  const { preview, separatorAfterIndices, showFileSums } = useMemo(() => {
    const allRows: SalesRow[] = [];
    const separators: number[] = [];
    uploadedFiles.forEach((f) => {
      f.rows.forEach((r) => allRows.push(r));
      if (f.rows.length > 0) separators.push(allRows.length - 1);
    });
    return {
      preview: allRows,
      separatorAfterIndices: separators.slice(0, -1),
      showFileSums: uploadedFiles.length > 1,
    };
  }, [uploadedFiles]);

  const effectiveRows = useMemo(
    () =>
      preview.map((r) => ({
        ...r,
        quantity: editedOverrides[r.id]?.quantity ?? r.quantity,
        productName: editedOverrides[r.id]?.productName ?? r.productName,
        hospitalId: editedOverrides[r.id]?.hospitalId ?? r.hospitalId,
      })),
    [preview, editedOverrides]
  );

  const { totals, fileTotals } = useMemo(() => {
    const totalQuantity = effectiveRows.reduce((s, r) => s + r.quantity, 0);
    const totalAmount = effectiveRows.reduce((s, r) => s + r.amount, 0);
    let idx = 0;
    const fileTotalsList = uploadedFiles.map((f) => {
      const rows = effectiveRows.slice(idx, idx + f.rows.length);
      idx += f.rows.length;
      return {
        fileName: f.fileName,
        totalQuantity: rows.reduce((s, r) => s + r.quantity, 0),
        totalAmount: rows.reduce((s, r) => s + r.amount, 0),
      };
    });
    return {
      totals: { totalQuantity, totalAmount },
      fileTotals: fileTotalsList,
    };
  }, [effectiveRows, uploadedFiles]);

  const invalidProductCodeCount = useMemo(() => {
    return preview.filter((r) => r.productCode && !validProductCodes.has(r.productCode)).length;
  }, [preview, validProductCodes]);

  const invalidHospitalCount = useMemo(() => {
    return preview.filter(
      (r) => r.businessNumber && r.businessNumber.trim() !== '' && !validBusinessNumbers.has(r.businessNumber)
    ).length;
  }, [preview, validBusinessNumbers]);

  const setRowEdit = useCallback((rowId: string, field: 'quantity' | 'productName' | 'hospitalId', value: number | string) => {
    setEditedOverrides((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: field === 'quantity' ? (value as number) : (value as string),
      },
    }));
  }, []);

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
      setEditedOverrides({});
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

  const prevMonth = useMemo(() => {
    const [y, m] = settlementMonth.split('-').map(Number);
    const d = new Date(y, m - 2, 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }, [settlementMonth]);

  const handleLoadPreviousMonth = useCallback(() => {
    const prevRows = salesRows.filter(
      (r) =>
        r.corporationId === currentCorporationId &&
        r.pharmaId === currentPharmaId &&
        r.settlementMonth === prevMonth
    );
    if (prevRows.length === 0) {
      setMessage({ type: 'error', text: `전월(${prevMonth})에 등록된 실적이 없습니다.` });
      return;
    }
    setMessage(null);
    const now = Date.now();
    const rowsWithNewId = prevRows.map((r, i) => ({
      ...r,
      id: `s-${now}-load-${i}`,
    }));
    setUploadedFiles([{ fileName: `전월(${prevMonth}) 불러옴`, rows: rowsWithNewId }]);
    setEditedOverrides({});
    setTimeout(() => previewSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }, [salesRows, currentCorporationId, currentPharmaId, prevMonth]);

  const doRegister = useCallback(() => {
    if (!effectiveRows.length || !currentPharmaId) return;
    addSalesRows(
      effectiveRows.map((r) => ({
        ...r,
        pharmaId: currentPharmaId,
        settlementMonth,
      }))
    );
    setMessage({ type: 'success', text: `${effectiveRows.length}건의 실적이 업로드되었습니다.` });
    setUploadedFiles([]);
    setEditedOverrides({});
    setShowConfirmModal(false);
  }, [effectiveRows, currentPharmaId, settlementMonth, addSalesRows]);

  const openConfirmModal = useCallback(() => {
    if (preview?.length) setShowConfirmModal(true);
  }, [preview?.length]);

  const handleDownloadExcelTemplate = useCallback(() => {
    downloadRowsAsExcel('실적_업로드_양식.xlsx', '실적', [EXCEL_TEMPLATE_HEADERS]);
  }, []);

  const handleDownloadProductFees = useCallback(() => {
    const rows: (string | number)[][] = [
      ['품목코드', '품목명', '수수료율(%)'],
      ...mockProductFees.map((p) => [p.productCode, p.productName, p.feeRate]),
    ];
    downloadRowsAsExcel('품목.xlsx', '품목', rows);
  }, []);

  const handleDownloadHospitalCodes = useCallback(() => {
    const rows: (string | number)[][] = [
      ['거래처코드', '거래처명'],
      ...corporationHospitals.map((h) => [h.id, h.name]),
    ];
    downloadRowsAsExcel('거래처.xlsx', '거래처', rows);
  }, [corporationHospitals]);

  const handleDownloadDummyExcel = useCallback(() => {
    const hospitalList = corporationHospitals.map((h) => ({ name: h.name, businessNumber: h.businessNumber }));
    const productNames = mockProductFees.map((p) => p.productName);
    if (hospitalList.length === 0 || productNames.length === 0) return;

    const rows: (string | number)[][] = [EXCEL_TEMPLATE_HEADERS];
    const wrongHospital = { name: '존재하지않는병원', businessNumber: '000-00-00000' };
    for (let i = 0; i < 15; i++) {
      const hospital = i === 5 ? wrongHospital : hospitalList[i % hospitalList.length];
      const product = productNames[i % productNames.length];
      const productCode =
        i === 3 || i === 7 || i === 12
          ? INVALID_PRODUCT_CODES[i % INVALID_PRODUCT_CODES.length]
          : VALID_PRODUCT_CODES[i % VALID_PRODUCT_CODES.length];
      const quantity = 5 + (i % 20);
      const amount = quantity * (40000 + (i % 10) * 3000);
      rows.push([hospital.name, hospital.businessNumber || '', product, productCode, quantity, amount]);
    }
    downloadRowsAsExcel('실적_더미데이터.xlsx', '실적', rows);
  }, [corporationHospitals]);

  if (userRole === 'corporation' && pharmas.length > 0 && !currentPharmaId) {
    return <Navigate to="/upload" replace />;
  }

  return (
    <div css={pageStyles}>
      <p>
        <Link to="/upload" css={css({ color: theme.colors.primary, fontWeight: 600 })}>
          ← 실적 등록으로 돌아가기
        </Link>
      </p>
      <h1>실적 업로드</h1>
      <p>엑셀 파일을 업로드하여 판매 실적을 등록합니다.</p>

      <Row wrap="wrap" gap={theme.spacing(3)} alignItems="flex-end" css={css({ marginBottom: theme.spacing(4) })}>
        <div css={css({ '& label': { display: 'block', marginBottom: theme.spacing(1), fontSize: 13, fontWeight: 600 } })}>
          <label htmlFor="settlement-month">적용 월</label>
          <SingleSelect
            id="settlement-month"
            options={getMonthOptions()}
            selected={settlementMonth}
            onChange={(v) => setSettlementMonth(String(v))}
            placeholder="월 선택"
            aria-label="적용 월"
          />
        </div>
        <Button variant="secondary" onClick={handleLoadPreviousMonth}>
          전월 불러오기
        </Button>
      </Row>

      <Row wrap="wrap" gap={theme.spacing(2)} css={downloadRowWrap}>
        <Button variant="secondary" onClick={handleDownloadExcelTemplate}>
          엑셀 양식 다운로드
        </Button>
        <Button variant="secondary" onClick={handleDownloadProductFees}>
          품목 다운로드
        </Button>
        <Button variant="secondary" onClick={handleDownloadHospitalCodes}>
          거래처 다운로드
        </Button>
        <Button variant="secondary" onClick={handleDownloadDummyExcel}>
          더미데이터 다운로드
        </Button>
      </Row>

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
        <Row wrap="wrap" gap={theme.spacing(2)} alignItems="center" css={uploadedFilesWrap}>
          <span css={css({ fontSize: 13, color: theme.colors.textMuted, marginRight: theme.spacing(1) })}>
            업로드된 파일:
          </span>
          {uploadedFiles.map((f, i) => (
            <span key={`${f.fileName}-${i}`} className="file-chip">
              <span className="name" title={f.fileName}>{f.fileName}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => { e.stopPropagation(); removeFileAt(i); }}
                aria-label={`${f.fileName} 제거`}
              >
                <HiOutlineX size={18} />
              </Button>
            </span>
          ))}
        </Row>
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
          {(invalidHospitalCount > 0 || invalidProductCodeCount > 0) && (
            <div css={css({
              padding: theme.spacing(2),
              marginBottom: theme.spacing(3),
              backgroundColor: `${theme.colors.error}14`,
              color: theme.colors.error,
              borderRadius: theme.radius.md,
              fontSize: 14,
              fontWeight: 500,
            })}>
              ⚠
              {invalidHospitalCount > 0 && ` ${invalidHospitalCount}건의 병의원 사업자번호가 등록된 거래처와 일치하지 않습니다. 병의원 셀을 확인하세요.`}
              {invalidProductCodeCount > 0 && ` ${invalidProductCodeCount}건의 제품코드가 품목 마스터에 없습니다. 제품코드 셀을 확인하세요.`}
            </div>
          )}
          <div css={salesTableWrap}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: 50, textAlign: 'center' }}>#</th>
                  <th>병의원</th>
                  <th>사업자번호</th>
                  <th>제품명</th>
                  <th>제품코드</th>
                  <th className="col-num">수량</th>
                  <th className="col-num">금액</th>
                </tr>
              </thead>
              <tbody>
                {preview.flatMap((r, i) => {
                  const qty = editedOverrides[r.id]?.quantity ?? r.quantity;
                  const productName = editedOverrides[r.id]?.productName ?? r.productName;
                  const hospitalId = editedOverrides[r.id]?.hospitalId ?? r.hospitalId;
                  const isInvalidProductCode = r.productCode && !validProductCodes.has(r.productCode);
                  const isInvalidHospital =
                    r.businessNumber &&
                    r.businessNumber.trim() !== '' &&
                    !validBusinessNumbers.has(r.businessNumber);
                  const row = (
                    <tr key={r.id}>
                      <td style={{ textAlign: 'center', color: theme.colors.textMuted, fontSize: 11 }}>
                        {i + 1}
                      </td>
                      <td {...(isInvalidHospital && { 'data-invalid': 'true' })}>
                        <SingleSelect
                          options={corporationHospitals.map((h) => ({
                            label: h.name,
                            value: h.id,
                            description: h.address || undefined,
                          }))}
                          selected={hospitalId}
                          onChange={(v) => setRowEdit(r.id, 'hospitalId', String(v))}
                          placeholder="병의원"
                          enableSearch
                          aria-label={`${r.id} 병의원`}
                        />
                      </td>
                      <td>{r.businessNumber || '-'}</td>
                      <td>
                        <input
                          type="text"
                          value={productName}
                          onChange={(e) => setRowEdit(r.id, 'productName', e.target.value)}
                          aria-label={`${r.id} 제품명`}
                        />
                      </td>
                      <td {...(isInvalidProductCode && { 'data-invalid': 'true' })}>
                        {r.productCode || '-'}
                      </td>
                      <td className="col-num">
                        <input
                          type="number"
                          min={0}
                          value={qty}
                          onChange={(e) => setRowEdit(r.id, 'quantity', Number(e.target.value) || 0)}
                          aria-label={`${r.id} 수량`}
                        />
                      </td>
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
                            <td colSpan={5}>
                              {ft.fileName} 합계
                            </td>
                            <td className="col-num">{ft.totalQuantity.toLocaleString()}</td>
                            <td className="col-num">{ft.totalAmount.toLocaleString()}</td>
                          </tr>
                        ) : (
                          <tr key={`sep-${i}`} css={separatorRowStyles}>
                            <td colSpan={7} />
                          </tr>
                        );
                      })()
                    ) : (
                      <tr key={`sep-${i}`} css={separatorRowStyles}>
                        <td colSpan={7} />
                      </tr>
                    )
                  ) : null;
                  return sep ? [row, sep] : [row];
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5}>합계</td>
                  <td className="col-num">{totals.totalQuantity.toLocaleString()}</td>
                  <td className="col-num">{totals.totalAmount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <Row
            gap={theme.spacing(2)}
            alignItems="center"
            css={css({ marginTop: theme.spacing(4) })}
          >
            <Button variant="primary" onClick={openConfirmModal}>
              실적 등록
            </Button>
            <span css={css({ fontSize: 14, color: theme.colors.textMuted })}>
              전체 {preview.length}건
            </span>
          </Row>
        </div>
      )}

      {showConfirmModal && (
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="center"
          css={css({
            position: 'fixed',
            inset: 0,
            backgroundColor: theme.colors.overlay,
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
            <Row gap={theme.spacing(2)} justifyContent="flex-end">
              <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                아니오
              </Button>
              <Button variant="primary" onClick={doRegister}>
                예
              </Button>
            </Row>
          </div>
        </Flex>
      )}
    </div>
  );
}
