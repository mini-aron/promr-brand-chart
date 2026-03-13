'use client';
import { useCallback, useMemo, useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { mockCorporations, mockHospitals } from '@/store/mockData';
import type { Hospital } from '@/types';
import { createColumnHelper } from '@tanstack/react-table';
import { Button } from '@/components/Common/Button';
import { Flex, Row } from '@/components/Common/Flex';
import { SingleSelect } from '@/components/Common/Select';
import { DataTable } from '@/components/Common/DataTable';
import { PageTitle } from '@/components/Common/Text';
import * as s from './index.css';

export function AccountManagePage() {
  const corporations = mockCorporations;
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const addHospital = useCallback((hospital: Hospital) => {
    setHospitals((prev) => [...prev, hospital]);
  }, []);
  const [search, setSearch] = useState('');
  const [newAccountCode, setNewAccountCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCorpId, setNewCorpId] = useState(corporations[0]?.id ?? '');
  const [newBusinessNumber, setNewBusinessNumber] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [hospitalTemplateSelect, setHospitalTemplateSelect] = useState<string | number | null>('');

  const hospitalsForSelect = useMemo(() => {
    const q = hospitalSearch.trim().toLowerCase();
    if (!q) return hospitals.slice(0, 100);
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.accountCode ?? '').toLowerCase().includes(q) ||
        (h.businessNumber ?? '').includes(q)
    ).slice(0, 100);
  }, [hospitals, hospitalSearch]);

  const applyHospitalTemplate = useCallback((h: Hospital) => {
    setNewName(h.name);
    setNewAccountCode(h.accountCode ?? '');
    setNewCorpId(h.corporationId);
    setNewBusinessNumber(h.businessNumber ?? '');
    setNewAddress(h.address ?? '');
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return hospitals;
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.accountCode ?? '').toLowerCase().includes(q) ||
        (corporations.find((c) => c.id === h.corporationId)?.name ?? '').toLowerCase().includes(q)
    );
  }, [hospitals, corporations, search]);

  const getCorpName = (corpId: string) => corporations.find((c) => c.id === corpId)?.name ?? '-';

  const columnHelper = createColumnHelper<Hospital>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('accountCode', { header: '거래처코드', cell: (info) => info.getValue() ?? '-' }),
      columnHelper.accessor('name', { header: '거래처명' }),
      columnHelper.accessor('corporationId', {
        header: '소속법인',
        cell: (info) => getCorpName(info.getValue()),
      }),
      columnHelper.accessor('businessNumber', { header: '사업자번호', cell: (info) => info.getValue() ?? '-' }),
      columnHelper.accessor('address', { header: '주소', cell: (info) => info.getValue() ?? '-' }),
    ],
    [getCorpName]
  );

  const handleAdd = useCallback(() => {
    const name = newName.trim();
    if (!name) {
      setAddError('거래처명을 입력하세요.');
      return;
    }
    const corpId = newCorpId || corporations[0]?.id;
    if (!corpId) {
      setAddError('소속법인을 선택하세요.');
      return;
    }
    const accountCode = newAccountCode.trim() || undefined;
    const existingCode = accountCode && hospitals.some((h) => (h.accountCode ?? '') === accountCode);
    if (existingCode) {
      setAddError('이미 사용 중인 거래처코드입니다.');
      return;
    }
    setAddError(null);
    const hospital: Hospital = {
      id: `h-${Date.now()}`,
      name,
      corporationId: corpId,
      accountCode: accountCode || undefined,
      businessNumber: newBusinessNumber.trim() || undefined,
      address: newAddress.trim() || undefined,
    };
    addHospital(hospital);
    setNewAccountCode('');
    setNewName('');
    setNewCorpId(corporations[0]?.id ?? '');
    setNewBusinessNumber('');
    setNewAddress('');
    setAddError(null);
    setShowAddModal(false);
  }, [newName, newCorpId, newAccountCode, newBusinessNumber, newAddress, corporations, hospitals, addHospital]);

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
    setAddError(null);
    setNewAccountCode('');
    setNewName('');
    setNewCorpId(corporations[0]?.id ?? '');
    setNewBusinessNumber('');
    setNewAddress('');
    setHospitalSearch('');
  }, [corporations]);


  return (
    <div className={s.page}>
      <PageTitle title="거래처관리" />
      <p>거래처(병의원) 목록을 검색하고 확인합니다.</p>

      <div className={s.searchRow}>
        <input
          type="search"
          placeholder="거래처명·거래처코드·법인명으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="거래처 검색"
        />
      </div>

      <Button variant="primary" className={s.openAddButton} onClick={() => setShowAddModal(true)}>
        거래처 추가
      </Button>

      {showAddModal && (
        <Flex
          direction="row"
          alignItems="center"
          justifyContent="center"
          className={s.modalOverlay}
          onClick={closeAddModal}
        >
          <div className={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <Row alignItems="center" justifyContent="space-between" className={s.modalHeaderWrap}>
              <h2 id="add-modal-title">거래처 추가</h2>
              <Button variant="ghost" size="icon" onClick={closeAddModal} aria-label="닫기"><HiOutlineX size={18} /></Button>
            </Row>

            <div className={`${s.addFormSection} ${s.hospitalSearchRow}`}>
              <label htmlFor="hospital-search-filter">병의원 검색</label>
              <input
                id="hospital-search-filter"
                type="search"
                placeholder="병의원명·거래처코드·사업자번호로 검색 후 아래 목록에서 선택"
                value={hospitalSearch}
                onChange={(e) => setHospitalSearch(e.target.value)}
                className={s.addFormFullWidth}
                aria-label="병의원 검색"
              />
              <SingleSelect
                id="hospital-search-select"
                options={[
                  { label: '선택하세요 (사업자번호·주소 자동 입력)', value: '' },
                  ...hospitalsForSelect.map((h) => ({
                    label: h.name,
                    value: h.id,
                    description: h.address || undefined,
                  })),
                ]}
                selected={hospitalTemplateSelect}
                onChange={(v) => {
                  if (v !== '') {
                    const h = hospitals.find((x) => x.id === v);
                    if (h) applyHospitalTemplate(h);
                    setHospitalTemplateSelect('');
                  } else {
                    setHospitalTemplateSelect(v);
                  }
                }}
                placeholder="선택하세요 (사업자번호·주소 자동 입력)"
                enableSearch
                aria-label="선택 시 거래처명·사업자번호·주소 자동 입력"
              />
            </div>

            <div className={`${s.addFormSection} ${s.addFormGrid}`}>
              <div>
                <label htmlFor="new-account-code">거래처코드</label>
                <input
                  id="new-account-code"
                  type="text"
                  placeholder="선택"
                  value={newAccountCode}
                  onChange={(e) => setNewAccountCode(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="new-name">거래처명 *</label>
                <input
                  id="new-name"
                  type="text"
                  placeholder="병의원명"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="new-corp">소속법인 *</label>
                <SingleSelect
                  id="new-corp"
                  options={corporations.map((c) => ({ label: c.name, value: c.id }))}
                  selected={newCorpId}
                  onChange={(v) => setNewCorpId(String(v))}
                  placeholder="법인 선택"
                  aria-label="소속법인"
                />
              </div>
              <div>
                <label htmlFor="new-business-number">사업자번호</label>
                <input
                  id="new-business-number"
                  type="text"
                  placeholder="000-00-00000"
                  value={newBusinessNumber}
                  onChange={(e) => setNewBusinessNumber(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="new-address">주소</label>
                <input
                  id="new-address"
                  type="text"
                  placeholder="주소"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
              </div>
              <Button variant="primary" onClick={handleAdd}>
                추가
              </Button>
            </div>
            {addError && (
              <p className={s.addError}>
                {addError}
              </p>
            )}
            <Row gap={8} justifyContent="flex-end" className={s.modalActionsWrap}>
              <Button variant="secondary" onClick={closeAddModal}>
                취소
              </Button>
            </Row>
          </div>
        </Flex>
      )}

      <DataTable<Hospital>
        columns={columns}
        data={filtered}
        getRowId={(h) => h.id}
        className={s.accountTableWrap}
      />
      {filtered.length === 0 && (
        <p className={s.emptyMessage}>
          조건에 맞는 거래처가 없습니다.
        </p>
      )}
    </div>
  );
}
