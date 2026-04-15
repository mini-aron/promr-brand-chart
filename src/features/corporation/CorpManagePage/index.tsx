'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ClipboardCopy, Download, Mail, Pencil, Plus, Save, Upload, X } from 'lucide-react';
import { useApp } from '@/store/appStore';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import { Button } from '@/shared/components/ui/Button';
import { DataTable } from '@/shared/components/ui/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { CardWrapper, PageHeader } from '@/shared/components/layout';
import * as s from './index.css';
import type { CorpInvitation } from '@/types';
import { Input } from '@/shared/components/ui/Input';
import { Column, Row } from '@/shared/components/ui/Flex';
import * as tableStyles from '@/style/TableStyles.css';
import { formatBusinessNumber } from '@/utils';

const EXAMPLE_INVITE_CODE = 'INV-A1B2C3D4';
const EXAMPLE_INVITE_LINK = `https://propf.example.com/invite/${EXAMPLE_INVITE_CODE}`;

const columnHelper = createColumnHelper<CorpInvitation>();

function formatSubcontracting(v: boolean | undefined): string {
  if (v === true) return '예';
  if (v === false) return '아니오';
  return '-';
}

function isInviteCodeRowDirty(
  row: CorpInvitation,
  inviteCodeDraft: Record<string, string>,
): boolean {
  const d = inviteCodeDraft[row.id];
  return d !== undefined && d !== row.inviteCode;
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

export function CorpManagePage() {
  const { currentPharmaId } = useApp();
  const corporations = useDemoPlayStore((s) => s.corporations);
  const invitations = useDemoPlayStore((s) => s.corpInvitations);
  const setInvitations = useDemoPlayStore((s) => s.setCorpInvitations);
  const [mailSent, setMailSent] = useState(false);
  const [selectedInvitationId, setSelectedInvitationId] = useState<string | null>(null);
  /** 테이블에서 편집 중인 매핑코드 (저장 전까지 스토어에 반영하지 않음) */
  const [inviteCodeDraft, setInviteCodeDraft] = useState<Record<string, string>>({});
  const inviteCodeDraftRef = useRef(inviteCodeDraft);
  inviteCodeDraftRef.current = inviteCodeDraft;
  const [filterCorpName, setFilterCorpName] = useState('');
  const [filterBusinessNumber, setFilterBusinessNumber] = useState('');
  useEffect(() => {
    setInviteCodeDraft({});
  }, [currentPharmaId]);

  const pharmaInvitations = useMemo(
    () =>
      invitations
        .filter((inv) => inv.pharmaId === currentPharmaId)
        .sort((a, b) => b.invitedAt.localeCompare(a.invitedAt)),
    [invitations, currentPharmaId],
  );

  const getCorpName = useCallback(
    (corpId: string | undefined) => corporations.find((c) => c.id === corpId)?.name ?? '-',
    [corporations],
  );

  const getCorpBusinessRegNo = useCallback(
    (corpId: string | undefined) => corporations.find((c) => c.id === corpId)?.businessRegNo,
    [corporations],
  );

  const filteredInvitations = useMemo(() => {
    let list = pharmaInvitations;

    const fname = filterCorpName.trim().toLowerCase();
    if (fname) {
      list = list.filter((inv) => {
        const name = getCorpName(inv.corporationId);
        return name.toLowerCase().includes(fname);
      });
    }

    const fbn = filterBusinessNumber.trim().replace(/[^\d]/g, '');
    if (fbn) {
      list = list.filter((inv) => {
        const bizRaw = getCorpBusinessRegNo(inv.corporationId) ?? '';
        const bn = bizRaw.replace(/[^\d]/g, '');
        return bn.includes(fbn);
      });
    }

    return list;
  }, [pharmaInvitations, filterCorpName, filterBusinessNumber, getCorpName, getCorpBusinessRegNo]);

  const handleFilterBusinessNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterBusinessNumber(formatBusinessNumber(e.target.value));
  }, []);

  const selectedInvitation = useMemo(
    () =>
      selectedInvitationId
        ? filteredInvitations.find((inv) => inv.id === selectedInvitationId)
        : null,
    [selectedInvitationId, filteredInvitations],
  );

  const pendingInvitation = useMemo(
    () => pharmaInvitations.find((inv) => inv.status === 'pending'),
    [pharmaInvitations],
  );

  const displayLink = pendingInvitation ? EXAMPLE_INVITE_LINK : null;

  const hasMappingCodeDirty = useMemo(
    () =>
      pharmaInvitations.some((inv) => {
        const d = inviteCodeDraft[inv.id];
        return d !== undefined && d !== inv.inviteCode;
      }),
    [pharmaInvitations, inviteCodeDraft],
  );

  const hasUnsavedTableChanges = hasMappingCodeDirty;

  useEffect(() => {
    if (selectedInvitationId && !filteredInvitations.some((i) => i.id === selectedInvitationId)) {
      setSelectedInvitationId(null);
    }
  }, [filteredInvitations, selectedInvitationId]);

  const handleSendMail = useCallback((emails: string[]) => {
    const validEmails = emails.map((e) => e.trim()).filter(Boolean);
    if (validEmails.length === 0) {
      alert('이메일 주소를 입력하세요.');
      return;
    }
    // TODO: 초대 링크 메일 발송 API 연동
    setMailSent(true);
  }, []);

  const handleGenerateCode = useCallback(() => {
    setMailSent(false);
    const inv: CorpInvitation = {
      id: `inv-${Date.now()}`,
      pharmaId: currentPharmaId ?? '',
      inviteCode: EXAMPLE_INVITE_CODE,
      status: 'pending',
      invitedAt: new Date().toISOString().slice(0, 19),
    };
    setInvitations((prev) => {
      const withoutPending = prev.filter(
        (p) => !(p.pharmaId === currentPharmaId && p.status === 'pending'),
      );
      return [inv, ...withoutPending];
    });
  }, [currentPharmaId]);

  const setDraftInviteCode = useCallback((invitationId: string, nextInviteCode: string) => {
    setInviteCodeDraft((prev) => ({ ...prev, [invitationId]: nextInviteCode }));
  }, []);

  const focusNextInviteCodeInput = useCallback(
    (currentInvitationId: string) => {
      const idx = filteredInvitations.findIndex((i) => i.id === currentInvitationId);
      if (idx < 0 || idx >= filteredInvitations.length - 1) return;
      const nextId = filteredInvitations[idx + 1]!.id;
      document.getElementById(`corp-invite-code-${nextId}`)?.focus();
    },
    [filteredInvitations],
  );

  const handleSaveInviteCodes = useCallback(() => {
    const pharmaId = currentPharmaId ?? '';
    setInvitations((prev) =>
      prev.map((inv) => {
        if (inv.pharmaId !== pharmaId) return inv;
        let next: CorpInvitation = { ...inv };
        const code = inviteCodeDraft[inv.id];
        if (code !== undefined) {
          next = { ...next, inviteCode: code };
        }
        return next;
      }),
    );
    setInviteCodeDraft((prev) => {
      const next = { ...prev };
      for (const inv of pharmaInvitations) {
        delete next[inv.id];
      }
      return next;
    });
    alert('법인 매핑코드가 저장되었습니다.');
  }, [currentPharmaId, pharmaInvitations, inviteCodeDraft, setInvitations]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('inviteCode', {
        header: '법인 매핑코드',
        cell: (info) => {
          const row = info.row.original;
          const value = inviteCodeDraftRef.current[row.id] ?? row.inviteCode;
          return (
            <Input
              id={`corp-invite-code-${row.id}`}
              value={value}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => setDraftInviteCode(row.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                e.preventDefault();
                focusNextInviteCodeInput(row.id);
              }}
              className={s.inviteCodeTableInput}
              aria-label="법인 매핑코드 수정"
            />
          );
        },
      }),
      columnHelper.accessor((r) => r.corporationId && getCorpName(r.corporationId), {
        id: 'corporation',
        header: '법인명',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.display({
        id: 'businessRegNo',
        header: '사업자등록번호',
        cell: ({ row }) => {
          const corpId = row.original.corporationId;
          const no = getCorpBusinessRegNo(corpId);
          return no ?? '-';
        },
      }),
      columnHelper.accessor('invitedAt', {
        header: '초대일시',
        cell: (info) => formatDateTime(info.getValue()),
      }),
      columnHelper.accessor('invitedEmail', {
        header: '발송 이메일',
        cell: (info) => info.getValue() ?? '-',
      }),
    ],
    [getCorpName, getCorpBusinessRegNo, setDraftInviteCode, focusNextInviteCodeInput],
  );

  return (
    <div className={s.page}>
      <PageHeader
        title="법인 관리"
        description="초대 링크를 발급하여 법인을 초대하고, 초대된 법인 목록을 조회합니다."
      />

      <Row gap={8} className={s.headerActions}>
        <Button variant="secondary" size="small" type="button" className={s.headerActionBtn}>
          <Download size={16} aria-hidden />
          엑셀 양식 다운로드
        </Button>
        <Button variant="secondary" size="small" type="button" className={s.headerActionBtn}>
          <Upload size={16} aria-hidden />
          엑셀로 매핑코드 넣기
        </Button>
      </Row>

      <div className={s.layoutWrap}>
        <CardWrapper className={s.leftCardLayout} padding={0} fill>
          <div className={s.listWrap}>
            <div className={s.filterSection}>
              <div className={s.filterRow}>
                <div className={s.filterFieldCorpName}>
                  <label htmlFor="corp-filter-name">법인명</label>
                  <Input
                    id="corp-filter-name"
                    type="search"
                    placeholder="포함 검색"
                    value={filterCorpName}
                    onChange={(e) => setFilterCorpName(e.target.value)}
                    aria-label="법인명 필터"
                  />
                </div>
                <div className={s.filterField}>
                  <label htmlFor="corp-filter-biz">사업자번호</label>
                  <Input
                    id="corp-filter-biz"
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
              </div>
            </div>
            <div className={s.listToolbar}>
              <Button
                variant="primary"
                size="small"
                type="button"
                className={s.headerActionBtn}
                disabled={!hasUnsavedTableChanges}
                onClick={handleSaveInviteCodes}
              >
                <Save size={16} aria-hidden />
                저장
              </Button>
            </div>
            <DataTable<CorpInvitation>
              columns={columns}
              data={filteredInvitations}
              getRowId={(r) => r.id}
              onRowClick={(row) => setSelectedInvitationId(row.id)}
              getRowClassName={(row) => {
                const dirty = isInviteCodeRowDirty(row, inviteCodeDraft);
                const sel = row.id === selectedInvitationId;
                if (dirty && sel) return s.rowSelectedWithDirtyInvite;
                if (dirty) return s.rowInviteCodeDirty;
                if (sel) return s.rowSelected;
                return undefined;
              }}
              emptyMessage={
                pharmaInvitations.length === 0
                  ? '초대된 법인이 없습니다.'
                  : '조건에 맞는 항목이 없습니다.'
              }
            />
          </div>
        </CardWrapper>

        {selectedInvitation ? (
          <CorpDetailForm
            corporationId={selectedInvitation.corporationId}
            subcontractingLabel={formatSubcontracting(selectedInvitation.subcontracting)}
            onClose={() => setSelectedInvitationId(null)}
          />
        ) : (
          <InviteCodeForm
            displayLink={displayLink}
            mailSent={mailSent}
            onGenerateCode={handleGenerateCode}
            onSendMail={handleSendMail}
          />
        )}
      </div>
    </div>
  );
}

