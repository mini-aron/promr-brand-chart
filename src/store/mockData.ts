import type { Corporation, Hospital, SalesRow, PrescriptionUpload, ProductFee, FilterRequest, Dealer, Pharma, FeeEvent } from '@/types';

/** ========== 더미: 제약사 ========== */
export const mockPharmas: Pharma[] = [
  { id: 'pharma-1', name: '프로엠알' },
  { id: 'pharma-2', name: '건강제약' },
  { id: 'pharma-3', name: '바이오팜' },
];

/** ========== 더미: 법인 ========== */
export const mockCorporations: Corporation[] = [
  { id: 'corp-1', name: 'A법인', isPromr: true },
  { id: 'corp-2', name: 'B법인', isPromr: true },
  { id: 'corp-3', name: 'C법인' },
  { id: 'corp-4', name: 'D법인' },
];

const HOSPITAL_NAMES = [
  '강남성모의원', '권선삼성내과의원', '서울중앙병원', '강남세브란스', '부산대학병원',
  '인천메디칼의원', '수원연세내과', '대전선병원', '광주희망병원', '대구파티마의원',
  '성남분당우리들', '고양한강의원', '용인수지연합', '화성동탄메디', '안양평촌의원',
  '시흥정왕건강', '파주문산내과', '김포장기내과', '부천중동의원', '안산본오메디',
  '의정부민들레', '청주상당의원', '천안두정병원', '전주완산메디', '포항북부의원',
  '창원성산의원', '울산삼산내과', '제주노형의원', '세종나성의원', '이천장호원',
];
const ADDRESS_PREFIXES = [
  '서울특별시 강남구', '경기도 수원시', '인천광역시 남동구', '부산광역시 해운대구', '대구광역시 수성구',
  '광주광역시 서구', '대전광역시 유성구', '울산광역시 남구', '세종시 나성동', '경기도 성남시 분당구',
  '경기도 고양시', '강원도 춘천시', '충청북도 청주시', '충청남도 천안시', '전라북도 전주시',
  '전라남도 여수시', '경상북도 포항시', '경상남도 창원시', '제주특별자치도 제주시',
];

function generateHospitals(count: number): Hospital[] {
  const list: Hospital[] = [];
  const corpIds = ['corp-1', 'corp-2', 'corp-3', 'corp-4'];
  for (let i = 0; i < count; i++) {
    const corpId = corpIds[i % corpIds.length];
    const name = `${HOSPITAL_NAMES[i % HOSPITAL_NAMES.length]}${i >= HOSPITAL_NAMES.length ? (i + 1).toString() : ''}`.trim();
    list.push({
      id: `h-${i + 1}`,
      name: name || `거래처${i + 1}`,
      corporationId: corpId,
      accountCode: String(1010000 + i).padStart(7, '0'),
      businessNumber: `100-0${String(i + 1).padStart(2, '0')}-${String((i * 1234) % 10000).padStart(4, '0')}`,
      address: `${ADDRESS_PREFIXES[i % ADDRESS_PREFIXES.length]} ${['중구', '남구', '동구', '서구', '북구'][i % 5]} 123-${i + 1}`,
    });
  }
  return list;
}

/** ========== 더미: 병의원(거래처) ========== */
export const mockHospitals: Hospital[] = generateHospitals(80);

/** ========== 더미: 품목(수수료율) ========== */
const PRODUCT_NAMES = [
  '제품A', '제품B', '제품C', '제품D', '제품E', '제품F', '프로메드정', '헬스케어캡슐', '비타민플러스',
  '오메가3캡슐', '루테인아이케어', '유산균플러스', '마그네슘정', '콜라겐드링크', '밀크씨슬',
];

