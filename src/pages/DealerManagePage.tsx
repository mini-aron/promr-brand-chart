/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { useApp } from '@/context/AppContext';
import type { Dealer } from '@/types';
import { theme } from '@/theme';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { color: theme.colors.textMuted, marginBottom: theme.spacing(4) },
});

const headerRow = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
});

const addButton = css({
  padding: `${theme.buttonPadding.y}px ${theme.spacing(4)}px`,
  fontSize: 14,
  fontWeight: 600,
  borderRadius: theme.radius.md,
  border: 'none',
  backgroundColor: theme.colors.primary,
  color: theme.colors.buttonText,
  cursor: 'pointer',
  '&:hover': { backgroundColor: theme.colors.primaryHover },
});

const tableWrap = css({
  overflow: 'auto',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.surface,
  boxShadow: theme.shadow.sm,
  fontSize: 12,
  '& table': { width: '100%', borderCollapse: 'collapse', minWidth: 900 },
  '& th, & td': {
    padding: theme.spacing(1.5),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
    borderRight: `1px solid ${theme.colors.border}`,
  },
  '& th:last-child, & td:last-child': { borderRight: 'none' },
  '& th': { backgroundColor: theme.colors.background, fontWeight: 600 },
  '& tbody tr:hover': { backgroundColor: `${theme.colors.primary}06` },
});

const modalOverlay = css({
  position: 'fixed',
  inset: 0,
  backgroundColor: theme.colors.overlay,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
});

const modalBox = css({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.md,
  width: '100%',
  maxWidth: 640,
  maxHeight: '90vh',
  overflow: 'auto',
  padding: theme.spacing(4),
  position: 'relative',
});

const modalHeader = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(4),
  '& h2': { margin: 0, fontSize: 18, fontWeight: 600, color: theme.colors.text },
});

const modalCloseBtn = css({
  width: 32,
  height: 32,
  padding: 0,
  border: 'none',
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.background,
  cursor: 'pointer',
  fontSize: 18,
  lineHeight: 1,
  color: theme.colors.textMuted,
  '&:hover': { backgroundColor: theme.colors.border, color: theme.colors.text },
});

const formSection = css({
  '& label': {
    display: 'block',
    marginBottom: theme.spacing(1),
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.text,
  },
  '& input[type="text"], & input[type="tel"], & input[type="email"]': {
    width: '100%',
    minHeight: 48,
    padding: `0 ${theme.spacing(3)}px`,
    fontSize: 14,
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.border}`,
    marginBottom: theme.spacing(3),
    '&:focus': { outline: 'none', borderColor: theme.colors.primary, boxShadow: `0 0 0 2px ${theme.colors.primary}20` },
  },
});

const fileInputWrapper = css({
  marginBottom: theme.spacing(3),
});

const fileInputLabel = css({
  display: 'block',
  marginBottom: theme.spacing(1),
  fontSize: 14,
  fontWeight: 600,
  color: theme.colors.text,
});

const fileInput = css({
  display: 'block',
  width: '100%',
  fontSize: 14,
  padding: theme.spacing(2),
  borderRadius: theme.radius.md,
  border: `2px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surface,
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.colors.primary,
  },
  '&::file-selector-button': {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    marginRight: theme.spacing(2),
    border: 'none',
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.primary,
    color: theme.colors.buttonText,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.primaryHover,
    },
  },
});

const fileNameDisplay = css({
  fontSize: 13,
  color: theme.colors.textMuted,
  marginTop: theme.spacing(0.5),
});

