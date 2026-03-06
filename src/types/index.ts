export * from './models';

/** 사용자 유형 */
export type UserRole = 'corporation' | 'pharma';

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

/** 수수료 이벤트 (기준정보 이벤트관리용) */
export interface FeeEvent {
  id: string;
  /** 품목코드 */
  productCode: string;
  /** 법인 ID */
  corporationId: string;
  /** 적용 시작일 (YYYY-MM-DD) */
  startDate?: string;
  /** 적용 종료일 (YYYY-MM-DD) */
  endDate?: string;
  /** 적용수수료 사용 여부 (true: 적용수수료 사용, false: 추가수수료 사용) */
  useAppliedFee: boolean;
  /** 적용수수료 (useAppliedFee true일 때) */
  appliedFee?: number;
  /** 추가수수료 (useAppliedFee false일 때) */
  additionalFee?: number;
  /** 비고 */
  remark?: string;
}

/** 품목 (다운로드용) */
export interface ProductFee {
  productCode: string;
  productName: string;
  feeRate: number; // 수수료율(%)
  /** EDI 코드 */
  ediCode?: string;
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

/** 필터 상태 (제약사 법인 정산 확인용) */
export interface AggregateFilter {
  corporationId: string | null;
  hospitalId: string | null;
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
  /** 요청 문의 (법인 발송 메시지) */
  requestMessage?: string;
  /** 신규 병의원 추가 요청 시 입력 정보 (hospitalId가 new- 로 시작할 때) */
  hospitalName?: string;
  businessNumber?: string;
  address?: string;
  representativeName?: string;
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
