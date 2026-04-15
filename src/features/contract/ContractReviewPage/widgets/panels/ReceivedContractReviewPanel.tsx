import { Check, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import type { GetContractRequestDetailResponse } from '@/types/services/contractService';
import * as s from './rightPanelShared.css';

type Props = {
  detail: GetContractRequestDetailResponse;
  previewUrl: string | null;
  onOpenPreview: () => void;
  onApprove: () => void;
  onReject: () => void;
};

export function ReceivedContractReviewPanel({
  detail,
  previewUrl,
  onOpenPreview,
  onApprove,
  onReject,
}: Props) {
  const { corporation, contract, documents } = detail;

  const submittedDocRows: { label: string; fileName: string | null }[] = [
    { label: '신고필증', fileName: documents.salesDeclarationCertificateFileName || null },
    { label: 'CSO교육이수증', fileName: documents.csoTraningCompletionCertificateFileName || null },
    { label: '사업자등록증', fileName: documents.businessRegistrationFileName || null },
    { label: '계약서', fileName: contract.contractFileName || null },
  ];

  return (
    <>
      <h3 className={s.previewTitle}>원본 파일 미리보기</h3>

      <div className={s.previewImageWrap}>
        {previewUrl ? (
          <img
            className={s.previewImage}
            src={previewUrl}
            alt={`${corporation.businessName ?? ''} 계약서 미리보기`}
            onClick={onOpenPreview}
            draggable={false}
          />
        ) : (
          <span className={s.previewPlaceholder}>미리보기를 불러오는 중…</span>
        )}
      </div>

      <p className={s.previewFileMeta}>{contract.contractFileName}</p>

      <div className={s.submittedDocsGrid}>
        {submittedDocRows.map((doc) => (
          <button
            key={doc.label}
            type="button"
            className={s.submittedDocRow}
            disabled={!doc.fileName}
            aria-label={doc.label}
            title={doc.fileName ?? `${doc.label} 미제출`}
          >
            <span className={s.submittedDocLabel}>{doc.label}</span>
          </button>
        ))}
      </div>

      <div className={s.kvBlock}>
        {corporation.businessName && (
          <div className={s.kvRow}>
            <span className={s.kvKey}>법인명</span>
            <span className={s.kvVal}>{corporation.businessName}</span>
          </div>
        )}
        {corporation.businessNumber && (
          <div className={s.kvRow}>
            <span className={s.kvKey}>사업자번호</span>
            <span className={s.kvVal}>{corporation.businessNumber}</span>
          </div>
        )}
        <div className={s.kvRow}>
          <span className={s.kvKey}>시작일</span>
          <span className={s.kvVal}>{contract.startDate}</span>
        </div>
        <div className={s.kvRow}>
          <span className={s.kvKey}>종료일</span>
          <span className={s.kvVal}>{contract.endDate}</span>
        </div>
      </div>

      <div className={s.actionRow}>
        <Button type="button" variant="primary" onClick={onApprove}>
          <Check size={16} aria-hidden />
          승인
        </Button>
        <Button type="button" variant="danger" onClick={onReject}>
          <X size={16} aria-hidden />
          반려
        </Button>
      </div>
    </>
  );
}
