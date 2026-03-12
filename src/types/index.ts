/** 사용자 유형 */
export type UserRole = 'corporation' | 'pharma' | 'admin';

/** 제약사 정보 */
export interface Pharma {
  id: string;
  name: string;
}

/** 법인(업로더) 정보 */
export interface Corporation {
  id: string;
  name: string;
  /** 프로엠알에서 실적을 입력한 법인 여부 (법인별 정산 화면 뱃지·딜러 실적용) */
  isPromr?: boolean;
  /** 구간수수료 - 금액 구간별 수수료 (minAmount: 만원, maxAmount: 만원, rate: %) */
  tieredFeeTiers?: { minAmount: number; maxAmount: number; rate: number }[];
}

/** 병의원(거래처) 정보 */
export interface Hospital {
  id: string;
  name: string;
  corporationId: string;
  /** 거래처코드 (정산 화면) */
  accountCode?: string;
  /** 사업자등록번호 (정산 화면) */
  businessNumber?: string;
  /** 주소 (정산 화면) */
  address?: string;
}

/** 품목 (다운로드용) */
export interface ProductFee {
  productCode: string;
  productName: string;
  feeRate: number; // 기본 수수료율(%)
  /** 최종 수수료율(%) - 서버에서 이벤트 적용 후 계산 */
  finalFeeRate?: number;
  /** EDI 코드 */
  ediCode?: string;
  /** 등록일 (ISO 8601) */
  createdAt?: string;
  /** 마지막 업데이트일 (ISO 8601) */
  updatedAt?: string;
  /** 생성자 */
  createdBy?: string;
  /** 마지막 업데이트 유저 */
  updatedBy?: string;
}

/** 수수료 이벤트 종류 */
export type FeeEventType = 'item' | 'corporation' | 'corporation_hospital';

/** 수수료 이벤트 */
export interface FeeEvent {
  id: string;
  productCode: string;
  type: FeeEventType;
  name: string;
  startDate: string;
  endDate: string;
  isFixedFee: boolean;
  /** 고정수수료 사용 시 1~100 */
  fixedFeeRate?: number;
  /** 추가수수료 사용 시 -100~100 (음수 가능) */
  additionalFeeRate?: number;
  note?: string;
  corporationId?: string;
  hospitalId?: string;
  /** 우선순위 (낮을수록 우선) */
  priority?: number;
  createdBy?: string;
  updatedBy?: string;
}

/** 실적(엑셀) 행 데이터 */
export interface SalesRow {
  id: string;
  corporationId: string;
  pharmaId?: string;
  hospitalId: string;
  productName: string;
  quantity: number;
  amount: number;
  uploadedAt: string;
  /** 정산/처방월 (YYYY-MM). 법인 업로드 시 선택한 월 */
  settlementMonth?: string;
  /** 영업사원명 (프로엠알 법인 딜러 실적 표시용) */
  salespersonName?: string;
  /** 병원 사업자번호 */
  businessNumber?: string;
  /** 제품코드 */
  productCode?: string;
}

/** 처방 사진 업로드 단위 (병원별 또는 전체) */
export interface PrescriptionUpload {
  id: string;
  salesRowIds: string[];
  hospitalId: string | null; // null = 전체
  corporationId: string;
  imageUrls: string[];
  uploadedAt: string;
  /** 업로드 시 선택한 월 (YYYY-MM) */
  settlementMonth?: string;
}

/** 거래선 관리 품목 지정용 제품 한 건 */
export interface FilterRequestProduct {
  productCode: string;
  productName: string;
  productEdi: string;
}

/** 필터링 승인요청: 해당 병의원과 거래해도 되는지 여부 승인 요청 (법인별 필터링 승인요청 메뉴용) */
export interface FilterRequest {
  id: string;
  corporationId: string;
  pharmaId?: string;
  /** 거래 허용 여부를 묻는 대상 병의원 ID. 신규 추가 요청 시 'new-{id}' 형태 */
  hospitalId: string;
  /** pending | approved | rejected */
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  /** 승인/반려 처리 시각 (optional) */
  processedAt?: string;
  /** 생성일 (ISO 8601) */
  createdAt?: string;
  /** 업데이트일 (ISO 8601) */
  updatedAt?: string;
  /** 생성자 */
  createdBy?: string;
  /** 최종 수정자 */
  updatedBy?: string;
  /** 요청 문의 (법인 발송 메시지) */
  requestMessage?: string;
  /** 신규 병의원 추가 요청 시 입력 정보 (hospitalId가 new- 로 시작할 때) */
  hospitalName?: string;
  businessNumber?: string;
  address?: string;
  representativeName?: string;
  /** 추가수수료 - 기본수수료에 추가 적용 (-100~100 %) */
  additionalFeeRate?: number;
  /** 품목 설정: 미사용(none) | 허용(allowed) | 금지(prohibited) 중 하나 */
  productFilterMode?: 'none' | 'prohibited' | 'allowed';
  /** 가능품목 지정 목록 (허용품목 설정 시) */
  allowedProducts?: FilterRequestProduct[];
  /** 불가품목 지정 목록 (금지품목 설정 시) */
  prohibitedProducts?: FilterRequestProduct[];
}

/** 법인 초대 정보 */
export interface CorpInvitation {
  id: string;
  pharmaId: string;
  inviteCode: string;
  /** pending: 초대됨, accepted: 가입 완료 */
  status: 'pending' | 'accepted';
  invitedAt: string;
  /** 가입 완료 시 연결된 법인 ID */
  corporationId?: string;
  /** 초대 메일 발송 대상 (선택) */
  invitedEmail?: string;
}

/** 딜러(영업사원) 정보 */
export interface Dealer {
  id: string;
  corporationId: string;
  salespersonName: string;
  phone: string;
  email: string;
  /** 신고필증 파일 URL */
  reportCertUrl?: string;
  /** 계약서 파일 URL */
  contractUrl?: string;
  /** 재위탁계약서 파일 URL */
  subcontractContractUrl?: string;
  /** 사업자 등록증 파일 URL */
  businessLicenseUrl?: string;
  createdAt: string;
}
