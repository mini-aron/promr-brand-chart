'use client';

import { useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { PageHeader } from '@/shared/components/layout/PageHeader/PageHeader';
import CardWrapper from '@/shared/components/layout/CardWrapper/CardWrapper';
import { page } from '@/style/PageStyles.css';
import * as s from './index.css';
import { DataTable } from '@/shared/components/ui/DataTable/DataTable';
import { Button } from '@/shared/components/ui/Button';

type Corporation = {
  id: string;
  name: string;
  email: string;
  businessNumber: string;
  businessLicense: string;
};

const columnHelper = createColumnHelper<Corporation>();
const columns = [
  columnHelper.accessor('name', { header: '법인명', cell: (info) => info.getValue() }),
  columnHelper.accessor('email', { header: '이메일', cell: (info) => info.getValue() }),
  columnHelper.accessor('businessNumber', {
    header: '사업자번호',
    cell: (info) => info.getValue(),
  }),
];

const initialCorps: Corporation[] = [];

export function AdminCorpManagePage() {
  const [corps] = useState<Corporation[]>(initialCorps);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newBusinessNumber, setNewBusinessNumber] = useState('');
  const [newBusinessLicense, setNewBusinessLicense] = useState('');

  return (
    <div className={page}>
      <PageHeader title="법인 관리" description="법인 목록을 조회하고 법인을 등록·수정합니다." />

      <div className={s.layoutWrap}>
        <CardWrapper className={s.leftCardLayout} padding={0}>
          <div className={s.listWrap}>
            <DataTable<Corporation>
              data={corps}
              columns={columns}
              getRowId={(row) => row.id}
              emptyMessage="등록된 법인이 없습니다."
            />
          </div>
        </CardWrapper>

        <CardWrapper title="법인 생성" className={s.rightCardLayout} padding={16}>
          <div className={s.formField}>
            <label>법인명</label>
            <input
              type="text"
              placeholder="법인명 입력"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className={s.formField}>
            <label>이메일</label>
            <input
              type="email"
              placeholder="이메일 입력"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>
          <div className={s.formField}>
            <label>사업자번호</label>
            <input
              type="text"
              placeholder="사업자번호 입력"
              value={newBusinessNumber}
              onChange={(e) => setNewBusinessNumber(e.target.value)}
            />
          </div>
          <div className={s.formField}>
            <label>사업자등록증</label>
            <input
              type="file"
              onChange={(e) =>
                setNewBusinessLicense(
                  e.target.files && e.target.files[0] ? e.target.files[0].name : '',
                )
              }
            />
            {newBusinessLicense && (
              <p style={{ fontSize: 12, color: 'var(--color-text-muted)', marginTop: 4 }}>
                선택된 파일: {newBusinessLicense}
              </p>
            )}
          </div>
          <Button type="button">추가</Button>
        </CardWrapper>
      </div>
    </div>
  );
}