/** ========== 더미: 수수료 이벤트 ========== */
const MOCK_USER = 'admin';
export const mockFeeEvents: FeeEvent[] = [
  { id: 'ev-1', productCode: 'P001', type: 'item', name: '제품A 시즌 할인', startDate: '2026-03-01', endDate: '2026-03-31', isFixedFee: true, fixedFeeRate: 3, note: '3월 한 달간 품목 전역 프로모션', priority: 1, createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { id: 'ev-2', productCode: 'P001', type: 'corporation', corporationId: 'corp-1', name: 'A법인 특별 협의', startDate: '2026-02-01', endDate: '2026-06-30', isFixedFee: false, additionalFeeRate: 2, note: 'A법인 전 병원 추가수수료 적용', priority: 2, createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { id: 'ev-3', productCode: 'P001', type: 'corporation_hospital', corporationId: 'corp-1', hospitalId: 'h-1', name: '강남성모 단독 프로모션', startDate: '2026-03-15', endDate: '2026-04-15', isFixedFee: true, fixedFeeRate: 2, note: '해당 병원 한정 고정수수료', priority: 3, createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { id: 'ev-4', productCode: 'P002', type: 'item', name: '제품B 봄맞이 프로모션', startDate: '2026-03-01', endDate: '2026-04-30', isFixedFee: false, additionalFeeRate: 1.5, note: '봄 시즌 한정 추가수수료', priority: 1, createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { id: 'ev-5', productCode: 'P002', type: 'corporation', corporationId: 'corp-2', name: 'B법인 협력사 할인', startDate: '2026-01-01', endDate: '2026-12-31', isFixedFee: true, fixedFeeRate: 2.5, note: '연간 계약 특별 할인', priority: 2, createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { id: 'ev-6', productCode: 'P003', type: 'item', name: '제품C 신규 런칭 이벤트', startDate: '2026-02-15', endDate: '2026-05-15', isFixedFee: true, fixedFeeRate: 3.5, note: '신제품 런칭 기념', priority: 1, createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { id: 'ev-7', productCode: 'P007', type: 'corporation_hospital', corporationId: 'corp-1', hospitalId: 'h-2', name: '프로메드정 권선삼성 특가', startDate: '2026-03-01', endDate: '2026-03-31', isFixedFee: false, additionalFeeRate: -1.5, note: '해당 병원 3월 한정 할인', priority: 1, createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { id: 'ev-8', productCode: 'P010', type: 'item', name: '오메가3 시즌 프로모션', startDate: '2026-03-01', endDate: '2026-04-30', isFixedFee: true, fixedFeeRate: 4, note: '건강의 달 맞이 할인', priority: 1, createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { id: 'ev-9', productCode: 'P011', type: 'corporation', corporationId: 'corp-3', name: '루테인 C법인 전담 할인', startDate: '2026-02-01', endDate: '2026-06-30', isFixedFee: false, additionalFeeRate: 1, note: 'C법인 전 병원 적용', priority: 1, createdBy: MOCK_USER, updatedBy: MOCK_USER },
];

export const mockProductFees: ProductFee[] = [
  { productCode: 'P001', productName: '제품A', feeRate: 5, finalFeeRate: 2, ediCode: '100001001', createdAt: '2026-01-15 09:00:00', updatedAt: '2026-03-01 14:30:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { productCode: 'P002', productName: '제품B', feeRate: 3, finalFeeRate: 2.5, ediCode: '100001002', createdAt: '2026-01-16 10:00:00', updatedAt: '2026-02-20 11:00:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { productCode: 'P003', productName: '제품C', feeRate: 4, finalFeeRate: 3.5, ediCode: '100001003', createdAt: '2026-01-17 11:00:00', updatedAt: '2026-01-17 11:00:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { productCode: 'P004', productName: '제품D', feeRate: 3.5, finalFeeRate: 3.5, ediCode: '100001004', createdAt: '2026-01-18 09:30:00', updatedAt: '2026-01-18 09:30:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { productCode: 'P005', productName: '제품E', feeRate: 6, finalFeeRate: 6, ediCode: '100001005', createdAt: '2026-01-19 14:00:00', updatedAt: '2026-01-19 14:00:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { productCode: 'P006', productName: '제품F', feeRate: 4.5, finalFeeRate: 4.5, ediCode: '100001006', createdAt: '2026-01-20 10:15:00', updatedAt: '2026-02-15 16:00:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { productCode: 'P007', productName: '프로메드정', feeRate: 5, finalFeeRate: 3.5, ediCode: '100001007', createdAt: '2026-02-01 09:00:00', updatedAt: '2026-03-05 10:00:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { productCode: 'P008', productName: '헬스케어캡슐', feeRate: 3, finalFeeRate: 3, ediCode: '100001008', createdAt: '2026-02-02 11:00:00', updatedAt: '2026-02-02 11:00:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { productCode: 'P009', productName: '비타민플러스', feeRate: 4, finalFeeRate: 4, ediCode: '100001009', createdAt: '2026-02-03 08:30:00', updatedAt: '2026-02-03 08:30:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { productCode: 'P010', productName: '오메가3캡슐', feeRate: 4.5, finalFeeRate: 4, ediCode: '100001010', createdAt: '2026-02-10 13:00:00', updatedAt: '2026-03-01 09:00:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { productCode: 'P011', productName: '루테인아이케어', feeRate: 5, finalFeeRate: 6, ediCode: '100001011', createdAt: '2026-02-12 15:00:00', updatedAt: '2026-02-12 15:00:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { productCode: 'P012', productName: '유산균플러스', feeRate: 3.5, finalFeeRate: 3.5, ediCode: '100001012', createdAt: '2026-02-14 10:00:00', updatedAt: '2026-02-14 10:00:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { productCode: 'P013', productName: '마그네슘정', feeRate: 4, finalFeeRate: 4, ediCode: '100001013', createdAt: '2026-02-15 09:00:00', updatedAt: '2026-02-15 09:00:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { productCode: 'P014', productName: '콜라겐드링크', feeRate: 5.5, finalFeeRate: 5.5, ediCode: '100001014', createdAt: '2026-02-16 14:30:00', updatedAt: '2026-02-16 14:30:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
  { productCode: 'P015', productName: '밀크씨슬', feeRate: 4, finalFeeRate: 4, ediCode: '100001015', createdAt: '2026-02-18 11:00:00', updatedAt: '2026-02-18 11:00:00', createdBy: MOCK_USER, updatedBy: MOCK_USER },
];

const PROMR_CORP_IDS = new Set(['corp-1', 'corp-2']);
const SALESPERSON_NAMES = ['김영업', '이딜러', '박세일', '최대리', '정과장'];

function generateSalesRows(count: number, hospitals: Hospital[]): SalesRow[] {
  const rows: SalesRow[] = [];
  const settlementMonths = ['2025-12', '2026-01', '2026-02'];
  for (let i = 0; i < count; i++) {
    const hospital = hospitals[i % hospitals.length];
    const productName = PRODUCT_NAMES[i % PRODUCT_NAMES.length];
    const quantity = 3 + (i % 25);
    const amount = quantity * (35000 + (i % 15) * 3000);
    const day = String((i % 28) + 1).padStart(2, '0');
    const hour = String(9 + (i % 8)).padStart(2, '0');
    const isPromrCorp = PROMR_CORP_IDS.has(hospital.corporationId);
    rows.push({
      id: `s-${i + 1}`,
      corporationId: hospital.corporationId,
      hospitalId: hospital.id,
      productName,
      quantity,
      amount,
      uploadedAt: `2026-02-${day}T${hour}:00:00`,
      settlementMonth: settlementMonths[i % settlementMonths.length],
      ...(isPromrCorp && {
        salespersonName: SALESPERSON_NAMES[i % SALESPERSON_NAMES.length],
      }),
    });
  }
  return rows;
}

/** ========== 더미: 실적 행 ========== */
export const mockSalesRows: SalesRow[] = generateSalesRows(200, mockHospitals);

const salesIdsForPrescription = mockSalesRows.slice(0, 30).map((r) => r.id);
/** ========== 더미: 처방사진 업로드 ========== */
export const mockPrescriptionUploads: PrescriptionUpload[] = [
  { id: 'p-1', salesRowIds: salesIdsForPrescription.slice(0, 5), hospitalId: 'h-1', corporationId: 'corp-1', imageUrls: ['https://placehold.co/400x300/e2e8f0/64748b?text=Rx+1'], uploadedAt: '2026-02-01T14:00:00', settlementMonth: '2026-01' },
  { id: 'p-2', salesRowIds: salesIdsForPrescription.slice(5, 10), hospitalId: 'h-2', corporationId: 'corp-1', imageUrls: ['https://placehold.co/400x300/e2e8f0/64748b?text=Rx+2'], uploadedAt: '2026-02-02T15:00:00', settlementMonth: '2026-01' },
  { id: 'p-3', salesRowIds: salesIdsForPrescription.slice(10, 15), hospitalId: 'h-3', corporationId: 'corp-2', imageUrls: ['https://placehold.co/400x300/e2e8f0/64748b?text=Rx+3'], uploadedAt: '2026-02-03T16:00:00', settlementMonth: '2026-01' },
  { id: 'p-4', salesRowIds: salesIdsForPrescription.slice(15, 22), hospitalId: 'h-4', corporationId: 'corp-2', imageUrls: ['https://placehold.co/400x300/e2e8f0/64748b?text=Rx+4', 'https://placehold.co/400x300/e2e8f0/64748b?text=Rx+4-2'], uploadedAt: '2026-02-05T10:00:00', settlementMonth: '2026-02' },
  { id: 'p-5', salesRowIds: salesIdsForPrescription.slice(22, 28), hospitalId: null, corporationId: 'corp-3', imageUrls: ['https://placehold.co/400x300/e2e8f0/64748b?text=Rx+전체'], uploadedAt: '2026-02-10T11:00:00', settlementMonth: '2026-02' },
];

/** ========== 더미: 필터링 승인요청 (해당 병의원 거래 허용 여부 요청) ========== */
export const mockFilterRequests: FilterRequest[] = [
  { id: 'fr-1', corporationId: 'corp-1', hospitalId: 'h-1', status: 'pending', requestedAt: '2026-02-24T09:00:00' },
  { id: 'fr-2', corporationId: 'corp-1', hospitalId: 'h-5', status: 'pending', requestedAt: '2026-02-24T11:30:00' },
  { id: 'fr-3', corporationId: 'corp-2', hospitalId: 'h-2', status: 'pending', requestedAt: '2026-02-23T14:00:00' },
  { id: 'fr-4', corporationId: 'corp-2', hospitalId: 'h-6', status: 'approved', requestedAt: '2026-02-22T10:00:00', processedAt: '2026-02-23T09:00:00' },
  { id: 'fr-5', corporationId: 'corp-3', hospitalId: 'h-3', status: 'rejected', requestedAt: '2026-02-21T16:00:00', processedAt: '2026-02-22T11:00:00' },
];

/** ========== 더미: 딜러(영업사원) ========== */
export const mockDealers: Dealer[] = [
  { id: 'd-1', corporationId: 'corp-1', salespersonName: '김영업', phone: '010-1234-5678', email: 'kim@corp1.com', reportCertUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=신고필증', contractUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=계약서', subcontractContractUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=재위탁계약서', businessLicenseUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=사업자등록증', createdAt: '2026-01-10T10:00:00' },
  { id: 'd-2', corporationId: 'corp-1', salespersonName: '이딜러', phone: '010-2345-6789', email: 'lee@corp1.com', reportCertUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=신고필증', contractUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=계약서', subcontractContractUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=재위탁계약서', createdAt: '2026-01-15T14:00:00' },
  { id: 'd-3', corporationId: 'corp-2', salespersonName: '박세일', phone: '010-3456-7890', email: 'park@corp2.com', reportCertUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=신고필증', createdAt: '2026-01-20T09:00:00' },
  { id: 'd-4', corporationId: 'corp-2', salespersonName: '최대리', phone: '010-4567-8901', email: 'choi@corp2.com', reportCertUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=신고필증', contractUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=계약서', subcontractContractUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=재위탁계약서', businessLicenseUrl: 'https://placehold.co/400x300/e2e8f0/64748b?text=사업자등록증', createdAt: '2026-02-01T11:00:00' },
];
