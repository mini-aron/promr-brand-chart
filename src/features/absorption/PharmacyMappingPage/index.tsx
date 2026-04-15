'use client';

import { useCallback, useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { PageHeader } from '@/shared/components/layout';
import { Input } from '@/shared/components/ui/Input';
import { DataTable } from '@/shared/components/ui/DataTable';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import type { Pharmacy } from '@/types';
import * as s from './index.css';

export function PharmacyMappingPage() {
  const mockPharmacies = useDemoPlayStore((s) => s.pharmacies);
  const [mappingNoOverrides, setMappingNoOverrides] = useState<Record<string, string>>({});
  const [filterName, setFilterName] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [filterRep, setFilterRep] = useState('');
  const [filterBizNo, setFilterBizNo] = useState('');

  const getMappingNo = useCallback(
    (p: Pharmacy) => mappingNoOverrides[p.id] ?? p.mappingNo ?? '-',
    [mappingNoOverrides],
  );

  const setMappingNoFor = useCallback((pharmacyId: string, value: string) => {
    setMappingNoOverrides((prev) => ({ ...prev, [pharmacyId]: value }));
  }, []);

  const columns = useMemo(() => {
    const helper = createColumnHelper<Pharmacy>();
    return [
      helper.display({
        id: 'mappingNo',
        header: '매핑번호',
        size: 120,
        cell: (info) => {
          const p = info.row.original;
          return (
            <input
              type="text"
              value={getMappingNo(p)}
              onChange={(e) => setMappingNoFor(p.id, e.target.value)}
              placeholder="-"
              className={s.mappingNoInput}
              aria-label={`${p.name} 매핑번호`}
            />
          );
        },
      }),
      helper.accessor('name', { id: 'name', header: '약국명', size: 140 }),
      helper.accessor((r) => r.address ?? '-', { id: 'address', header: '주소' }),
      helper.accessor((r) => r.representativeName ?? '-', {
        id: 'representativeName',
        header: '대표자명',
        size: 100,
      }),
      helper.accessor((r) => r.businessNumber ?? '-', {
        id: 'businessNumber',
        header: '사업자번호',
        size: 130,
      }),
    ];
  }, [getMappingNo, setMappingNoFor]);

  return (
    <div className={s.page}>
      <PageHeader title="문전약국 매핑" description="문전약국과 병의원 매핑을 관리합니다." />
      <div className={s.content}>
        <div className={s.filterSection}>
          <div className={s.filterRow}>
            <div className={s.filterField}>
              <label htmlFor="filter-name">약국명</label>
              <Input
                id="filter-name"
                size="large"
                type="search"
                placeholder="약국명 검색"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </div>
            <div className={s.filterField}>
              <label htmlFor="filter-address">주소</label>
              <Input
                id="filter-address"
                size="large"
                type="search"
                placeholder="주소 검색"
                value={filterAddress}
                onChange={(e) => setFilterAddress(e.target.value)}
              />
            </div>
            <div className={s.filterField}>
              <label htmlFor="filter-rep">대표자명</label>
              <Input
                id="filter-rep"
                size="large"
                type="search"
                placeholder="대표자명 검색"
                value={filterRep}
                onChange={(e) => setFilterRep(e.target.value)}
              />
            </div>
            <div className={s.filterField}>
              <label htmlFor="filter-bizno">사업자번호</label>
              <Input
                id="filter-bizno"
                size="large"
                type="search"
                placeholder="사업자번호 검색"
                value={filterBizNo}
                onChange={(e) => setFilterBizNo(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className={s.tableWrap}>
          <DataTable<Pharmacy>
            columns={columns}
            data={mockPharmacies}
            getRowId={(row) => row.id}
            emptyMessage="등록된 문전약국이 없습니다."
          />
        </div>
      </div>
    </div>
  );
}
