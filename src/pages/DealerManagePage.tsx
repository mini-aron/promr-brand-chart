/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { HiOutlineX } from 'react-icons/hi';
import { useApp } from '@/context/AppContext';
import type { Dealer } from '@/types';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';
import { Flex, Row } from '@/components/Common/Flex';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { color: theme.colors.textMuted, marginBottom: theme.spacing(4) },
});

const headerRowWrap = css({
  marginBottom: theme.spacing(4),
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

const modalHeaderWrap = css({
  marginBottom: theme.spacing(4),
  '& h2': { margin: 0, fontSize: 18, fontWeight: 600, color: theme.colors.text },
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

const modalActionsWrap = css({
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${theme.colors.border}`,
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

const confirmModalBox = css({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.md,
  width: '100%',
  maxWidth: 480,
  padding: theme.spacing(4),
  position: 'relative',
});

export function DealerManagePage() {
  const { userRole, dealers, currentCorporationId, addDealer, deleteDealer } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSalespersonName, setNewSalespersonName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newReportCertFile, setNewReportCertFile] = useState<File | null>(null);
  const [newContractFile, setNewContractFile] = useState<File | null>(null);
  const [newSubcontractContractFile, setNewSubcontractContractFile] = useState<File | null>(null);
  const [newBusinessLicenseFile, setNewBusinessLicenseFile] = useState<File | null>(null);
  const [addError, setAddError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');
  const [deleteConfirmDealer, setDeleteConfirmDealer] = useState<Dealer | null>(null);

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
    let subcontractContractUrl: string | undefined;
    let businessLicenseUrl: string | undefined;

    if (newReportCertFile) {
      reportCertUrl = URL.createObjectURL(newReportCertFile);
    }
    if (newContractFile) {
      contractUrl = URL.createObjectURL(newContractFile);
    }
    if (newSubcontractContractFile) {
      subcontractContractUrl = URL.createObjectURL(newSubcontractContractFile);
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
      subcontractContractUrl,
      businessLicenseUrl,
      createdAt: new Date().toISOString().slice(0, 19),
    };
    addDealer(dealer);
    closeAddModal();
  }, [newSalespersonName, newPhone, newEmail, newReportCertFile, newContractFile, newSubcontractContractFile, newBusinessLicenseFile, currentCorporationId, addDealer]);

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
    setAddError(null);
    setNewSalespersonName('');
    setNewPhone('');
    setNewEmail('');
    setNewReportCertFile(null);
    setNewContractFile(null);
    setNewSubcontractContractFile(null);
    setNewBusinessLicenseFile(null);
  }, []);

  const handleUpload = useCallback((dealerId: string, fileType: 'reportCert' | 'contract' | 'subcontractContract' | 'businessLicense') => {
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

  const handleDeleteClick = useCallback((dealer: Dealer) => {
    setDeleteConfirmDealer(dealer);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirmDealer) {
      deleteDealer(deleteConfirmDealer.id);
      setDeleteConfirmDealer(null);
    }
  }, [deleteConfirmDealer, deleteDealer]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteConfirmDealer(null);
  }, []);

  if (userRole === 'pharma') return <Navigate to="/" replace />;

  return (
    <div css={pageStyles}>
      <h1>계약관리</h1>
      <p>딜러(영업사원) 정보를 관리합니다.</p>

      <Row justifyContent="space-between" alignItems="center" css={headerRowWrap}>
        <div />
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          딜러 추가
        </Button>
      </Row>

      {showAddModal && (
        <Flex direction="row" alignItems="center" justifyContent="center" css={modalOverlay} onClick={closeAddModal}>
          <div css={modalBox} onClick={(e) => e.stopPropagation()}>
            <Row alignItems="center" justifyContent="space-between" css={modalHeaderWrap}>
              <h2 id="add-modal-title">딜러 추가</h2>
              <Button variant="ghost" size="icon" onClick={closeAddModal} aria-label="닫기"><HiOutlineX size={18} /></Button>
            </Row>

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
                <label htmlFor="new-subcontract-contract" css={fileInputLabel}>재위탁계약서</label>
                <input
                  id="new-subcontract-contract"
                  type="file"
                  accept="image/*,.pdf"
                  css={fileInput}
                  onChange={(e) => setNewSubcontractContractFile(e.target.files?.[0] || null)}
                />
                {newSubcontractContractFile && (
                  <div css={fileNameDisplay}>선택된 파일: {newSubcontractContractFile.name}</div>
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

            <Row gap={theme.spacing(2)} justifyContent="flex-end" css={modalActionsWrap}>
              <Button variant="secondary" onClick={closeAddModal}>취소</Button>
              <Button variant="primary" onClick={handleAdd}>추가</Button>
            </Row>
          </div>
        </Flex>
      )}

      {previewUrl && (
        <Flex direction="row" alignItems="center" justifyContent="center" css={modalOverlay} onClick={closePreviewModal}>
          <div css={previewModalBox} onClick={(e) => e.stopPropagation()}>
            <Row alignItems="center" justifyContent="space-between" css={modalHeaderWrap}>
              <h2 id="preview-modal-title">{previewTitle}</h2>
              <Button variant="ghost" size="icon" onClick={closePreviewModal} aria-label="닫기"><HiOutlineX size={18} /></Button>
            </Row>
            <div css={previewContent}>
              <img src={previewUrl} alt={previewTitle} />
            </div>
          </div>
        </Flex>
      )}

      {deleteConfirmDealer && (
        <Flex direction="row" alignItems="center" justifyContent="center" css={modalOverlay} onClick={handleDeleteCancel}>
          <div css={confirmModalBox} onClick={(e) => e.stopPropagation()}>
            <Row alignItems="center" justifyContent="space-between" css={modalHeaderWrap}>
              <h2 id="delete-modal-title">딜러 삭제</h2>
              <Button variant="ghost" size="icon" onClick={handleDeleteCancel} aria-label="닫기"><HiOutlineX size={18} /></Button>
            </Row>
            <p css={css({ marginBottom: theme.spacing(3), color: theme.colors.text })}>
              <strong>{deleteConfirmDealer.salespersonName}</strong> 딜러를 삭제하시겠습니까?
            </p>
            <p css={css({ fontSize: 14, color: theme.colors.textMuted, marginBottom: theme.spacing(4) })}>
              이 작업은 되돌릴 수 없습니다.
            </p>
            <Row gap={theme.spacing(2)} justifyContent="flex-end" css={modalActionsWrap}>
              <Button variant="secondary" onClick={handleDeleteCancel}>취소</Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>삭제</Button>
            </Row>
          </div>
        </Flex>
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
              <th>재위탁계약서</th>
              <th>사업자 등록증</th>
              <th style={{ width: 80 }}>관리</th>
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
                      <Button
                        variant="ghost"
                        size="small"
                        css={linkButton}
                        onClick={() => handlePreview(d.reportCertUrl!, '신고필증 미리보기')}
                      >
                        미리보기
                      </Button>
                      <span css={css({ color: theme.colors.textMuted })}>|</span>
                      <a href={d.reportCertUrl} download css={linkStyles}>
                        다운로드
                      </a>
                    </div>
                  ) : (
                    <Button variant="secondary" size="small" onClick={() => handleUpload(d.id, 'reportCert')}>
                      업로드
                    </Button>
                  )}
                </td>
                <td>
                  {d.contractUrl ? (
                    <div css={fileActionGroup}>
                      <Button
                        variant="ghost"
                        size="small"
                        css={linkButton}
                        onClick={() => handlePreview(d.contractUrl!, '계약서 미리보기')}
                      >
                        미리보기
                      </Button>
                      <span css={css({ color: theme.colors.textMuted })}>|</span>
                      <a href={d.contractUrl} download css={linkStyles}>
                        다운로드
                      </a>
                    </div>
                  ) : (
                    <Button variant="secondary" size="small" onClick={() => handleUpload(d.id, 'contract')}>
                      업로드
                    </Button>
                  )}
                </td>
                <td>
                  {d.subcontractContractUrl ? (
                    <div css={fileActionGroup}>
                      <Button
                        variant="ghost"
                        size="small"
                        css={linkButton}
                        onClick={() => handlePreview(d.subcontractContractUrl!, '재위탁계약서 미리보기')}
                      >
                        미리보기
                      </Button>
                      <span css={css({ color: theme.colors.textMuted })}>|</span>
                      <a href={d.subcontractContractUrl} download css={linkStyles}>
                        다운로드
                      </a>
                    </div>
                  ) : (
                    <Button variant="secondary" size="small" onClick={() => handleUpload(d.id, 'subcontractContract')}>
                      업로드
                    </Button>
                  )}
                </td>
                <td>
                  {d.businessLicenseUrl ? (
                    <div css={fileActionGroup}>
                      <Button
                        variant="ghost"
                        size="small"
                        css={linkButton}
                        onClick={() => handlePreview(d.businessLicenseUrl!, '사업자 등록증 미리보기')}
                      >
                        미리보기
                      </Button>
                      <span css={css({ color: theme.colors.textMuted })}>|</span>
                      <a href={d.businessLicenseUrl} download css={linkStyles}>
                        다운로드
                      </a>
                    </div>
                  ) : (
                    <Button variant="secondary" size="small" onClick={() => handleUpload(d.id, 'businessLicense')}>
                      업로드
                    </Button>
                  )}
                </td>
                <td>
                  <Button variant="danger" size="small" onClick={() => handleDeleteClick(d)}>
                    삭제
                  </Button>
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
