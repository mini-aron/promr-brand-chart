import { AlertCircle, Mail, Sparkles } from 'lucide-react';
import { Column } from '@/shared/components/ui/Flex';
import * as s from './ContractReviewDashboard.css';

type Props = {
  needReview: number;
  todayReceived: number;
  newCount: number;
};

export function ContractReviewDashboard({ needReview, todayReceived, newCount }: Props) {
  return (
    <div className={s.dashboardRow}>
      <div className={s.statCard}>
        <div className={s.statCardIconWrap.review}>
          <AlertCircle size={18} aria-hidden />
        </div>
        <Column gap={0}>
          <span className={s.statCardValue}>{needReview}</span>
          <span className={s.statCardLabel}>검토필요</span>
        </Column>
      </div>
      <div className={s.statCard}>
        <div className={s.statCardIconWrap.today}>
          <Mail size={18} aria-hidden />
        </div>
        <Column gap={0}>
          <span className={s.statCardValue}>{todayReceived}</span>
          <span className={s.statCardLabel}>오늘 수신</span>
        </Column>
      </div>
      <div className={s.statCard}>
        <div className={s.statCardIconWrap.new}>
          <Sparkles size={18} aria-hidden />
        </div>
        <Column gap={0}>
          <span className={s.statCardValue}>{newCount}</span>
          <span className={s.statCardLabel}>신규</span>
        </Column>
      </div>
    </div>
  );
}
