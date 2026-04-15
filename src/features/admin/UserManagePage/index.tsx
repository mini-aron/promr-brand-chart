'use client';

import { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { PageHeader } from '@/shared/components/layout/PageHeader/PageHeader';
import CardWrapper from '@/shared/components/layout/CardWrapper/CardWrapper';
import * as s from './index.css';
import { page } from '@/style/PageStyles.css';
import { DataTable } from '@/shared/components/ui/DataTable';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { SingleSelect } from '@/shared/components/ui/Select';
import { useDemoPlayStore } from '@/store/demoPlayStore';

type OrganizationType = 'pharma' | 'corporation';

type User = {
  id: string;
  name: string;
  email: string;
  organizationType: OrganizationType;
  organizationId: string;
  organizationName: string;
};

const columnHelper = createColumnHelper<User>();
const columns = [
  columnHelper.accessor('name', { header: '이름', cell: (info) => info.getValue() }),
  columnHelper.accessor('organizationType', {
    header: '구분',
    cell: (info) => {
      const v = info.getValue();
      if (v === 'pharma') return '제약사';
      if (v === 'corporation') return '법인';
      return '-';
    },
  }),
  columnHelper.accessor('organizationName', { header: '소속', cell: (info) => info.getValue() }),
];

const initialUsers: User[] = [];

export function UserManagePage() {
  const mockCorporations = useDemoPlayStore((s) => s.corporations);
  const mockPharmas = useDemoPlayStore((s) => s.pharmas);
  const [users] = useState<User[]>(initialUsers);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newOrgType, setNewOrgType] = useState<OrganizationType | ''>('');
  const [newOrgId, setNewOrgId] = useState('');

  const selectedUser = useMemo(
    () => users.find((u) => u.id === selectedUserId) ?? null,
    [users, selectedUserId],
  );

  const organizationOptions =
    newOrgType === 'pharma' ? mockPharmas : newOrgType === 'corporation' ? mockCorporations : [];

  const selectedOrgLabel =
    newOrgType === 'pharma' ? '제약사' : newOrgType === 'corporation' ? '법인' : '소속';

  const selectedUserOrgTypeLabel =
    selectedUser?.organizationType === 'pharma'
      ? '제약사'
      : selectedUser?.organizationType === 'corporation'
        ? '법인'
        : '-';

  const orgTypeOptions = useMemo(
    () => [
      { label: '선택', value: '' as const },
      { label: '제약사', value: 'pharma' as const },
      { label: '법인', value: 'corporation' as const },
    ],
    [],
  );

  const orgIdOptions = useMemo(
    () => [
      { label: '선택', value: '' },
      ...organizationOptions.map((o) => ({ label: o.name, value: o.id })),
    ],
    [organizationOptions],
  );

  return (
    <div className={page}>
      <PageHeader title="사용자 관리" description="사용자 목록을 조회하고 사용자를 추가합니다." />

      <div className={s.layoutWrap}>
        <CardWrapper className={s.leftCardLayout} padding={0}>
          <div className={s.listWrap}>
            <DataTable<User>
              data={users}
              columns={columns}
              getRowId={(row) => row.id}
              onRowClick={(row) => setSelectedUserId(row.id)}
              getRowClassName={(row) => (row.id === selectedUserId ? s.rowSelected : undefined)}
              emptyMessage="등록된 사용자가 없습니다."
            />
          </div>
        </CardWrapper>

        <div className={s.rightCardLayout}>
          <CardWrapper title="유저 생성" className={s.rightCardItem} padding={16}>
            <div className={s.formField}>
              <label htmlFor="user-new-name">이름</label>
              <Input
                id="user-new-name"
                type="text"
                placeholder="이름 입력"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className={s.formField}>
              <label htmlFor="user-new-email">이메일</label>
              <Input
                id="user-new-email"
                type="email"
                placeholder="이메일 입력"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div className={s.formField}>
              <label htmlFor="user-org-type">소속 구분</label>
              <div className={s.selectWrap}>
                <SingleSelect
                  id="user-org-type"
                  aria-label="소속 구분"
                  placeholder="선택"
                  options={orgTypeOptions}
                  selected={newOrgType === '' ? '' : newOrgType}
                  onChange={(v) => {
                    const value = v === '' ? '' : (v as OrganizationType);
                    setNewOrgType(value);
                    setNewOrgId('');
                  }}
                />
              </div>
            </div>
            {newOrgType && (
              <div className={s.formField}>
                <label htmlFor="user-org-id">{selectedOrgLabel}</label>
                <div className={s.selectWrap}>
                  <SingleSelect
                    id="user-org-id"
                    aria-label={selectedOrgLabel}
                    placeholder="선택"
                    options={orgIdOptions}
                    selected={newOrgId}
                    onChange={(v) => setNewOrgId(v === '' ? '' : String(v))}
                  />
                </div>
              </div>
            )}
            <Button type="button">추가</Button>
          </CardWrapper>

          <CardWrapper title="상세" className={s.rightCardItem} padding={16}>
            {selectedUser ? (
              <>
                <div className={s.formField}>
                  <label htmlFor="user-detail-name">이름</label>
                  <Input id="user-detail-name" type="text" value={selectedUser.name} readOnly />
                </div>
                <div className={s.formField}>
                  <label htmlFor="user-detail-email">이메일</label>
                  <Input id="user-detail-email" type="email" value={selectedUser.email} readOnly />
                </div>
                <div className={s.formField}>
                  <label htmlFor="user-detail-org-type">소속 구분</label>
                  <Input
                    id="user-detail-org-type"
                    type="text"
                    value={selectedUserOrgTypeLabel}
                    readOnly
                  />
                </div>
                <div className={s.formField}>
                  <label htmlFor="user-detail-org">소속</label>
                  <Input
                    id="user-detail-org"
                    type="text"
                    value={selectedUser.organizationName}
                    readOnly
                  />
                </div>
                <Button type="button" variant="secondary">
                  수정
                </Button>
              </>
            ) : (
              <p style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                목록에서 사용자를 선택하면 상세 정보가 표시됩니다.
              </p>
            )}
          </CardWrapper>
        </div>
      </div>
    </div>
  );
}
