'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApp } from '@/store/appStore';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import type { Hospital } from '@/types';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { HospitalSearchSelect, type HospitalOption } from '@/shared/components/ui/Select';
import { DataTable } from '@/shared/components/ui/DataTable';
import { CardWrapper, PageHeader } from '@/shared/components/layout';
import { createColumnHelper } from '@tanstack/react-table';
import * as tableStyles from '@/style/TableStyles.css';
import { formatBusinessNumber } from '@/utils';
import * as s from './index.css';

type AddHospitalFormFields = {
  name: string;
  businessNumber: string;
  address: string;
  phone: string;
  careNumber: string;
  representativeName: string;
  memo: string;
};

const EMPTY_ADD_HOSPITAL_FORM: AddHospitalFormFields = {
  name: '',
  businessNumber: '',
  address: '',
  phone: '',
  careNumber: '',
  representativeName: '',
  memo: '',
};

export function HospitalManagePage() {
  const { userRole } = useApp();
  const canAddHospital = userRole === 'admin' || userRole === 'pharma';
  const corporations = useDemoPlayStore((s) => s.corporations);
  const hospitals = useDemoPlayStore((s) => s.hospitals);
  const setHospitals = useDemoPlayStore((s) => s.setHospitals);
  const addHospital = useCallback(
    (hospital: Hospital) => {
      setHospitals((prev) => [...prev, hospital]);
    },
    [setHospitals],
  );
  const updateHospital = useCallback(
    (id: string, patch: Partial<Pick<Hospital, 'accountCode'>>) => {
      setHospitals((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)));
    },
    [setHospitals],
  );
  const [filterKeyword, setFilterKeyword] = useState('');
  const [filterHospitalId, setFilterHospitalId] = useState<string | null>(null);
  const [filterAccountCode, setFilterAccountCode] = useState('');
  const [filterBusinessNumber, setFilterBusinessNumber] = useState('');
  const [filterAddress, setFilterAddress] = useState('');

  const [addHospitalForm, setAddHospitalForm] =
    useState<AddHospitalFormFields>(EMPTY_ADD_HOSPITAL_FORM);
  const [addError, setAddError] = useState<string | null>(null);
  const [accountCodeOverrides, setAccountCodeOverrides] = useState<Record<string, string>>({});

  const hospitalNameFilterOptions = useMemo<HospitalOption[]>(
    () =>
      hospitals.map((h) => ({
        label: h.name,
        value: h.id,
        address: h.address,
        businessNumber: h.businessNumber,
      })),
    [hospitals],
  );

  const filtered = useMemo(() => {
    let list = hospitals;
    if (filterHospitalId) {
      list = list.filter((h) => h.id === filterHospitalId);
    }
    const fac = filterAccountCode.trim().toLowerCase();
    if (fac) {
      list = list.filter((h) => {
        const code = (accountCodeOverrides[h.id] ?? h.accountCode ?? '').toLowerCase();
        return code.includes(fac);
      });
    }
    const fbn = filterBusinessNumber.trim().replace(/[^\d]/g, '');
    if (fbn) {
      list = list.filter((h) => {
        const bn = (h.businessNumber ?? '').replace(/[^\d]/g, '');
        return bn.includes(fbn);
      });
    }
    const faddr = filterAddress.trim().toLowerCase();
    if (faddr) {
      list = list.filter((h) => (h.address ?? '').toLowerCase().includes(faddr));
    }
    const fk = filterKeyword.trim().toLowerCase();
    if (fk) {
      list = list.filter((h) => {
        const code = accountCodeOverrides[h.id] ?? h.accountCode ?? '';
        const parts = [
          h.name,
          code,
          h.businessNumber ?? '',
          h.address ?? '',
          h.phone ?? '',
          h.careNumber ?? '',
          h.representativeName ?? '',
          h.memo ?? '',
        ];
        return parts.some((v) => String(v).toLowerCase().includes(fk));
      });
    }
    return list;
  }, [
    hospitals,
    filterKeyword,
    filterHospitalId,
    filterAccountCode,
    filterBusinessNumber,
    filterAddress,
    accountCodeOverrides,
  ]);

  const getDisplayAccountCode = useCallback(
    (h: Hospital) => accountCodeOverrides[h.id] ?? h.accountCode ?? '',
    [accountCodeOverrides],
  );

  const isRowModified = useCallback(
    (h: Hospital) => {
      const current = (accountCodeOverrides[h.id] ?? h.accountCode ?? '').trim();
      const original = (h.accountCode ?? '').trim();
      return current !== original;
    },
    [accountCodeOverrides],
  );

  const modifiedIds = useMemo(
    () => filtered.filter((h) => isRowModified(h)).map((h) => h.id),
    [filtered, isRowModified],
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
      columnHelper.accessor('businessNumber', {
        header: '사업자번호',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('address', { header: '주소', cell: (info) => info.getValue() ?? '-' }),
    ],
    [columnHelper, getDisplayAccountCode, setAccountCodeFor],
  );

  const handleBusinessNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAddHospitalForm((prev) => ({
      ...prev,
      businessNumber: formatBusinessNumber(e.target.value),
    }));
  }, []);

  const handleFilterBusinessNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterBusinessNumber(formatBusinessNumber(e.target.value));
  }, []);

  const resetAddForm = useCallback(() => {
    setAddHospitalForm({ ...EMPTY_ADD_HOSPITAL_FORM });
    setAddError(null);
  }, []);

  const handleAdd = useCallback(() => {
    const name = addHospitalForm.name.trim();
    const businessNumber = addHospitalForm.businessNumber.trim();
    const address = addHospitalForm.address.trim();
    const phone = addHospitalForm.phone.trim();
    const careNumber = addHospitalForm.careNumber.trim();
    const representativeName = addHospitalForm.representativeName.trim();
    const corpId = corporations[0]?.id ?? 'corp-1';

    if (!name) {
      setAddError('병의원명을 입력하세요.');
      return;
    }
    if (!businessNumber) {
      setAddError('사업자번호를 입력하세요.');
      return;
    }
    if (!address) {
      setAddError('주소를 입력하세요.');
      return;
    }
    if (!phone) {
      setAddError('전화번호를 입력하세요.');
      return;
    }
    if (!careNumber) {
      setAddError('요양번호를 입력하세요.');
      return;
    }
    if (!representativeName) {
      setAddError('대표자명을 입력하세요.');
      return;
    }

    const exists = hospitals.some((h) => h.businessNumber === businessNumber);
    if (exists) {
      setAddError('이미 등록된 사업자번호입니다.');
      return;
    }

    setAddError(null);
    const hospital: Hospital = {
      id: `h-${Date.now()}`,
      name,
      corporationId: corpId,
      businessNumber,
      address,
      phone: phone || undefined,
      careNumber: careNumber || undefined,
      representativeName: representativeName || undefined,
      memo: addHospitalForm.memo.trim() || undefined,
    };
    addHospital(hospital);
    resetAddForm();
    alert(`${name}이(가) 추가되었습니다.`);
  }, [addHospitalForm, corporations, hospitals, addHospital, resetAddForm]);

  const addHospitalCard = canAddHospital && (
    <CardWrapper title="병의원 추가" className={s.rightCardLayout} padding={16}>
      <section>
        <div className={s.formField}>
          <label htmlFor="add-name">병의원명 *</label>
          <Input
            id="add-name"
            type="text"
            placeholder="병의원명 입력"
            value={addHospitalForm.name}
            onChange={(e) => setAddHospitalForm((p) => ({ ...p, name: e.target.value }))}
          />
        </div>
        <div className={s.formField}>
          <label htmlFor="add-business-number">사업자번호 *</label>
          <Input
            id="add-business-number"
            type="text"
            placeholder="000-00-00000"
            value={addHospitalForm.businessNumber}
            onChange={handleBusinessNumberChange}
            maxLength={12}
          />
        </div>
        <div className={s.formField}>
          <label htmlFor="add-address">주소 *</label>
          <Input
            id="add-address"
            type="text"
            placeholder="주소 입력"
            value={addHospitalForm.address}
            onChange={(e) => setAddHospitalForm((p) => ({ ...p, address: e.target.value }))}
          />
        </div>
        <div className={s.formField}>
          <label htmlFor="add-phone">전화번호 *</label>
          <Input
            id="add-phone"
            type="tel"
            placeholder="전화번호 입력"
            value={addHospitalForm.phone}
            onChange={(e) => setAddHospitalForm((p) => ({ ...p, phone: e.target.value }))}
          />
        </div>
        <div className={s.formField}>
          <label htmlFor="add-care-number">요양번호 *</label>
          <Input
            id="add-care-number"
            type="text"
            placeholder="요양번호 입력"
            value={addHospitalForm.careNumber}
            onChange={(e) => setAddHospitalForm((p) => ({ ...p, careNumber: e.target.value }))}
          />
        </div>
        <div className={s.formField}>
          <label htmlFor="add-representative">대표자명 *</label>
          <Input
            id="add-representative"
            type="text"
            placeholder="대표자명 입력"
            value={addHospitalForm.representativeName}
            onChange={(e) =>
              setAddHospitalForm((p) => ({ ...p, representativeName: e.target.value }))
            }
          />
        </div>
        <div className={s.formField}>
          <label htmlFor="add-memo">메모</label>
          <textarea
            id="add-memo"
            placeholder="메모 (선택)"
            value={addHospitalForm.memo}
            onChange={(e) => setAddHospitalForm((p) => ({ ...p, memo: e.target.value }))}
            rows={3}
            className={s.textarea}
          />
        </div>

        {addError && (
          <div className={s.errorBox}>
            {addError.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}

        <div className={s.formActions}>
          <Button variant="secondary" onClick={resetAddForm}>
            초기화
          </Button>
          <Button variant="primary" onClick={handleAdd}>
            추가
          </Button>
        </div>
      </section>
    </CardWrapper>
  );

  return (
    <div className={s.page}>
      <PageHeader
        title="병의원 관리"
        description={
          canAddHospital
            ? '병의원 목록을 조회하고 병의원을 등록합니다.'
            : '병의원 목록을 조회합니다.'
        }
      />
      <div className={s.layoutWrap}>
        <CardWrapper className={s.leftCardLayout} padding={0}>
          <div className={s.listWrap}>
            <div className={s.filterSection}>
              <div className={s.filterRow}>
                <div className={s.filterFieldKeyword}>
                  <label htmlFor="hospital-filter-keyword">통합 검색</label>
                  <Input
                    id="hospital-filter-keyword"
                    type="search"
                    placeholder="이름, 코드, 전화, 요양번호, 대표자, 메모 등"
                    value={filterKeyword}
                    onChange={(e) => setFilterKeyword(e.target.value)}
                    aria-label="병의원 통합 검색"
                  />
                </div>
                <div className={s.filterFieldHospital}>
                  <label htmlFor="hospital-filter-name">병의원명</label>
                  <HospitalSearchSelect
                    id="hospital-filter-name"
                    options={hospitalNameFilterOptions}
                    selected={filterHospitalId}
                    onChange={(v) => setFilterHospitalId(v === '' || v == null ? null : String(v))}
                    placeholder="병의원명 검색"
                    openOnFocus
                    aria-label="병의원명 필터"
                  />
                </div>
                <div className={s.filterField}>
                  <label htmlFor="hospital-filter-account">거래처코드</label>
                  <Input
                    id="hospital-filter-account"
                    type="search"
                    placeholder="포함 검색"
                    value={filterAccountCode}
                    onChange={(e) => setFilterAccountCode(e.target.value)}
                    aria-label="거래처코드 필터"
                  />
                </div>
                <div className={s.filterField}>
                  <label htmlFor="hospital-filter-biz">사업자번호</label>
                  <Input
                    id="hospital-filter-biz"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    placeholder="000-00-00000"
                    value={filterBusinessNumber}
                    onChange={handleFilterBusinessNumberChange}
                    maxLength={12}
                    aria-label="사업자번호 필터"
                  />
                </div>
                <div className={s.filterFieldAddress}>
                  <label htmlFor="hospital-filter-address">주소</label>
                  <Input
                    id="hospital-filter-address"
                    type="search"
                    placeholder="포함 검색"
                    value={filterAddress}
                    onChange={(e) => setFilterAddress(e.target.value)}
                    aria-label="주소 필터"
                  />
                </div>
              </div>
            </div>
            {modifiedIds.length > 0 && (
              <div className={s.saveBar}>
                <span className={s.saveBarText}>거래처코드 변경 {modifiedIds.length}건</span>
                <Button variant="primary" onClick={saveAllAccountCodes}>
                  저장
                </Button>
              </div>
            )}
            <DataTable<Hospital>
              columns={columns}
              data={filtered}
              getRowId={(h) => h.id}
              getRowClassName={(h) => (isRowModified(h) ? tableStyles.tableRowModified : undefined)}
            />
            {filtered.length === 0 && (
              <p className={s.emptyMessage}>조건에 맞는 병의원이 없습니다.</p>
            )}
          </div>
        </CardWrapper>
        {addHospitalCard}
      </div>
    </div>
  );
}
