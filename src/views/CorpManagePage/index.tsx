'use client';

import { useCallback, useMemo, useState } from 'react';
import { HiOutlineClipboardCopy, HiOutlineMail } from 'react-icons/hi';
import { useApp } from '@/store/appStore';
import { mockCorporations, mockCorpInvitations } from '@/store/mockData';
import { Button } from '@/components/Common/Button';
import { DataTable } from '@/components/Common/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import * as s from './index.css';
import type { CorpInvitation } from '@/types';

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'INV-';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

const STATUS_LABEL: Record<string, string> = {
  pending: '대기',
  accepted: '가입완료',
};

export function CorpManagePage() {
  const { currentPharmaId } = useApp();
  const corporations = mockCorporations;
  const [invitations, setInvitations] = useState<CorpInvitation[]>(mockCorpInvitations);
  const [newInviteCode, setNewInviteCode] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [mailSent, setMailSent] = useState(false);

  const filteredInvitations = useMemo(
    () =>
      invitations
        .filter((inv) => inv.pharmaId === currentPharmaId)
        .sort((a, b) => b.invitedAt.localeCompare(a.invitedAt)),
    [invitations, currentPharmaId]
  );

  const pendingInvitation = useMemo(
    () => filteredInvitations.find((inv) => inv.status === 'pending'),
    [filteredInvitations]
  );

  const displayCode = newInviteCode ?? pendingInvitation?.inviteCode ?? null;

  const getCorpName = useCallback(
    (corpId: string | undefined) => corporations.find((c) => c.id === corpId)?.name ?? '-',
    [corporations]
  );

  const handleGenerateCode = useCallback(() => {
    const code = generateInviteCode();
    setNewInviteCode(code);
    setInviteEmail('');
    setCopySuccess(false);
    setMailSent(false);

    const inv: CorpInvitation = {
      id: `inv-${Date.now()}`,
      pharmaId: currentPharmaId,
      inviteCode: code,
      status: 'pending',
      invitedAt: new Date().toISOString().slice(0, 19),
    };
    setInvitations((prev) => {
      const withoutPending = prev.filter((p) => !(p.pharmaId === currentPharmaId && p.status === 'pending'));
      return [inv, ...withoutPending];
    });
  }, [currentPharmaId]);

  const handleCopy = useCallback(async () => {
    if (!displayCode) return;
    try {
      await navigator.clipboard.writeText(displayCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      alert('클립보드 복사에 실패했습니다.');
    }
  }, [displayCode]);

  const handleSendMail = useCallback(() => {
    if (!displayCode) return;
    const email = inviteEmail.trim();
    if (!email) {
      alert('이메일 주소를 입력하세요.');
      return;
    }
    const mailto = `mailto:${email}?subject=${encodeURIComponent('PROPF 법인 초대코드')}&body=${encodeURIComponent(`안녕하세요.\n\n아래 초대코드로 PROPF에 가입해 주세요.\n\n초대코드: ${displayCode}`)}`;
    window.location.href = mailto;
    setMailSent(true);
  }, [displayCode, inviteEmail]);

  const columnHelper = createColumnHelper<CorpInvitation>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('status', {
        header: '상태',
        cell: (info) => (
          <span className={info.getValue() === 'accepted' ? s.statusAccepted : s.statusPending}>
            {STATUS_LABEL[info.getValue()] ?? info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor(
        (r) => r.corporationId && getCorpName(r.corporationId),
        { id: 'corporation', header: '법인명', cell: (info) => info.getValue() ?? '-' }
      ),
      columnHelper.accessor('invitedAt', {
        header: '초대일시',
        cell: (info) => formatDateTime(info.getValue()),
      }),
      columnHelper.accessor('invitedEmail', {
        header: '발송 이메일',
        cell: (info) => info.getValue() ?? '-',
      }),
    ],
    [columnHelper, getCorpName]
  );

  return (
    <div className={s.page}>
      <header className="page-header">
        <h1>법인 관리</h1>
        <p>초대코드를 발급하여 법인을 초대하고, 초대된 법인 목록을 조회합니다.</p>
      </header>

      <div className={s.layoutWrap}>
        <div className={s.leftCard}>
          <div className={s.listWrap}>
            <DataTable<CorpInvitation>
              columns={columns}
              data={filteredInvitations}
              getRowId={(r) => r.id}
              emptyMessage={filteredInvitations.length === 0 ? '초대된 법인이 없습니다.' : '조건에 맞는 항목이 없습니다.'}
            />
          </div>
        </div>

        <aside className={s.rightPanel}>
          <h3 className={s.sectionTitle}>법인 초대</h3>
          <p className={s.sectionDesc}>초대코드를 생성하여 법인에 전달하세요.</p>

          {!displayCode ? (
            <Button variant="primary" className={s.addButtonFull} onClick={handleGenerateCode}>
              초대코드 생성
            </Button>
          ) : (
            <>
              <div className={s.inviteCodeBox}>
                <span className={s.inviteCodeLabel}>초대코드</span>
                <code className={s.inviteCode}>{displayCode}</code>
              </div>
              <div className={s.inviteActions}>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleCopy}
                  className={s.actionButton}
                >
                  <HiOutlineClipboardCopy size={16} />
                  {copySuccess ? '복사됨' : '클립보드 복사'}
                </Button>
                <div className={s.mailRow}>
                  <input
                    type="email"
                    placeholder="이메일 주소"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className={s.emailInput}
                    aria-label="초대 이메일"
                  />
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleSendMail}
                    disabled={!inviteEmail.trim()}
                    className={s.mailButton}
                  >
                    <HiOutlineMail size={16} />
                    {mailSent ? '발송됨' : '메일 발송'}
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="small"
                onClick={handleGenerateCode}
                className={s.resetLink}
              >
                새 초대코드 생성
              </Button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
