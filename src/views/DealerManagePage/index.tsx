'use client';
import { useCallback, useMemo, useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { useApp } from '@/store/appStore';
import { mockDealers } from '@/store/mockData';
import type { Dealer } from '@/types';
import { Button } from '@/components/Common/Button';
import { Flex, Row } from '@/components/Common/Flex';
import { DataTable } from '@/components/Common/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import * as s from './index.css';

export function DealerManagePage() {
  const { currentCorporationId } = useApp();
  const [dealers, setDealers] = useState<Dealer[]>(mockDealers);
  const addDealer = useCallback((dealer: Dealer) => {
    setDealers((prev) => [...prev, dealer]);
  }, []);
  const deleteDealer = useCallback((dealerId: string) => {
    setDealers((prev) => prev.filter((d) => d.id !== dealerId));
  }, []);
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

  const columnHelper = createColumnHelper<Dealer>();
  const columns = useMemo(() => {
    const renderFileCell = (
      url: string | undefined,
      dealerId: string,
      fileType: 'reportCert' | 'contract' | 'subcontractContract' | 'businessLicense',
      title: string
    ) => {
      if (url) {
        return (
          <div className={s.fileActionGroup}>
            <Button variant="ghost" size="small" className={s.linkButton} onClick={() => handlePreview(url, title)}>
              미리보기
            </Button>
            <span className={s.separator}>|</span>
            <a href={url} download className={s.linkStyles}>다운로드</a>
          </div>
        );
      }
      return (
        <Button variant="secondary" size="small" onClick={() => handleUpload(dealerId, fileType)}>
          업로드
        </Button>
      );
    };
    return [
      columnHelper.accessor('salespersonName', { header: '영업사원명' }),
      columnHelper.accessor('phone', { header: '전화번호' }),
      columnHelper.accessor('email', { header: '이메일' }),
      columnHelper.display({
        id: 'reportCert',
        header: '신고필증',
        cell: (info) => renderFileCell(info.row.original.reportCertUrl, info.row.original.id, 'reportCert', '신고필증 미리보기'),
      }),
      columnHelper.display({
        id: 'contract',
        header: '계약서',
        cell: (info) => renderFileCell(info.row.original.contractUrl, info.row.original.id, 'contract', '계약서 미리보기'),
      }),
      columnHelper.display({
        id: 'subcontractContract',
        header: '재위탁계약서',
        cell: (info) => renderFileCell(info.row.original.subcontractContractUrl, info.row.original.id, 'subcontractContract', '재위탁계약서 미리보기'),
      }),
      columnHelper.display({
        id: 'businessLicense',
        header: '사업자 등록증',
        cell: (info) => renderFileCell(info.row.original.businessLicenseUrl, info.row.original.id, 'businessLicense', '사업자 등록증 미리보기'),
      }),
      columnHelper.display({
        id: 'actions',
        header: '관리',
        cell: (info) => (
          <Button variant="danger" size="small" onClick={() => handleDeleteClick(info.row.original)}>
            삭제
          </Button>
        ),
      }),
    ];
  }, [columnHelper, handlePreview, handleUpload, handleDeleteClick]);


  return (
    <div className={s.page}>
      <h1>계약관리</h1>
      <p>딜러(영업사원) 정보를 관리합니다.</p>

      <Row justifyContent="space-between" alignItems="center" className={s.headerRowWrap}>
        <div />
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          딜러 추가
        </Button>
      </Row>

      {showAddModal && (
        <Flex direction="row" alignItems="center" justifyContent="center" className={s.modalOverlay} onClick={closeAddModal}>
          <div className={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <Row alignItems="center" justifyContent="space-between" className={s.modalHeaderWrap}>
              <h2 id="add-modal-title">딜러 추가</h2>
              <Button variant="ghost" size="icon" onClick={closeAddModal} aria-label="닫기"><HiOutlineX size={18} /></Button>
            </Row>

            <div className={s.formSection}>
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

              <div className={s.fileInputWrapper}>
                <label htmlFor="new-report-cert" className={s.fileInputLabel}>신고필증</label>
                <input
                  id="new-report-cert"
                  type="file"
                  accept="image/*,.pdf"
                  className={s.fileInput}
                  onChange={(e) => setNewReportCertFile(e.target.files?.[0] || null)}
                />
                {newReportCertFile && (
                  <div className={s.fileNameDisplay}>선택된 파일: {newReportCertFile.name}</div>
                )}
              </div>

              <div className={s.fileInputWrapper}>
                <label htmlFor="new-contract" className={s.fileInputLabel}>계약서</label>
                <input
                  id="new-contract"
                  type="file"
                  accept="image/*,.pdf"
                  className={s.fileInput}
                  onChange={(e) => setNewContractFile(e.target.files?.[0] || null)}
                />
                {newContractFile && (
                  <div className={s.fileNameDisplay}>선택된 파일: {newContractFile.name}</div>
                )}
              </div>

              <div className={s.fileInputWrapper}>
                <label htmlFor="new-subcontract-contract" className={s.fileInputLabel}>재위탁계약서</label>
                <input
                  id="new-subcontract-contract"
                  type="file"
                  accept="image/*,.pdf"
                  className={s.fileInput}
                  onChange={(e) => setNewSubcontractContractFile(e.target.files?.[0] || null)}
                />
                {newSubcontractContractFile && (
                  <div className={s.fileNameDisplay}>선택된 파일: {newSubcontractContractFile.name}</div>
                )}
              </div>

              <div className={s.fileInputWrapper}>
                <label htmlFor="new-business-license" className={s.fileInputLabel}>사업자 등록증</label>
                <input
                  id="new-business-license"
                  type="file"
                  accept="image/*,.pdf"
                  className={s.fileInput}
                  onChange={(e) => setNewBusinessLicenseFile(e.target.files?.[0] || null)}
                />
                {newBusinessLicenseFile && (
                  <div className={s.fileNameDisplay}>선택된 파일: {newBusinessLicenseFile.name}</div>
                )}
              </div>
            </div>

            {addError && (
              <p className={s.addError}>
                {addError}
              </p>
            )}

            <Row gap={8} justifyContent="flex-end" className={s.modalActionsWrap}>
              <Button variant="secondary" onClick={closeAddModal}>취소</Button>
              <Button variant="primary" onClick={handleAdd}>추가</Button>
            </Row>
          </div>
        </Flex>
      )}

      {previewUrl && (
        <Flex direction="row" alignItems="center" justifyContent="center" className={s.modalOverlay} onClick={closePreviewModal}>
          <div className={s.previewModalBox} onClick={(e) => e.stopPropagation()}>
            <Row alignItems="center" justifyContent="space-between" className={s.modalHeaderWrap}>
              <h2 id="preview-modal-title">{previewTitle}</h2>
              <Button variant="ghost" size="icon" onClick={closePreviewModal} aria-label="닫기"><HiOutlineX size={18} /></Button>
            </Row>
            <div className={s.previewContent}>
              <img src={previewUrl} alt={previewTitle} />
            </div>
          </div>
        </Flex>
      )}

      {deleteConfirmDealer && (
        <Flex direction="row" alignItems="center" justifyContent="center" className={s.modalOverlay} onClick={handleDeleteCancel}>
          <div className={s.confirmModalBox} onClick={(e) => e.stopPropagation()}>
            <Row alignItems="center" justifyContent="space-between" className={s.modalHeaderWrap}>
              <h2 id="delete-modal-title">딜러 삭제</h2>
              <Button variant="ghost" size="icon" onClick={handleDeleteCancel} aria-label="닫기"><HiOutlineX size={18} /></Button>
            </Row>
            <p className={s.deleteConfirmText}>
              <strong>{deleteConfirmDealer.salespersonName}</strong> 딜러를 삭제하시겠습니까?
            </p>
            <p className={s.deleteConfirmTextMuted}>
              이 작업은 되돌릴 수 없습니다.
            </p>
            <Row gap={8} justifyContent="flex-end" className={s.modalActionsWrap}>
              <Button variant="secondary" onClick={handleDeleteCancel}>취소</Button>
              <Button variant="danger" onClick={handleDeleteConfirm}>삭제</Button>
            </Row>
          </div>
        </Flex>
      )}

      <DataTable<Dealer>
        columns={columns}
        data={filteredDealers}
        getRowId={(d) => d.id}
        className={s.dealerTableWrap}
      />
      {filteredDealers.length === 0 && (
        <p className={s.emptyMessage}>
          등록된 딜러가 없습니다.
        </p>
      )}
    </div>
  );
}
