import type { LucideIcon } from 'lucide-react';
import { LayoutGrid, Mail, MessageCircle } from 'lucide-react';
import type { ContractStatus, SendType } from '@/types/services/contractService';
import type { Option } from '@/shared/components/ui/Select';
import type { ChannelTabKey, ContractReviewChannel, ContractReviewChannelFilter } from '../types';

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  REQUESTED: '요청중',
  SUBMITTED: '검토필요',
  APPROVED: '검토완료',
  REJECTED: '불가',
  RESUBMIT_REQUESTED: '재제출요청',
};

export const SEND_TYPE_CHANNEL: Record<SendType, ContractReviewChannel> = {
  EMAIL: '이메일',
  PHONE: '카카오톡',
};

/** 수신목록: 채널 필터 옆 계약서 상태 SingleSelect */
export const REVIEW_STATUS_FILTER_OPTIONS: Option[] = [
  { label: '전체', value: '전체' },
  { label: '검토필요', value: '검토필요' },
  { label: '불가', value: '불가' },
];

export const CHANNEL_TAB_ITEMS: {
  filter: ContractReviewChannelFilter;
  key: ChannelTabKey;
  icon: LucideIcon;
}[] = [
  { filter: '전체', key: 'all', icon: LayoutGrid },
  { filter: '이메일', key: 'email', icon: Mail },
  { filter: '카카오톡', key: 'kakao', icon: MessageCircle },
];
