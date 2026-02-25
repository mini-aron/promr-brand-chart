/** 사용자 유형 */
export type UserRole = 'corporation' | 'pharma';

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

/** 품목 (다운로드용) */
export interface ProductFee {
  productCode: string;
  productName: string;
  feeRate: number; // 수수료율(%)
}

/** 실적(엑셀) 행 데이터 */
export interface SalesRow {
  id: string;
  corporationId: string;
  hospitalId: string;
  productName: string;
  quantity: number;
  amount: number;
  uploadedAt: string;
  /** 정산/처방월 (YYYY-MM). 법인 업로드 시 선택한 월 */
  settlementMonth?: string;
  /** 영업사원명 (프로엠알 법인 딜러 실적 표시용) */
  salespersonName?: string;
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
  /** 거래 허용 여부를 묻는 대상 병의원 ID */
  hospitalId: string;
  /** pending | approved | rejected */
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  /** 승인/반려 처리 시각 (optional) */
  processedAt?: string;
}
