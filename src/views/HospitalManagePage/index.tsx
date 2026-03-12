'use client';

import { useCallback, useMemo, useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { useApp } from '@/store/appStore';
import { mockCorporations, mockHospitals } from '@/store/mockData';
import type { Hospital } from '@/types';
import { Button } from '@/components/Common/Button';
import { DataTable } from '@/components/Common/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import * as tableStyles from '@/style/TableStyles.css';
import * as s from './index.css';

export function HospitalManagePage() {
  const { userRole } = useApp();
  const isAdmin = userRole === 'admin';
  const corporations = mockCorporations;
  const [hospitals, setHospitals] = useState<Hospital[]>(mockHospitals);
  const addHospital = useCallback((hospital: Hospital) => {
    setHospitals((prev) => [...prev, hospital]);
  }, []);
  const updateHospital = useCallback((id: string, patch: Partial<Pick<Hospital, 'accountCode'>>) => {
    setHospitals((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)));
  }, []);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [businessNumberInput, setBusinessNumberInput] = useState('');
  const [searchedHospital, setSearchedHospital] = useState<Hospital | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [accountCodeOverrides, setAccountCodeOverrides] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return hospitals;
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.accountCode ?? '').toLowerCase().includes(q) ||
        (h.businessNumber ?? '').includes(q) ||
        (corporations.find((c) => c.id === h.corporationId)?.name ?? '').toLowerCase().includes(q)
    );
  }, [hospitals, corporations, search]);

  const getDisplayAccountCode = useCallback(
    (h: Hospital) => accountCodeOverrides[h.id] ?? h.accountCode ?? '',
    [accountCodeOverrides]
  );

  const isRowModified = useCallback(
    (h: Hospital) => {
      const current = (accountCodeOverrides[h.id] ?? h.accountCode ?? '').trim();
      const original = (h.accountCode ?? '').trim();
      return current !== original;
    },
    [accountCodeOverrides]
  );

  const modifiedIds = useMemo(
    () => filtered.filter((h) => isRowModified(h)).map((h) => h.id),
    [filtered, isRowModified]
  );

  const setAccountCodeFor = useCallback((hospitalId: string, value: string) => {
    setAccountCodeOverrides((prev) => ({ ...prev, [hospitalId]: value }));
  }, []);

  const saveAllAccountCodes = useCallback(() => {
    modifiedIds.forEach((id) => {
      const h = hospitals.find((x) => x.id === id);
      if (!h) return;
      const value = (accountCodeOverrides[h.id] ?? h.accountCode ?? '').trim();
      updateHospital(id, { accountCode: value || undefined });
    });
    setAccountCodeOverrides((prev) => {
      const next = { ...prev };
      modifiedIds.forEach((id) => delete next[id]);
      return next;
    });
  }, [modifiedIds, hospitals, accountCodeOverrides, updateHospital]);

  const getCorpName = (corpId: string) => corporations.find((c) => c.id === corpId)?.name ?? '-';

  const columnHelper = createColumnHelper<Hospital>();
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'accountCode',
        header: '거래처코드',
        cell: (info) => {
          const h = info.row.original;
          return (
            <input
              type="text"
              value={getDisplayAccountCode(h)}
              onChange={(e) => setAccountCodeFor(h.id, e.target.value)}
              placeholder="-"
              className={s.accountCodeInput}
              aria-label={`${h.name} 거래처코드`}
            />
          );
        },
      }),
      columnHelper.accessor('name', { header: '병의원명' }),
      columnHelper.accessor('corporationId', {
        header: '소속법인',
        cell: (info) => getCorpName(info.getValue()),
      }),
      columnHelper.accessor('businessNumber', { header: '사업자번호', cell: (info) => info.getValue() ?? '-' }),
      columnHelper.accessor('address', { header: '주소', cell: (info) => info.getValue() ?? '-' }),
    ],
    [columnHelper, getDisplayAccountCode, setAccountCodeFor, getCorpName]
  );

  const formatBusinessNumber = useCallback((value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
  }, []);

  const handleBusinessNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBusinessNumber(e.target.value);
    setBusinessNumberInput(formatted);
  }, [formatBusinessNumber]);

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    setSearchError(null);
    setSearchedHospital(null);

    const businessNumber = businessNumberInput.trim();
    if (!businessNumber) {
      setSearchError('사업자번호를 입력하세요.');
      setIsSearching(false);
      return;
    }

    setTimeout(() => {
      const found = hospitals.find((h) => h.businessNumber === businessNumber);

      if (found) {
        setSearchedHospital(found);
      } else {
        setSearchError('해당 사업자번호로 등록된 병의원이 없습니다.\n프로엠알에게 문의해주세요.');
      }
      setIsSearching(false);
    }, 500);
  }, [businessNumberInput, hospitals]);

  const handleAdd = useCallback(() => {
    if (!searchedHospital) return;

    const exists = hospitals.some((h) => h.id === searchedHospital.id);
    if (exists) {
      setSearchError('이미 등록된 병의원입니다.');
      return;
    }

    addHospital(searchedHospital);
    closeAddModal();
    alert(`${searchedHospital.name}이(가) 추가되었습니다.`);
  }, [searchedHospital, hospitals, addHospital]);

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
    setBusinessNumberInput('');
    setSearchedHospital(null);
    setSearchError(null);
    setIsSearching(false);
  }, []);


  return (
    <div className={s.page}>
      <h1>병의원 관리</h1>
      <p>{isAdmin ? '병의원 목록을 조회하고 사업자번호로 병의원을 추가합니다.' : '병의원 목록을 조회합니다.'}</p>

      <div className={s.headerRow}>
        <div className={s.searchRow}>
          <input
            type="search"
            placeholder="병의원명·사업자번호·법인명으로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="병의원 검색"
          />
        </div>
        {isAdmin && (
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            병의원 추가
          </Button>
        )}
      </div>

      {isAdmin && showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-modal-title"
          className={s.modalOverlay}
          onClick={closeAddModal}
        >
          <div className={s.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 id="add-modal-title">사업자번호로 병의원 추가</h2>
              <Button variant="ghost" size="icon" onClick={closeAddModal} aria-label="닫기"><HiOutlineX size={18} /></Button>
            </div>

            <div className={s.formSection}>
              <label htmlFor="business-number">사업자번호</label>
              <input
                id="business-number"
                type="text"
                placeholder="000-00-00000"
                value={businessNumberInput}
                onChange={handleBusinessNumberChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSearching) {
                    handleSearch();
                  }
                }}
                disabled={isSearching}
                maxLength={12}
              />
            </div>

            {searchError && (
              <div className={s.errorBox}>
                {searchError.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}

            {searchedHospital && (
              <div className={s.infoBox}>
                <div className={s.infoRow}>
                  <span className={s.infoLabel}>병의원명</span>
                  <span className={s.infoValue}>{searchedHospital.name}</span>
                </div>
                <div className={s.infoRow}>
                  <span className={s.infoLabel}>사업자번호</span>
                  <span className={s.infoValue}>{searchedHospital.businessNumber}</span>
                </div>
                <div className={s.infoRow}>
                  <span className={s.infoLabel}>주소</span>
                  <span className={s.infoValue}>{searchedHospital.address || '-'}</span>
                </div>
                <div className={s.infoRow}>
                  <span className={s.infoLabel}>소속법인</span>
                  <span className={s.infoValue}>{getCorpName(searchedHospital.corporationId)}</span>
                </div>
              </div>
            )}

            <div className={s.modalActions}>
              <Button variant="secondary" onClick={closeAddModal}>취소</Button>
              {!searchedHospital ? (
                <Button variant="primary" onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? '조회 중...' : '조회'}
                </Button>
              ) : (
                <Button variant="primary" onClick={handleAdd}>추가</Button>
              )}
            </div>
          </div>
        </div>
      )}

      {modifiedIds.length > 0 && (
        <div className={s.saveBar}>
          <span className={s.saveBarText}>
            거래처코드 변경 {modifiedIds.length}건
          </span>
          <Button variant="primary" onClick={saveAllAccountCodes}>
            저장
          </Button>
        </div>
      )}

      <DataTable<Hospital>
        columns={columns}
        data={filtered}
        getRowId={(h) => h.id}
        className={s.hospitalTableWrap}
        getRowClassName={(h) => (isRowModified(h) ? tableStyles.tableRowModified : undefined)}
      />
      {filtered.length === 0 && (
        <p className={s.emptyMessage}>
          조건에 맞는 병의원이 없습니다.
        </p>
      )}

    </div>
  );
}
