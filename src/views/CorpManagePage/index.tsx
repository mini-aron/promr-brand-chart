import { useCallback, useMemo, useState } from "react";
import { HiOutlineClipboardCopy, HiOutlineMail, HiOutlinePlus, HiOutlineX } from "react-icons/hi";
import { useApp } from "@/store/appStore";
import { mockCorporations, mockCorpInvitations } from "@/store/mockData";
import { Button } from "@/components/Common/Button";
import { DataTable } from "@/components/Common/DataTable";
import { createColumnHelper } from "@tanstack/react-table";
import * as s from "./index.css";
import type { CorpInvitation } from "@/types";
import { Input } from "@/components/Common/Input";
import { Column, Row } from "@/components/Common/Flex";

type StatusStyles = { statusAccepted: string; statusPending: string };

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "INV-";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

const STATUS_LABEL: Record<string, string> = {
  pending: "대기",
  accepted: "가입완료",
};

export function CorpManagePage() {
  const { currentPharmaId } = useApp();
  const corporations = mockCorporations;
  const [invitations, setInvitations] =
    useState<CorpInvitation[]>(mockCorpInvitations);
  const [mailSent, setMailSent] = useState(false);

  const filteredInvitations = useMemo(
    () =>
      invitations
        .filter((inv) => inv.pharmaId === currentPharmaId)
        .sort((a, b) => b.invitedAt.localeCompare(a.invitedAt)),
    [invitations, currentPharmaId],
  );

  const pendingInvitation = useMemo(
    () => filteredInvitations.find((inv) => inv.status === "pending"),
    [filteredInvitations],
  );

  const displayCode = pendingInvitation?.inviteCode ?? null;

  const getCorpName = useCallback(
    (corpId: string | undefined) =>
      corporations.find((c) => c.id === corpId)?.name ?? "-",
    [corporations],
  );

  const handleSendMail = useCallback(
    (emails: string[]) => {
      if (!displayCode) return;
      const validEmails = emails.map((e) => e.trim()).filter(Boolean);
      if (validEmails.length === 0) {
        alert("이메일 주소를 입력하세요.");
        return;
      }
      const mailto = `mailto:${validEmails.join(",")}?subject=${encodeURIComponent("PROPF 법인 초대 링크")}&body=${encodeURIComponent(`안녕하세요.\n\n아래 초대 링크로 PROPF에 가입해 주세요.\n\n초대 링크: ${displayCode}`)}`;
      window.location.href = mailto;
      setMailSent(true);
    },
    [displayCode],
  );

  const handleGenerateCode = useCallback(() => {
    const code = generateInviteCode();
    setMailSent(false);
    const inv: CorpInvitation = {
      id: `inv-${Date.now()}`,
      pharmaId: currentPharmaId ?? "",
      inviteCode: code,
      status: "pending",
      invitedAt: new Date().toISOString().slice(0, 19),
    };
    setInvitations((prev) => {
      const withoutPending = prev.filter(
        (p) => !(p.pharmaId === currentPharmaId && p.status === "pending"),
      );
      return [inv, ...withoutPending];
    });
  }, [currentPharmaId]);

  const columnHelper = createColumnHelper<CorpInvitation>();
  const columns = useMemo(
    () => [
      columnHelper.accessor("status", {
        header: "상태",
        cell: (info) => {
          const styles = s as StatusStyles;
          return (
            <span
              className={
                info.getValue() === "accepted"
                  ? styles.statusAccepted
                  : styles.statusPending
              }
            >
              {STATUS_LABEL[info.getValue()] ?? info.getValue()}
            </span>
          );
        },
      }),
      columnHelper.accessor(
        (r) => r.corporationId && getCorpName(r.corporationId),
        {
          id: "corporation",
          header: "법인명",
          cell: (info) => info.getValue() ?? "-",
        },
      ),
      columnHelper.accessor("invitedAt", {
        header: "초대일시",
        cell: (info) => formatDateTime(info.getValue()),
      }),
      columnHelper.accessor("invitedEmail", {
        header: "발송 이메일",
        cell: (info) => info.getValue() ?? "-",
      }),
    ],
    [columnHelper, getCorpName],
  );

  return (
    <div className={s.page}>
      <header className="page-header">
        <h1>법인 관리</h1>
        <p>
          초대 링크를 발급하여 법인을 초대하고, 초대된 법인 목록을 조회합니다.
        </p>
      </header>

      <div className={s.layoutWrap}>
        <div className={s.leftCard}>
          <div className={s.listWrap}>
            <DataTable<CorpInvitation>
              columns={columns}
              data={filteredInvitations}
              getRowId={(r) => r.id}
              emptyMessage={
                filteredInvitations.length === 0
                  ? "초대된 법인이 없습니다."
                  : "조건에 맞는 항목이 없습니다."
              }
            />
          </div>
        </div>

        <InviteCodeForm
          displayCode={displayCode}
          mailSent={mailSent}
          onGenerateCode={handleGenerateCode}
          onSendMail={handleSendMail}
        />
      </div>
    </div>
  );
}