type InviteCodeFormProps = {
  displayLink: string | null;
  mailSent: boolean;
  onGenerateCode: () => void;
  onSendMail: (emails: string[]) => void;
};

function InviteCodeForm({
  displayLink,
  mailSent,
  onGenerateCode,
  onSendMail,
}: InviteCodeFormProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [sendEmailList, setSendEmailList] = useState<string[]>(['']);

  const handleCopy = useCallback(async () => {
    if (!displayLink) return;
    try {
      await navigator.clipboard.writeText(displayLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      alert('클립보드 복사에 실패했습니다.');
    }
  }, [displayLink]);

  const updateEmail = useCallback((index: number, value: string) => {
    setSendEmailList((prev) => prev.map((v, i) => (i === index ? value : v)));
  }, []);

  const addEmail = useCallback(() => {
    setSendEmailList((prev) => [...prev, '']);
  }, []);

  const removeEmail = useCallback((index: number) => {
    setSendEmailList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSendMail = useCallback(() => {
    onSendMail(sendEmailList);
  }, [onSendMail, sendEmailList]);

  const hasValidEmail = sendEmailList.some((e) => e.trim().length > 0);

  return (
    <CardWrapper title="법인 초대" className={s.rightPanelLayout} padding={16}>
      <p className={s.sectionDesc}>초대 링크를 생성하여 법인에 전달하세요.</p>

      {!displayLink ? (
        <Button variant="primary" className={s.addButtonFull} onClick={onGenerateCode}>
          초대 링크 생성
        </Button>
      ) : (
        <>
          <div className={s.inviteCodeBox}>
            <span className={s.inviteCodeLabel}>초대 링크</span>
            <Row gap={8}>
              <a
                href={displayLink}
                target="_blank"
                rel="noopener noreferrer"
                className={s.inviteLink}
              >
                {displayLink}
              </a>
              <button
                type="button"
                onClick={handleCopy}
                className={s.copyIconBtn}
                aria-label={copySuccess ? '복사됨' : '초대 링크 복사'}
                title="초대 링크 복사"
              >
                <ClipboardCopy size={18} aria-hidden />
              </button>
            </Row>
          </div>
          <Column gap={8}>
            <label className={s.emailSectionLabel}>초대링크 발송</label>
            <Column gap={8}>
              {sendEmailList.map((email, i) => (
                <Row key={i} gap={8}>
                  <Input
                    type="email"
                    placeholder="이메일 주소"
                    value={email}
                    onChange={(e) => updateEmail(i, e.target.value)}
                    className={s.emailInput}
                    aria-label={`초대 이메일 ${i + 1}`}
                  />
                  {sendEmailList.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeEmail(i)}
                      className={s.removeEmailBtn}
                      aria-label="이메일 제거"
                    >
                      <X size={18} aria-hidden />
                    </Button>
                  )}
                </Row>
              ))}
            </Column>
            <Button variant="ghost" size="small" onClick={addEmail} className={s.addButtonFull}>
              <Plus size={16} aria-hidden />
              이메일 추가
            </Button>
            <Button
              variant="primary"
              size="default"
              onClick={handleSendMail}
              disabled={!hasValidEmail}
              className={s.mailButton}
            >
              <Mail size={16} aria-hidden />
              {mailSent ? '발송됨' : '메일 발송'}
            </Button>
          </Column>
        </>
      )}
    </CardWrapper>
  );
}

type CorpDetailFormProps = {
  corporationId?: string;
  subcontractingLabel: string;
  onClose: () => void;
};

function CorpDetailForm({ corporationId, subcontractingLabel, onClose }: CorpDetailFormProps) {
  const corporations = useDemoPlayStore((s) => s.corporations);
  const corp = corporations.find((c) => c.id === corporationId);
  const additionalFeeRate = corp?.additionalFeeRate ?? 0;
  const tieredFeeTiers = corp?.tieredFeeTiers ?? [];

  return (
    <CardWrapper title="법인 상세" className={s.rightPanelLayout} padding={16}>
      <div className={s.detailHeader}>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="닫기">
          <X size={18} aria-hidden />
        </Button>
      </div>
      <Column gap={8}>
        <div className={s.formField}>
          <label htmlFor="corp-name">법인명</label>
          <Input
            id="corp-name"
            type="text"
            placeholder="법인명"
            value={corp?.name ?? '-'}
            disabled
          />
        </div>
        <div className={s.formField}>
          <label htmlFor="corp-bizno">사업자등록번호</label>
          <Input
            id="corp-bizno"
            type="text"
            placeholder="사업자등록번호"
            value={corp?.businessRegNo ?? '-'}
            disabled
          />
        </div>
        <div className={s.detailSection}>
          <div className={s.detailLabel}>재위탁 여부</div>
          <div className={s.detailValue}>{subcontractingLabel}</div>
        </div>
        <div className={s.detailSection}>
          <div className={s.detailLabel}>수수료</div>
          <div className={s.detailValue}>
            {additionalFeeRate !== 0
              ? `${additionalFeeRate > 0 ? '+' : ''}${additionalFeeRate}%`
              : '-'}
          </div>
        </div>
        <div className={s.detailSection}>
          <div className={s.detailLabel}>구간수수료</div>
          <div className={s.detailValue}>
            {tieredFeeTiers.length === 0 ? (
              '-'
            ) : (
              <div className={tableStyles.tableWrapPlain}>
                <table>
                  <thead>
                    <tr>
                      <th>구간 (만원)</th>
                      <th>수수료율</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tieredFeeTiers.map((tier, i) => (
                      <tr key={i}>
                        <td>
                          {tier.minAmount} ~ {tier.maxAmount}
                        </td>
                        <td>{tier.rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <Link href="/pharma/fees" className={s.feeManageLink}>
          <Pencil size={16} aria-hidden />
          수수료관리에서 수정
        </Link>
      </Column>
    </CardWrapper>
  );
}