const modalActions = css({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${theme.colors.border}`,
});

const actionButton = css({
  padding: `${theme.buttonPadding.y}px ${theme.spacing(4)}px`,
  fontSize: 14,
  fontWeight: 600,
  borderRadius: theme.radius.md,
  border: 'none',
  cursor: 'pointer',
  minHeight: 48,
});

const primaryButton = css(actionButton, {
  backgroundColor: theme.colors.primary,
  color: theme.colors.buttonText,
  '&:hover': { backgroundColor: theme.colors.primaryHover },
});

const secondaryButton = css(actionButton, {
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  '&:hover': { backgroundColor: theme.colors.background },
});

const linkStyles = css({
  color: theme.colors.primary,
  textDecoration: 'none',
  '&:hover': { textDecoration: 'underline' },
});

const fileActionGroup = css({
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'center',
});

const uploadButton = css({
  padding: `${theme.spacing(0.5)}px ${theme.spacing(1.5)}px`,
  fontSize: 11,
  fontWeight: 500,
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  cursor: 'pointer',
  '&:hover': { backgroundColor: theme.colors.background, borderColor: theme.colors.primary },
});

const previewModalBox = css({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.md,
  width: '90vw',
  maxWidth: 1200,
  maxHeight: '90vh',
  overflow: 'auto',
  padding: theme.spacing(4),
  position: 'relative',
});

const previewContent = css({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 400,
  '& img': {
    maxWidth: '100%',
    maxHeight: '70vh',
    objectFit: 'contain',
  },
  '& iframe': {
    width: '100%',
    height: '70vh',
    border: 'none',
    borderRadius: theme.radius.md,
  },
});

const linkButton = css({
  color: theme.colors.primary,
  background: 'none',
  border: 'none',
  padding: 0,
  fontSize: 'inherit',
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': { textDecoration: 'underline' },
});

export function DealerManagePage() {
  const { userRole, dealers, currentCorporationId, addDealer } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSalespersonName, setNewSalespersonName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newReportCertFile, setNewReportCertFile] = useState<File | null>(null);
  const [newContractFile, setNewContractFile] = useState<File | null>(null);
  const [newBusinessLicenseFile, setNewBusinessLicenseFile] = useState<File | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  const filteredDealers = useMemo(() => {
    return dealers.filter((d) => d.corporationId === currentCorporationId);
  }, [dealers, currentCorporationId]);

  const handleAdd = useCallback(() => {
    const name = newSalespersonName.trim();
    const phone = newPhone.trim();
    const email = newEmail.trim();

    if (!name) {
      setAddError('영업사원명을 입력하세요.');
      return;
    }
    if (!phone) {
      setAddError('전화번호를 입력하세요.');
      return;
    }
    if (!email) {
      setAddError('이메일을 입력하세요.');
      return;
    }

    setAddError(null);
    
    let reportCertUrl: string | undefined;
    let contractUrl: string | undefined;
    let businessLicenseUrl: string | undefined;

    if (newReportCertFile) {
      reportCertUrl = URL.createObjectURL(newReportCertFile);
    }
    if (newContractFile) {
      contractUrl = URL.createObjectURL(newContractFile);
    }
    if (newBusinessLicenseFile) {
      businessLicenseUrl = URL.createObjectURL(newBusinessLicenseFile);
    }

    const dealer: Dealer = {
      id: `d-${Date.now()}`,
      corporationId: currentCorporationId,
      salespersonName: name,
      phone,
      email,
      reportCertUrl,
      contractUrl,
      businessLicenseUrl,
      createdAt: new Date().toISOString().slice(0, 19),
    };
    addDealer(dealer);
    closeAddModal();
  }, [newSalespersonName, newPhone, newEmail, newReportCertFile, newContractFile, newBusinessLicenseFile, currentCorporationId, addDealer]);

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
    setAddError(null);
    setNewSalespersonName('');
    setNewPhone('');
    setNewEmail('');
    setNewReportCertFile(null);
    setNewContractFile(null);
    setNewBusinessLicenseFile(null);
  }, []);

  const handleUpload = useCallback((dealerId: string, fileType: 'reportCert' | 'contract' | 'businessLicense') => {
    alert(`${dealerId}의 ${fileType} 파일 업로드 기능은 추후 구현됩니다.`);
  }, []);

  const handlePreview = useCallback((url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
  }, []);

  const closePreviewModal = useCallback(() => {
    setPreviewUrl(null);
    setPreviewTitle('');
  }, []);

  if (userRole === 'pharma') return <Navigate to="/" replace />;

  return (
    <div css={pageStyles}>
      <h1>계약관리</h1>
      <p>딜러(영업사원) 정보를 관리합니다.</p>

      <div css={headerRow}>
        <div />
        <button type="button" css={addButton} onClick={() => setShowAddModal(true)}>
          딜러 추가
        </button>
      </div>

      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-modal-title"
          css={modalOverlay}
          onClick={closeAddModal}
        >
          <div css={modalBox} onClick={(e) => e.stopPropagation()}>
            <div css={modalHeader}>
              <h2 id="add-modal-title">딜러 추가</h2>
              <button type="button" css={modalCloseBtn} onClick={closeAddModal} aria-label="닫기">
                ×
              </button>
            </div>

            <div css={formSection}>
              <label htmlFor="new-salesperson-name">영업사원명 *</label>
              <input
                id="new-salesperson-name"
                type="text"
                placeholder="영업사원명"
                value={newSalespersonName}
                onChange={(e) => setNewSalespersonName(e.target.value)}
              />

              <label htmlFor="new-phone">전화번호 *</label>
              <input
                id="new-phone"
                type="tel"
                placeholder="010-0000-0000"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />

              <label htmlFor="new-email">이메일 *</label>
              <input
                id="new-email"
                type="email"
                placeholder="example@email.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />

              <div css={fileInputWrapper}>
                <label htmlFor="new-report-cert" css={fileInputLabel}>신고필증</label>
                <input
                  id="new-report-cert"
                  type="file"
                  accept="image/*,.pdf"
                  css={fileInput}
                  onChange={(e) => setNewReportCertFile(e.target.files?.[0] || null)}
                />
                {newReportCertFile && (
                  <div css={fileNameDisplay}>선택된 파일: {newReportCertFile.name}</div>
                )}
              </div>

              <div css={fileInputWrapper}>
                <label htmlFor="new-contract" css={fileInputLabel}>계약서</label>
                <input
                  id="new-contract"
                  type="file"
                  accept="image/*,.pdf"
                  css={fileInput}
                  onChange={(e) => setNewContractFile(e.target.files?.[0] || null)}
                />
                {newContractFile && (
                  <div css={fileNameDisplay}>선택된 파일: {newContractFile.name}</div>
                )}
              </div>

              <div css={fileInputWrapper}>
                <label htmlFor="new-business-license" css={fileInputLabel}>사업자 등록증</label>
                <input
                  id="new-business-license"
                  type="file"
                  accept="image/*,.pdf"
                  css={fileInput}
                  onChange={(e) => setNewBusinessLicenseFile(e.target.files?.[0] || null)}
                />
                {newBusinessLicenseFile && (
                  <div css={fileNameDisplay}>선택된 파일: {newBusinessLicenseFile.name}</div>
                )}
              </div>
            </div>

            {addError && (
              <p css={css({ marginTop: theme.spacing(2), fontSize: 14, color: theme.colors.error })}>
                {addError}
              </p>
            )}

            <div css={modalActions}>
              <button type="button" css={secondaryButton} onClick={closeAddModal}>
                취소
              </button>
              <button type="button" css={primaryButton} onClick={handleAdd}>
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {previewUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-modal-title"
          css={modalOverlay}
          onClick={closePreviewModal}
        >
          <div css={previewModalBox} onClick={(e) => e.stopPropagation()}>
            <div css={modalHeader}>
              <h2 id="preview-modal-title">{previewTitle}</h2>
              <button type="button" css={modalCloseBtn} onClick={closePreviewModal} aria-label="닫기">
                ×
              </button>
            </div>
            <div css={previewContent}>
              <img src={previewUrl} alt={previewTitle} />
            </div>
          </div>
        </div>
      )}

      <div css={tableWrap}>
        <table>
          <thead>
            <tr>
              <th>영업사원명</th>
              <th>전화번호</th>
              <th>이메일</th>
              <th>신고필증</th>
              <th>계약서</th>
              <th>사업자 등록증</th>
            </tr>
          </thead>
          <tbody>
            {filteredDealers.map((d) => (
              <tr key={d.id}>
                <td>{d.salespersonName}</td>
                <td>{d.phone}</td>
                <td>{d.email}</td>
                <td>
                  {d.reportCertUrl ? (
                    <div css={fileActionGroup}>
                      <button 
                        type="button"
                        css={linkButton}
                        onClick={() => handlePreview(d.reportCertUrl!, '신고필증 미리보기')}
                      >
                        미리보기
                      </button>
                      <span css={css({ color: theme.colors.textMuted })}>|</span>
                      <a href={d.reportCertUrl} download css={linkStyles}>
                        다운로드
                      </a>
                    </div>
                  ) : (
                    <button type="button" css={uploadButton} onClick={() => handleUpload(d.id, 'reportCert')}>
                      업로드
                    </button>
                  )}
                </td>
                <td>
                  {d.contractUrl ? (
                    <div css={fileActionGroup}>
                      <button 
                        type="button"
                        css={linkButton}
                        onClick={() => handlePreview(d.contractUrl!, '계약서 미리보기')}
                      >
                        미리보기
                      </button>
                      <span css={css({ color: theme.colors.textMuted })}>|</span>
                      <a href={d.contractUrl} download css={linkStyles}>
                        다운로드
                      </a>
                    </div>
                  ) : (
                    <button type="button" css={uploadButton} onClick={() => handleUpload(d.id, 'contract')}>
                      업로드
                    </button>
                  )}
                </td>
                <td>
                  {d.businessLicenseUrl ? (
                    <div css={fileActionGroup}>
                      <button 
                        type="button"
                        css={linkButton}
                        onClick={() => handlePreview(d.businessLicenseUrl!, '사업자 등록증 미리보기')}
                      >
                        미리보기
                      </button>
                      <span css={css({ color: theme.colors.textMuted })}>|</span>
                      <a href={d.businessLicenseUrl} download css={linkStyles}>
                        다운로드
                      </a>
                    </div>
                  ) : (
                    <button type="button" css={uploadButton} onClick={() => handleUpload(d.id, 'businessLicense')}>
                      업로드
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredDealers.length === 0 && (
        <p css={css({ marginTop: theme.spacing(2), color: theme.colors.textMuted })}>
          등록된 딜러가 없습니다.
        </p>
      )}
    </div>
  );
}
