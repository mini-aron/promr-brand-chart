import { Check, GitBranch, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import type { GetReEntrusContractDetailResponse } from '@/types/services/contractService';
import { CONTRACT_STATUS_LABEL } from '../../lib/constants';
import * as b from '../../contractReviewBadges.css';
import * as s from './reentrustReviewPanel.css';
import { actionRow, previewImageWrap, previewImage, previewFileMeta, previewPlaceholder } from './rightPanelShared.css';

type Props = {
  detail: GetReEntrusContractDetailResponse;
  previewUrl: string | null;
  onOpenPreview: () => void;
};

function reentrustNodeStatusClass(status: GetReEntrusContractDetailResponse['contractStatus']): string {
  if (status === 'APPROVED') return b.reentrustStatusBadge.complete;
  if (status === 'REJECTED') return b.reentrustStatusBadge.error;
  return b.reentrustStatusBadge.warning;
}

export function ReentrustReviewPanel({ detail, previewUrl, onOpenPreview }: Props) {
  const submittedDocRows: { label: string; fileName: string | null }[] = [
    { label: '신고필증', fileName: detail.documents.salesDeclarationCertificateFileName || null },
    { label: 'CSO교육이수증', fileName: detail.documents.csoTraningCompletionCertificateFileName || null },
    { label: '사업자등록증', fileName: detail.documents.businessRegistrationFileName || null },
    { label: '재위탁계약서', fileName: detail.reEntrustContractFileName || null },
  ];

  return (
    <>
      <h3 className={s.reentrustSectionTitle}>재위탁 확인</h3>
      <div className={s.reentrustDetailHeader}>
        <div className={s.reentrustDetailHeaderIcon}>
          {detail.depth > 0 ? (
            <span className={s.reentrustTierBadge}>{detail.depth}차</span>
          ) : (
            <GitBranch size={22} strokeWidth={1.75} aria-hidden />
          )}
        </div>
        <div className={s.reentrustDetailHeaderText}>
          <h4 className={s.reentrustDetailTitle}>{detail.corporationName}</h4>
          <span className={reentrustNodeStatusClass(detail.contractStatus)}>
            {CONTRACT_STATUS_LABEL[detail.contractStatus]}
          </span>
        </div>
      </div>

      <div className={s.reentrustDetailTable}>
        <div className={s.reentrustDetailRow}>
          <span className={s.reentrustDetailKey}>시작일</span>
          <span className={s.reentrustDetailVal}>{detail.startDate}</span>
        </div>
        <div className={s.reentrustDetailRow}>
          <span className={s.reentrustDetailKey}>종료일</span>
          <span className={s.reentrustDetailVal}>{detail.expireDate}</span>
        </div>
      </div>

      <div className={s.reentrustDocSection}>
        <h4 className={s.reentrustSubTitle}>제출 서류</h4>
        <div className={s.reentrustDocMenuRow}>
          {submittedDocRows.map((doc) => (
            <span
              key={doc.label}
              className={s.reentrustSingleDocPill}
              style={{ opacity: doc.fileName ? 1 : 0.4 }}
              title={doc.fileName ?? `${doc.label} 미제출`}
            >
              {doc.label}
            </span>
          ))}
        </div>
      </div>

      <div className={s.reentrustDocPreviewPanel}>
        <div className={s.reentrustDocPreviewTitleRow}>
          <span className={s.reentrustDocPreviewTitle}>재위탁계약서 미리보기</span>
        </div>
        <div className={previewImageWrap}>
          {previewUrl ? (
            <img
              className={previewImage}
              src={previewUrl}
              alt={`${detail.corporationName} 재위탁계약서 미리보기`}
              onClick={onOpenPreview}
              draggable={false}
            />
          ) : (
            <span className={previewPlaceholder}>미리보기를 불러오는 중…</span>
          )}
        </div>
        <p className={previewFileMeta}>{detail.reEntrustContractFileName}</p>
      </div>

      <div className={actionRow}>
        <Button type="button" variant="primary" disabled>
          <Check size={16} aria-hidden />
          승인
        </Button>
        <Button type="button" variant="danger" disabled>
          <X size={16} aria-hidden />
          반려
        </Button>
      </div>
    </>
  );
}
