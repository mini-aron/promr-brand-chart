import { Check, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import type {
  GetContractRequestDetailResponse,
  GetReEntrusContractDetailResponse,
} from '@/types/services/contractService';
import { ReceivedContractReviewPanel } from './ReceivedContractReviewPanel';
import { ReentrustReviewPanel } from './ReentrustReviewPanel';
import * as s from './rightPanelShared.css';

type Props = {
  isReentrustView: boolean;
  contractDetail: GetContractRequestDetailResponse | undefined;
  reEntrustDetail: GetReEntrusContractDetailResponse | undefined;
  previewUrl: string | null;
  onOpenPreview: () => void;
  onApprove: () => void;
  onReject: () => void;
};

export function ContractReviewRightPanel({
  isReentrustView,
  contractDetail,
  reEntrustDetail,
  previewUrl,
  onOpenPreview,
  onApprove,
  onReject,
}: Props) {
  if (isReentrustView && reEntrustDetail) {
    return (
      <ReentrustReviewPanel
        detail={reEntrustDetail}
        previewUrl={previewUrl}
        onOpenPreview={onOpenPreview}
      />
    );
  }

  if (!isReentrustView && contractDetail) {
    return (
      <ReceivedContractReviewPanel
        detail={contractDetail}
        previewUrl={previewUrl}
        onOpenPreview={onOpenPreview}
        onApprove={onApprove}
        onReject={onReject}
      />
    );
  }

  return (
    <>
      <h3 className={s.previewTitle}>{isReentrustView ? '재위탁 확인' : '계약서 확인'}</h3>
      <div className={s.previewEmptyBox}>
        <span className={s.previewPlaceholder}>목록에서 항목을 선택하세요.</span>
      </div>
      <div className={s.actionRow}>
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
