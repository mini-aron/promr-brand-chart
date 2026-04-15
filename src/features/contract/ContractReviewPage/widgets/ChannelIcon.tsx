import { Link2, Mail, MessageCircle } from 'lucide-react';
import type { ContractReviewChannel } from '../types';
import { listItemIcon } from './list/ContractReviewListSection.css';

export function ChannelIcon({ channel }: { channel: ContractReviewChannel }) {
  const className = listItemIcon;
  const size = 18;
  switch (channel) {
    case '이메일':
      return <Mail className={className} size={size} aria-hidden />;
    case '카카오톡':
      return <MessageCircle className={className} size={size} aria-hidden />;
    case '링크':
      return <Link2 className={className} size={size} aria-hidden />;
    default:
      return null;
  }
}