type InviteCodeFormProps = {
  displayCode: string | null;
  mailSent: boolean;
  onGenerateCode: () => void;
  onSendMail: (emails: string[]) => void;
};

function InviteCodeForm({
  displayCode,
  mailSent,
  onGenerateCode,
  onSendMail,
}: InviteCodeFormProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [sendEmailList, setSendEmailList] = useState<string[]>([""]);

  const handleCopy = useCallback(async () => {
    if (!displayCode) return;
    try {
      await navigator.clipboard.writeText(displayCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      alert("클립보드 복사에 실패했습니다.");
    }
  }, [displayCode]);

  const updateEmail = useCallback((index: number, value: string) => {
    setSendEmailList((prev) =>
      prev.map((v, i) => (i === index ? value : v)),
    );
  }, []);

  const addEmail = useCallback(() => {
    setSendEmailList((prev) => [...prev, ""]);
  }, []);

  const removeEmail = useCallback((index: number) => {
    setSendEmailList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSendMail = useCallback(() => {
    onSendMail(sendEmailList);
  }, [onSendMail, sendEmailList]);

  const hasValidEmail = sendEmailList.some((e) => e.trim().length > 0);

  return (
    <aside className={s.rightPanel}>
      <h3 className={s.sectionTitle}>법인 초대</h3>
      <p className={s.sectionDesc}>초대 링크를 생성하여 법인에 전달하세요.</p>

      {!displayCode ? (
        <Button
          variant="primary"
          className={s.addButtonFull}
          onClick={onGenerateCode}
        >
          초대 링크 생성
        </Button>
      ) : (
        <>
          <div className={s.inviteCodeBox}>
            <span className={s.inviteCodeLabel}>초대 링크</span>
            <Row gap={8}>
              <code className={s.inviteCode}>{displayCode}</code>
              <button
                type="button"
                onClick={handleCopy}
                className={s.copyIconBtn}
                aria-label={copySuccess ? "복사됨" : "초대 링크 복사"}
                title="초대 링크 복사"
              >
                <HiOutlineClipboardCopy size={18} />
              </button>
            </Row>
          </div>
          <Column gap={8}>
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
                      <HiOutlineX size={18} />
                    </Button>
                  )}
                </Row>
              ))}
            </Column>
            <Button
              variant="ghost"
              size="small"
              onClick={addEmail}
              className={s.addButtonFull}
            >
              <HiOutlinePlus size={16} />
              이메일 추가
            </Button>
            <Button
              variant="primary"
              size="default"
              onClick={handleSendMail}
              disabled={!hasValidEmail}
              className={s.mailButton}
            >
              <HiOutlineMail size={16} />
              {mailSent ? "발송됨" : "메일 발송"}
            </Button>
          </Column>
        </>
      )}
    </aside>
  );
}

function CorpDetailForm() {
  return (
    <aside className={s.rightPanel}>
      <h3 className={s.sectionTitle}>상세</h3>
  
    </aside>
  )
}
