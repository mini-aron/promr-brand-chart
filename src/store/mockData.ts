import type {
  Corporation,
  CorpHospitalFee,
  Hospital,
  Pharmacy,
  SalesRow,
  PrescriptionUpload,
  ProductFee,
  ProductAbsorptionRate,
  HospitalProductAbsorptionRate,
  FilterRequest,
  Dealer,
  Pharma,
  FeeEvent,
  CorpInvitation,
  Notice,
  NoticeDetail,
  AppNotification,
} from '@/types';
import type { RegionStat } from '@/hooks/useSettlementByRegion';
import { REGION_NAMES } from '@/hooks/useSettlementByRegion';
import {
  DEMO_CONTRACT_SAMPLE_URL,
  DEMO_REPORT_CERTIFICATE_SAMPLE_URL,
  DEMO_SUBCONTRACT_CONTRACT_SAMPLE_URL,
  demoContractPlaceholderUrl,
} from '@/features/contract/lib/contractManagementMock';

/** ========== 더미: 헤더 알림 ========== */
export const mockAppNotifications: AppNotification[] = [
  {
    id: 'n1',
    category: '시스템공지',
    title: '계약서 검토 요청',
    body: '(주)굿모닝위탁에서 계약서가 도착했습니다. 검토 후 회신 부탁드립니다.',
    createdAt: '2026-03-30T09:00:00.000Z',
    read: false,
    href: '/pharma/contract-management/review',
  },
  {
    id: 'n2',
    category: '문의',
    title: '필터링 승인 요청',
    body: '새 거래선 승인 요청이 접수되었습니다. 승인 처리를 진행해 주세요.',
    createdAt: '2026-03-29T14:30:00.000Z',
    read: false,
    href: '/pharma/filter-approval',
  },
  {
    id: 'n3',
    category: '시스템공지',
    title: '정산 데이터 반영',
    body: '2026년 3월 정산 집계가 완료되었습니다. 정산 메뉴에서 확인할 수 있습니다.',
    createdAt: '2026-03-28T08:00:00.000Z',
    read: true,
    href: '/pharma/settlement',
  },
  {
    id: 'n4',
    category: '시스템공지',
    title: '서비스 점검 안내',
    body: '2026년 4월 10일 새벽 2시~4시 서비스 점검이 예정되어 있습니다.',
    createdAt: '2026-03-27T11:00:00.000Z',
    read: true,
  },
  {
    id: 'n5',
    category: '문의',
    title: '담당자 변경 요청',
    body: '거래처 담당자 변경 요청이 접수되었습니다.',
    createdAt: '2026-03-26T16:20:00.000Z',
    read: true,
  },
];

/** ========== 더미: 공지사항 ========== */
export const mockNotices: Notice[] = [
  {
    id: '1',
    no: 5,
    title: '2025년 1분기 실적 제출 일정 안내',
    author: '관리자',
    createdAt: '2025.02.28',
    noticeScope: 'system',
  },
  {
    id: '2',
    no: 4,
    title: '엑셀 양식 개편 안내 (v2.0)',
    author: '관리자',
    createdAt: '2025.02.15',
    noticeScope: 'system',
  },
  {
    id: '3',
    no: 3,
    title: '처방사진 업로드 규격 안내',
    author: '관리자',
    createdAt: '2025.02.01',
    noticeScope: 'system',
  },
  {
    id: 'p-7',
    no: 7,
    title: '[샘플제약] 위탁계약서 제출 요청 및 제출 기한 안내',
    author: '샘플제약',
    createdAt: '2026.04.06',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
  {
    id: 'p-6',
    no: 6,
    title: '[샘플제약] 2026년 상반기 수수료 이벤트 안내',
    author: '샘플제약',
    createdAt: '2026.04.01',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
  {
    id: 'p-5',
    no: 5,
    title: '[샘플제약] EDI 코드 변경 반영 일정 안내',
    author: '샘플제약',
    createdAt: '2026.03.18',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
  {
    id: 'p-4',
    no: 4,
    title: '[샘플제약] 실적 업로드 점검 기간 및 유의사항',
    author: '샘플제약',
    createdAt: '2026.03.05',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
  {
    id: 'p-3',
    no: 3,
    title: '[샘플제약] 정산 문의 채널 및 담당 배정 안내',
    author: '샘플제약',
    createdAt: '2026.02.10',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
  {
    id: 'p-1',
    no: 2,
    title: '[샘플제약] 원외 처방 집계 기준 안내',
    author: '샘플제약',
    createdAt: '2025.03.01',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
  {
    id: 'p-2',
    no: 1,
    title: '[샘플제약] 거래선 승인 프로세스 변경',
    author: '샘플제약',
    createdAt: '2025.02.20',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
  {
    id: 'hp-1',
    no: 8,
    title: '[건강제약] 실적 업로드 점검 안내',
    author: '건강제약',
    createdAt: '2026.03.01',
    noticeScope: 'pharma',
    pharmaId: 'pharma-2',
  },
  {
    id: 'bp-1',
    no: 9,
    title: '[바이오팜] 정산 일정 안내',
    author: '바이오팜',
    createdAt: '2026.03.15',
    noticeScope: 'pharma',
    pharmaId: 'pharma-3',
  },
  {
    id: 'md-demo',
    no: 10,
    title: '[샘플제약] 마크다운 공지 예시 (표·목록·코드)',
    author: '샘플제약',
    createdAt: '2026.04.07',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
];

/** ========== 더미: 공지사항 상세 ========== */
export const mockNoticeDetails: NoticeDetail[] = [
  {
    id: '1',
    no: 5,
    title: '2025년 1분기 실적 제출 일정 안내',
    content: `안녕하세요, 샘플제약 실적 관리팀입니다.

2025년 1분기 실적 제출 일정을 안내드립니다.

■ 제출 기한: 2025년 4월 10일(목) 18:00
■ 제출 대상: 2025년 1월~3월 실적
■ 제출 방법: 시스템 업로드 또는 엑셀 양식 제출

기한 내 미제출 시 정산이 다음 분기로 이월될 수 있사오니, 기한 준수에 협조 부탁드립니다.

문의사항은 담당자에게 연락 부탁드립니다.`,
    author: '관리자',
    createdAt: '2025.02.28',
    updatedAt: '2025.02.28',
    noticeScope: 'system',
  },
  {
    id: '2',
    no: 4,
    title: '엑셀 양식 개편 안내 (v2.0)',
    content: `엑셀 실적 업로드 양식이 v2.0으로 개편되었습니다.

■ 변경 사항
- 컬럼 순서 및 필수 입력 항목 조정
- 품목코드 매핑 자동화 기능 추가
- 유효성 검사 강화

■ 적용 일: 2025년 2월 15일부터
■ 다운로드: [공지사항 상세] > 첨부파일

기존 양식(v1.x)은 2025년 3월 말까지 사용 가능합니다.`,
    author: '관리자',
    createdAt: '2025.02.15',
    updatedAt: '2025.02.28',
    noticeScope: 'system',
  },
  {
    id: '3',
    no: 3,
    title: '처방사진 업로드 규격 안내',
    content: `처방사진 업로드 시 아래 규격을 준수해 주세요.

■ 지원 형식: JPG, PNG
■ 최대 용량: 5MB/파일
■ 권장 해상도: 1920x1080 이상
■ 파일명: 병의원코드_처방일자_순번 (예: 1010001_20250115_01.jpg)

규격 미준수 시 업로드가 거부될 수 있습니다.`,
    author: '관리자',
    createdAt: '2025.02.01',
    updatedAt: '2025.02.01',
    noticeScope: 'system',
  },
  {
    id: 'p-7',
    no: 7,
    title: '[샘플제약] 위탁계약서 제출 요청 및 제출 기한 안내',
    content: `거래 위탁 관련 서류 정비에 따라, 아래 대상 법인은 최신 위탁계약서(날인본)를 제출해 주시기 바랍니다.

■ 제출 대상: 2025년 12월 이전 체결 계약이 남아 있는 법인
■ 제출 기한: 2026년 4월 18일(금) 18:00
■ 제출 방법: 시스템 [계약 관리] 메뉴에서 PDF 업로드 (파일명: 법인명_위탁계약_YYYYMMDD)
■ 필수 확인: 대표자 날인, 계약 기간, 위탁 범위(품목·지역) 기재 여부

기한 내 미제출 시 신규 실적 반영·정산 검토가 지연될 수 있습니다. 사전 제출을 권장드립니다.

문의: 법무·계약 담당 (contracts@sample-pharma.kr)`,
    author: '샘플제약',
    createdAt: '2026.04.06',
    updatedAt: '2026.04.06',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
  {
    id: 'p-6',
    no: 6,
    title: '[샘플제약] 2026년 상반기 수수료 이벤트 안내',
    content: `2026년 상반기(1~6월) 처방 실적에 대해 아래 조건으로 수수료 이벤트를 진행합니다.

■ 대상: 샘플제약 품목 중 행사 품목코드에 해당하는 건
■ 적용 방식: 월별 집계 후 익월 정산 시 자동 반영
■ 문의: 영업지원팀 (내선 7700)

행사 품목 목록은 별도 공지 및 담당 MR 안내를 참고해 주세요.`,
    author: '샘플제약',
    createdAt: '2026.04.01',
    updatedAt: '2026.04.01',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
  {
    id: 'p-5',
    no: 5,
    title: '[샘플제약] EDI 코드 변경 반영 일정 안내',
    content: `일부 품목의 EDI 코드가 변경되어 아래 일정에 맞춰 시스템에 반영됩니다.

■ 반영 예정일: 2026년 4월 7일(화) 새벽 배치
■ 업로드 시: 변경 전·후 코드 혼용 구간(3월 말~4월 초)은 양쪽 모두 허용
■ 오류 지속 시: 엑셀 원본과 함께 담당자에게 문의

엑셀 양식의 품목코드 컬럼은 최신 코드 기준으로 입력해 주시기 바랍니다.`,
    author: '샘플제약',
    createdAt: '2026.03.18',
    updatedAt: '2026.03.18',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
  {
    id: 'p-4',
    no: 4,
    title: '[샘플제약] 실적 업로드 점검 기간 및 유의사항',
    content: `시스템 안정화를 위해 아래 시간대에는 대량 업로드가 지연될 수 있습니다.

■ 점검 예정: 2026년 3월 8일(일) 02:00~06:00
■ 권장: 점검 전날까지 업로드 완료 또는 점검 종료 후 재시도

점검 중에는 일시적으로 업로드 오류 메시지가 표시될 수 있으니 양해 부탁드립니다.`,
    author: '샘플제약',
    createdAt: '2026.03.05',
    updatedAt: '2026.03.05',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
  {
    id: 'p-3',
    no: 3,
    title: '[샘플제약] 정산 문의 채널 및 담당 배정 안내',
    content: `정산·실적 관련 문의는 아래 채널로 접수해 주시기 바랍니다.

■ 이메일: settlement@sample-pharma.kr (제목에 법인명·정산월 포함)
■ 전화: 정산팀 02-0000-0000 (평일 09:00~18:00)
■ 긴급: 해당 지역 MR 경유 시 빠른 확인이 가능합니다.

접수 순으로 답변드리며, 단순 중복 문의는 합산 처리될 수 있습니다.`,
    author: '샘플제약',
    createdAt: '2026.02.10',
    updatedAt: '2026.02.10',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
  {
    id: 'p-1',
    no: 2,
    title: '[샘플제약] 원외 처방 집계 기준 안내',
    content: `안녕하세요, 샘플제약입니다.

원외 처방 집계 시 아래 기준을 적용합니다.

■ 집계 단위: 처방일 기준 월별
■ 반영 시점: 익월 5영업일 이내
■ 문의: 담당 MR 또는 본사 정산팀

감사합니다.`,
    author: '샘플제약',
    createdAt: '2025.03.01',
    updatedAt: '2025.03.01',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
  {
    id: 'p-2',
    no: 1,
    title: '[샘플제약] 거래선 승인 프로세스 변경',
    content: `거래선(병의원) 추가 요청 후 승인 절차가 아래와 같이 변경되었습니다.

■ 요청 → 제약사 검토 → 승인/반려 통지
■ 검토 소요: 영업일 기준 3일 이내

자세한 내용은 거래선 관리 메뉴를 참고해 주세요.`,
    author: '샘플제약',
    createdAt: '2025.02.20',
    updatedAt: '2025.02.20',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
  {
    id: 'hp-1',
    no: 8,
    title: '[건강제약] 실적 업로드 점검 안내',
    content: `건강제약 실적 시스템 점검 안내입니다.

■ 점검 일시: 2026년 3월 10일(화) 02:00~04:00
■ 영향: 해당 시간대 업로드 지연 가능

문의: info@health-pharma.kr`,
    author: '건강제약',
    createdAt: '2026.03.01',
    updatedAt: '2026.03.01',
    noticeScope: 'pharma',
    pharmaId: 'pharma-2',
  },
  {
    id: 'bp-1',
    no: 9,
    title: '[바이오팜] 정산 일정 안내',
    content: `2026년 4월 정산 일정을 안내드립니다.

■ 자료 마감: 4월 5일
■ 지급 예정: 4월 20일 이후

문의: office@bio-pharm.kr`,
    author: '바이오팜',
    createdAt: '2026.03.15',
    updatedAt: '2026.03.15',
    noticeScope: 'pharma',
    pharmaId: 'pharma-3',
  },
  {
    id: 'md-demo',
    no: 10,
    title: '[샘플제약] 마크다운 공지 예시 (표·목록·코드)',
    content: `## 샘플제약 마크다운 공지

안녕하세요, **샘플제약** 실적 관리팀입니다. 공지 본문은 **마크다운**으로 렌더링됩니다.

### 제출 요약

| 항목 | 내용 |
|------|------|
| 대상 | 전체 위탁사 |
| 기한 | **2026-04-30** |

1. 엑셀 v2.0 양식 사용
2. 파일명 규칙 준수 (병의원코드_일자)

> 제출 전 담당 MR 또는 [정산팀](mailto:settlement@sample.com)으로 문의하세요.

\`\`\`text
메뉴 경로: 실적 > 업로드 > 일괄 등록
\`\`\`

---
*샘플제약 데모용 마크다운 샘플입니다.*`,
    author: '샘플제약',
    createdAt: '2026.04.07',
    updatedAt: '2026.04.07',
    noticeScope: 'pharma',
    pharmaId: 'pharma-1',
  },
];

/** ========== 더미: 제약사 ========== */
export const mockPharmas: Pharma[] = [
  {
    id: 'pharma-1',
    name: '샘플제약',
    email: 'contact@sample-pharma.kr',
    businessRegNo: '123-45-67890',
    logoUrl: null,
    businessLicenseFileName: null,
  },
  {
    id: 'pharma-2',
    name: '건강제약',
    email: 'info@health-pharma.kr',
    businessRegNo: '234-56-78901',
    logoUrl: null,
    businessLicenseFileName: null,
  },
  {
    id: 'pharma-3',
    name: '바이오팜',
    email: 'office@bio-pharm.kr',
    businessRegNo: '345-67-89012',
    logoUrl: null,
    businessLicenseFileName: null,
  },
];

/** ========== 더미: 법인 ========== */
export const mockCorporations: Corporation[] = [
  {
    id: 'corp-1',
    name: '한국메디컬',
    businessRegNo: '123-45-67890',
    email: 'contact@hanmed.example.com',
    phone: '02-1234-5678',
    representativeName: '김담당',
    additionalFeeRate: 1,
    tieredFeeTiers: [
      { minAmount: 1, maxAmount: 100, rate: 2 },
      { minAmount: 100, maxAmount: 500, rate: 1.5 },
      { minAmount: 500, maxAmount: 1000, rate: 1 },
    ],
  },
  {
    id: 'corp-2',
    name: '(주)굿모닝위탁',
    businessRegNo: '234-56-78901',
    email: 'info@goodmorning.example.com',
    phone: '031-555-0100',
    representativeName: '이영업',
    isPromr: true,
    additionalFeeRate: 0.5,
    tieredFeeTiers: [
      { minAmount: 1, maxAmount: 200, rate: 2.5 },
      { minAmount: 200, maxAmount: 1000, rate: 1.5 },
    ],
  },
  {
    id: 'corp-3',
    name: 'C법인',
    businessRegNo: '345-67-89012',
    email: 'corp3@example.com',
    phone: '070-0000-0003',
    representativeName: '박대표',
  },
  {
    id: 'corp-4',
    name: 'D법인',
    businessRegNo: '456-78-90123',
    email: 'corp4@example.com',
    phone: '070-0000-0004',
    representativeName: '최담당',
  },
];

/** ========== 더미: 법인-병원별 수수료 ========== */
export const mockCorpHospitalFees: CorpHospitalFee[] = [
  { corporationId: 'corp-1', hospitalId: 'h-1', isFixedFee: false, feeRate: 0 },
  { corporationId: 'corp-1', hospitalId: 'h-2', isFixedFee: true, feeRate: 0 },
  { corporationId: 'corp-2', hospitalId: 'h-3', isFixedFee: false, feeRate: 0 },
];

const HOSPITAL_NAMES = [
  '강남성모의원',
  '권선삼성내과의원',
  '서울중앙병원',
  '강남세브란스',
  '부산대학병원',
  '인천메디칼의원',
  '수원연세내과',
  '대전선병원',
  '광주희망병원',
  '대구파티마의원',
  '성남분당우리들',
  '고양한강의원',
  '용인수지연합',
  '화성동탄메디',
  '안양평촌의원',
  '시흥정왕건강',
  '파주문산내과',
  '김포장기내과',
  '부천중동의원',
  '안산본오메디',
  '의정부민들레',
  '청주상당의원',
  '천안두정병원',
  '전주완산메디',
  '포항북부의원',
  '창원성산의원',
  '울산삼산내과',
  '제주노형의원',
  '세종나성의원',
  '이천장호원',
];
const ADDRESS_PREFIXES = [
  '서울특별시 강남구',
  '경기도 수원시',
  '인천광역시 남동구',
  '부산광역시 해운대구',
  '대구광역시 수성구',
  '광주광역시 서구',
  '대전광역시 유성구',
  '울산광역시 남구',
  '세종시 나성동',
  '경기도 성남시 분당구',
  '경기도 고양시',
  '강원도 춘천시',
  '충청북도 청주시',
  '충청남도 천안시',
  '전라북도 전주시',
  '전라남도 여수시',
  '경상북도 포항시',
  '경상남도 창원시',
  '제주특별자치도 제주시',
];

function generateHospitals(count: number): Hospital[] {
  const list: Hospital[] = [];
  const corpIds = ['corp-1', 'corp-2', 'corp-3', 'corp-4'];
  for (let i = 0; i < count; i++) {
    const corpId = corpIds[i % corpIds.length];
    const name =
      `${HOSPITAL_NAMES[i % HOSPITAL_NAMES.length]}${i >= HOSPITAL_NAMES.length ? (i + 1).toString() : ''}`.trim();
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
const baseHospitals = generateHospitals(80);
const NO_PHARMACY_HOSPITAL: Hospital = {
  id: 'h-no-pharmacy',
  name: '문전약국 없음 더미',
  corporationId: 'corp-1',
  accountCode: '9999999',
  address: '서울특별시 강남구 테스트동 0',
};
export const mockHospitals: Hospital[] = [...baseHospitals, NO_PHARMACY_HOSPITAL];

const PHARMACY_NAMES = [
  '건강약국',
  '행복약국',
  '우리들약국',
  '사랑약국',
  '참좋은약국',
  '메디팜약국',
  '365약국',
  '정다운약국',
  '이편한약국',
  '늘푸른약국',
  '햇살약국',
  '바른약국',
];

function generatePharmacies(hospitals: Hospital[]): Pharmacy[] {
  const list: Pharmacy[] = [];
  let pid = 1;
  hospitals.forEach((h, hi) => {
    const count = (hi % 12) + 1;
    const baseAddr = h.address ?? '서울특별시 강남구';
    for (let i = 0; i < count; i++) {
      const repNames = [
        '김철수',
        '이영희',
        '박민수',
        '최지은',
        '정대호',
        '한소희',
        '강민준',
        '윤서연',
      ];
      list.push({
        id: `ph-${pid}`,
        mappingNo: String(pid),
        name:
          `${PHARMACY_NAMES[i % PHARMACY_NAMES.length]}${i >= PHARMACY_NAMES.length ? (i + 1).toString() : ''}`.trim() ||
          `문전약국${pid}`,
        hospitalId: h.id,
        address: `${baseAddr} 앞 ${i + 1}호`,
        representativeName: repNames[(pid + i) % repNames.length],
        businessNumber: `100-0${String(pid % 100).padStart(2, '0')}-${String((pid * 1234) % 10000).padStart(4, '0')}`,
        lat: 37.5 + (hi % 10) * 0.05 + (i % 3) * 0.01,
        lng: 127 + (hi % 10) * 0.05 + (i % 3) * 0.01,
      });
      pid++;
    }
  });
  return list;
}

/** ========== 더미: 문전약국 ========== */
export const mockPharmacies: Pharmacy[] = generatePharmacies(baseHospitals);

/** ========== 더미: 품목(수수료율) ========== */
const PRODUCT_NAMES = [
  '제품A',
  '제품B',
  '제품C',
  '제품D',
  '제품E',
  '제품F',
  '프로메드정',
  '헬스케어캡슐',
  '비타민플러스',
  '오메가3캡슐',
  '루테인아이케어',
  '유산균플러스',
  '마그네슘정',
  '콜라겐드링크',
  '밀크씨슬',
];

/** ========== 더미: 수수료 이벤트 ========== */
const MOCK_USER = 'admin';
export const mockFeeEvents: FeeEvent[] = [
  {
    id: 'ev-1',
    productCode: 'P001',
    type: 'item',
    name: '제품A 시즌 할인',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    isFixedFee: true,
    fixedFeeRate: 3,
    note: '3월 한 달간 품목 전역 프로모션',
    priority: 1,
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    id: 'ev-2',
    productCode: 'P001',
    type: 'corporation',
    corporationId: 'corp-1',
    name: '한국메디컬 특별 협의',
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    isFixedFee: false,
    additionalFeeRate: 2,
    note: '한국메디컬 전 병원 추가수수료 적용',
    priority: 2,
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    id: 'ev-3',
    productCode: 'P001',
    type: 'corporation_hospital',
    corporationId: 'corp-1',
    hospitalId: 'h-1',
    name: '강남성모 단독 프로모션',
    startDate: '2026-03-15',
    endDate: '2026-04-15',
    isFixedFee: true,
    fixedFeeRate: 2,
    note: '해당 병원 한정 고정수수료',
    priority: 3,
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    id: 'ev-4',
    productCode: 'P002',
    type: 'item',
    name: '제품B 봄맞이 프로모션',
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    isFixedFee: false,
    additionalFeeRate: 1.5,
    note: '봄 시즌 한정 추가수수료',
    priority: 1,
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    id: 'ev-5',
    productCode: 'P002',
    type: 'corporation',
    corporationId: 'corp-2',
    name: '(주)굿모닝위탁 협력사 할인',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isFixedFee: true,
    fixedFeeRate: 2.5,
    note: '연간 계약 특별 할인',
    priority: 2,
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    id: 'ev-6',
    productCode: 'P003',
    type: 'item',
    name: '제품C 신규 런칭 이벤트',
    startDate: '2026-02-15',
    endDate: '2026-05-15',
    isFixedFee: true,
    fixedFeeRate: 3.5,
    note: '신제품 런칭 기념',
    priority: 1,
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    id: 'ev-7',
    productCode: 'P007',
    type: 'corporation_hospital',
    corporationId: 'corp-1',
    hospitalId: 'h-2',
    name: '프로메드정 권선삼성 특가',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
    isFixedFee: false,
    additionalFeeRate: -1.5,
    note: '해당 병원 3월 한정 할인',
    priority: 1,
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    id: 'ev-8',
    productCode: 'P010',
    type: 'item',
    name: '오메가3 시즌 프로모션',
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    isFixedFee: true,
    fixedFeeRate: 4,
    note: '건강의 달 맞이 할인',
    priority: 1,
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    id: 'ev-9',
    productCode: 'P011',
    type: 'corporation',
    corporationId: 'corp-3',
    name: '루테인 C법인 전담 할인',
    startDate: '2026-02-01',
    endDate: '2026-06-30',
    isFixedFee: false,
    additionalFeeRate: 1,
    note: 'C법인 전 병원 적용',
    priority: 1,
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
];

export const mockProductFees: ProductFee[] = [
  {
    productCode: 'P001',
    productName: '제품A',
    feeRate: 5,
    finalFeeRate: 2,
    ediCode: '100001001',
    createdAt: '2026-01-15 09:00:00',
    updatedAt: '2026-03-01 14:30:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    productCode: 'P002',
    productName: '제품B',
    feeRate: 3,
    finalFeeRate: 2.5,
    ediCode: '100001002',
    createdAt: '2026-01-16 10:00:00',
    updatedAt: '2026-02-20 11:00:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    productCode: 'P003',
    productName: '제품C',
    feeRate: 4,
    finalFeeRate: 3.5,
    ediCode: '100001003',
    createdAt: '2026-01-17 11:00:00',
    updatedAt: '2026-01-17 11:00:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    productCode: 'P004',
    productName: '제품D',
    feeRate: 3.5,
    finalFeeRate: 3.5,
    ediCode: '100001004',
    createdAt: '2026-01-18 09:30:00',
    updatedAt: '2026-01-18 09:30:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    productCode: 'P005',
    productName: '제품E',
    feeRate: 6,
    finalFeeRate: 6,
    ediCode: '100001005',
    createdAt: '2026-01-19 14:00:00',
    updatedAt: '2026-01-19 14:00:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    productCode: 'P006',
    productName: '제품F',
    feeRate: 4.5,
    finalFeeRate: 4.5,
    ediCode: '100001006',
    createdAt: '2026-01-20 10:15:00',
    updatedAt: '2026-02-15 16:00:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    productCode: 'P007',
    productName: '프로메드정',
    feeRate: 5,
    finalFeeRate: 3.5,
    ediCode: '100001007',
    createdAt: '2026-02-01 09:00:00',
    updatedAt: '2026-03-05 10:00:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    productCode: 'P008',
    productName: '헬스케어캡슐',
    feeRate: 3,
    finalFeeRate: 3,
    ediCode: '100001008',
    createdAt: '2026-02-02 11:00:00',
    updatedAt: '2026-02-02 11:00:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    productCode: 'P009',
    productName: '비타민플러스',
    feeRate: 4,
    finalFeeRate: 4,
    ediCode: '100001009',
    createdAt: '2026-02-03 08:30:00',
    updatedAt: '2026-02-03 08:30:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    productCode: 'P010',
    productName: '오메가3캡슐',
    feeRate: 4.5,
    finalFeeRate: 4,
    ediCode: '100001010',
    createdAt: '2026-02-10 13:00:00',
    updatedAt: '2026-03-01 09:00:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    productCode: 'P011',
    productName: '루테인아이케어',
    feeRate: 5,
    finalFeeRate: 6,
    ediCode: '100001011',
    createdAt: '2026-02-12 15:00:00',
    updatedAt: '2026-02-12 15:00:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    productCode: 'P012',
    productName: '유산균플러스',
    feeRate: 3.5,
    finalFeeRate: 3.5,
    ediCode: '100001012',
    createdAt: '2026-02-14 10:00:00',
    updatedAt: '2026-02-14 10:00:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    productCode: 'P013',
    productName: '마그네슘정',
    feeRate: 4,
    finalFeeRate: 4,
    ediCode: '100001013',
    createdAt: '2026-02-15 09:00:00',
    updatedAt: '2026-02-15 09:00:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    productCode: 'P014',
    productName: '콜라겐드링크',
    feeRate: 5.5,
    finalFeeRate: 5.5,
    ediCode: '100001014',
    createdAt: '2026-02-16 14:30:00',
    updatedAt: '2026-02-16 14:30:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    productCode: 'P015',
    productName: '밀크씨슬',
    feeRate: 4,
    finalFeeRate: 4,
    ediCode: '100001015',
    createdAt: '2026-02-18 11:00:00',
    updatedAt: '2026-02-18 11:00:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
];

/** 흡수율 더미용 월 목록 (최근 6개월) */
const ABSORPTION_MONTHS = (() => {
  const list: string[] = [];
  const now = new Date();
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    list.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return list;
})();

/** ========== 더미: 품목별 흡수율 (월별) ========== */
export const mockProductAbsorptionRates: ProductAbsorptionRate[] = (() => {
  const list: ProductAbsorptionRate[] = [];
  ABSORPTION_MONTHS.forEach((month) => {
    mockProductFees.forEach((p, i) => {
      const salesAmount = (100 + (i % 15) * 50) * 10000;
      const prescriptionAmount = Math.round(salesAmount * (0.7 + (i % 30) / 100));
      list.push({
        productCode: p.productCode,
        productName: p.productName,
        month,
        absorptionRate: 72 + (i % 23),
        salesAmount,
        prescriptionAmount,
      });
    });
  });
  return list;
})();

/** ========== 더미: 병원별 품목 흡수율 (월별) ========== */
function generateHospitalProductAbsorptionRates(): HospitalProductAbsorptionRate[] {
  const list: HospitalProductAbsorptionRate[] = [];
  const hospitals = mockHospitals.slice(0, 20);
  ABSORPTION_MONTHS.forEach((month) => {
    hospitals.forEach((h, hi) => {
      mockProductFees.forEach((p, pi) => {
        const salesAmount = (80 + ((hi + pi) % 20) * 30) * 10000;
        const prescriptionAmount = Math.round(salesAmount * (0.65 + ((hi + pi) % 35) / 100));
        list.push({
          hospitalId: h.id,
          productCode: p.productCode,
          productName: p.productName,
          month,
          absorptionRate: 65 + ((hi + pi) % 30),
          salesAmount,
          prescriptionAmount,
        });
      });
    });
  });
  return list;
}
export const mockHospitalProductAbsorptionRates: HospitalProductAbsorptionRate[] =
  generateHospitalProductAbsorptionRates();

const PROMR_CORP_IDS = new Set(['corp-2']);
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
  {
    id: 'p-1',
    salesRowIds: salesIdsForPrescription.slice(0, 5),
    hospitalId: 'h-1',
    corporationId: 'corp-1',
    imageUrls: ['https://placehold.co/400x300/e2e8f0/64748b?text=Rx+1'],
    uploadedAt: '2026-02-01T14:00:00',
    settlementMonth: '2026-01',
  },
  {
    id: 'p-2',
    salesRowIds: salesIdsForPrescription.slice(5, 10),
    hospitalId: 'h-2',
    corporationId: 'corp-1',
    imageUrls: ['https://placehold.co/400x300/e2e8f0/64748b?text=Rx+2'],
    uploadedAt: '2026-02-02T15:00:00',
    settlementMonth: '2026-01',
  },
  {
    id: 'p-3',
    salesRowIds: salesIdsForPrescription.slice(10, 15),
    hospitalId: 'h-3',
    corporationId: 'corp-2',
    imageUrls: ['https://placehold.co/400x300/e2e8f0/64748b?text=Rx+3'],
    uploadedAt: '2026-02-03T16:00:00',
    settlementMonth: '2026-01',
  },
  {
    id: 'p-4',
    salesRowIds: salesIdsForPrescription.slice(15, 22),
    hospitalId: 'h-4',
    corporationId: 'corp-2',
    imageUrls: [
      'https://placehold.co/400x300/e2e8f0/64748b?text=Rx+4',
      'https://placehold.co/400x300/e2e8f0/64748b?text=Rx+4-2',
    ],
    uploadedAt: '2026-02-05T10:00:00',
    settlementMonth: '2026-02',
  },
  {
    id: 'p-5',
    salesRowIds: salesIdsForPrescription.slice(22, 28),
    hospitalId: null,
    corporationId: 'corp-3',
    imageUrls: ['https://placehold.co/400x300/e2e8f0/64748b?text=Rx+전체'],
    uploadedAt: '2026-02-10T11:00:00',
    settlementMonth: '2026-02',
  },
];

/** ========== 더미: 필터링 승인요청 (해당 병의원 거래 허용 여부 요청) ========== */
export const mockFilterRequests: FilterRequest[] = [
  {
    id: 'fr-1',
    corporationId: 'corp-1',
    hospitalId: 'h-1',
    status: 'pending',
    requestedAt: '2026-02-24T09:00:00',
    createdAt: '2026-02-24T09:00:00',
    createdBy: MOCK_USER,
  },
  {
    id: 'fr-2',
    corporationId: 'corp-1',
    hospitalId: 'h-5',
    status: 'pending',
    requestedAt: '2026-02-24T11:30:00',
    createdAt: '2026-02-24T11:30:00',
    createdBy: MOCK_USER,
  },
  {
    id: 'fr-3',
    corporationId: 'corp-2',
    hospitalId: 'h-2',
    status: 'pending',
    requestedAt: '2026-02-23T14:00:00',
    createdAt: '2026-02-23T14:00:00',
    createdBy: MOCK_USER,
  },
  {
    id: 'fr-4',
    corporationId: 'corp-2',
    hospitalId: 'h-6',
    status: 'approved',
    requestedAt: '2026-02-22T10:00:00',
    processedAt: '2026-02-23T09:00:00',
    createdAt: '2026-02-22T10:00:00',
    updatedAt: '2026-02-23T09:00:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
  {
    id: 'fr-5',
    corporationId: 'corp-3',
    hospitalId: 'h-3',
    status: 'rejected',
    requestedAt: '2026-02-21T16:00:00',
    processedAt: '2026-02-22T11:00:00',
    createdAt: '2026-02-21T16:00:00',
    updatedAt: '2026-02-22T11:00:00',
    createdBy: MOCK_USER,
    updatedBy: MOCK_USER,
  },
];

/** ========== 더미: 법인 초대 ========== */
export const mockCorpInvitations: CorpInvitation[] = [
  {
    id: 'inv-1',
    pharmaId: 'pharma-1',
    inviteCode: 'INV-A1B2C3D4',
    status: 'accepted',
    corporationId: 'corp-1',
    invitedAt: '2026-01-05T10:00:00',
    invitedEmail: 'admin@corp1.com',
    subcontracting: true,
  },
  {
    id: 'inv-2',
    pharmaId: 'pharma-1',
    inviteCode: 'INV-E5F6G7H8',
    status: 'accepted',
    corporationId: 'corp-2',
    invitedAt: '2026-01-10T14:00:00',
    invitedEmail: 'admin@corp2.com',
    subcontracting: false,
  },
  {
    id: 'inv-3',
    pharmaId: 'pharma-1',
    inviteCode: 'INV-I9J0K1L2',
    status: 'accepted',
    corporationId: 'corp-3',
    invitedAt: '2026-01-15T09:00:00',
    subcontracting: false,
  },
  {
    id: 'inv-4',
    pharmaId: 'pharma-1',
    inviteCode: 'INV-M3N4O5P6',
    status: 'pending',
    invitedAt: '2026-01-20T11:00:00',
    invitedEmail: 'admin@newcorp.com',
    subcontracting: true,
  },
  {
    id: 'inv-5',
    pharmaId: 'pharma-1',
    inviteCode: 'INV-Q7R8S9T0',
    status: 'accepted',
    corporationId: 'corp-4',
    invitedAt: '2026-01-22T15:30:00',
    invitedEmail: 'ops@corp4.demo',
    subcontracting: true,
  },
  {
    id: 'inv-6',
    pharmaId: 'pharma-1',
    inviteCode: 'INV-U1V2W3X4',
    status: 'pending',
    invitedAt: '2026-02-01T09:00:00',
    invitedEmail: 'contact@pending-corp.kr',
    subcontracting: false,
  },
  {
    id: 'inv-7',
    pharmaId: 'pharma-2',
    inviteCode: 'INV-HP-Y5Z6A7B8',
    status: 'accepted',
    corporationId: 'corp-2',
    invitedAt: '2026-01-08T11:00:00',
    invitedEmail: 'good@corp2.com',
    subcontracting: false,
  },
  {
    id: 'inv-8',
    pharmaId: 'pharma-2',
    inviteCode: 'INV-HP-C9D0E1F2',
    status: 'pending',
    invitedAt: '2026-02-10T14:00:00',
    subcontracting: true,
  },
  {
    id: 'inv-9',
    pharmaId: 'pharma-3',
    inviteCode: 'INV-BP-G3H4I5J6',
    status: 'accepted',
    corporationId: 'corp-1',
    invitedAt: '2026-01-12T10:00:00',
    subcontracting: true,
  },
  {
    id: 'inv-10',
    pharmaId: 'pharma-3',
    inviteCode: 'INV-BP-K7L8M9N0',
    status: 'accepted',
    corporationId: 'corp-3',
    invitedAt: '2026-01-18T16:00:00',
    subcontracting: false,
  },
];

/** ========== 더미: 딜러(영업사원) ========== */
/** corp-1(한국메디컬) 딜러는 contractManagementMock 행 id 2(4종 제출·재위탁)와 맞춤 */
export const mockDealers: Dealer[] = [
  {
    id: 'd-1',
    corporationId: 'corp-1',
    salespersonName: '김영업',
    phone: '010-1234-5678',
    email: 'kim@hanmedical.demo',
    reportCertUrl: DEMO_REPORT_CERTIFICATE_SAMPLE_URL,
    contractUrl: DEMO_CONTRACT_SAMPLE_URL,
    subcontractContractUrl: DEMO_SUBCONTRACT_CONTRACT_SAMPLE_URL,
    businessLicenseUrl: demoContractPlaceholderUrl('HanMedical-license'),
    subcontracting: true,
    createdAt: '2026-01-10T10:00:00',
  },
  {
    id: 'd-2',
    corporationId: 'corp-1',
    salespersonName: '이담당',
    phone: '010-2345-6789',
    email: 'lee@hanmedical.demo',
    reportCertUrl: DEMO_REPORT_CERTIFICATE_SAMPLE_URL,
    contractUrl: DEMO_CONTRACT_SAMPLE_URL,
    subcontractContractUrl: DEMO_SUBCONTRACT_CONTRACT_SAMPLE_URL,
    businessLicenseUrl: demoContractPlaceholderUrl('HanMedical2-license'),
    subcontracting: true,
    createdAt: '2026-01-15T14:00:00',
  },
  {
    id: 'd-3',
    corporationId: 'corp-2',
    salespersonName: '박세일',
    phone: '010-3456-7890',
    email: 'park@corp2.com',
    reportCertUrl: DEMO_REPORT_CERTIFICATE_SAMPLE_URL,
    createdAt: '2026-01-20T09:00:00',
  },
  {
    id: 'd-4',
    corporationId: 'corp-2',
    salespersonName: '최대리',
    phone: '010-4567-8901',
    email: 'choi@corp2.com',
    reportCertUrl: DEMO_REPORT_CERTIFICATE_SAMPLE_URL,
    contractUrl: DEMO_CONTRACT_SAMPLE_URL,
    subcontractContractUrl: DEMO_SUBCONTRACT_CONTRACT_SAMPLE_URL,
    businessLicenseUrl: demoContractPlaceholderUrl('사업자등록증'),
    createdAt: '2026-02-01T11:00:00',
  },
];

/** ========== 더미: 지역별 정산 ========== */
const REGION_AMOUNTS = [
  12000000, 8500000, 6200000, 9100000, 4300000, 3800000, 2900000, 45000000, 12000000, 5800000,
  7200000, 8900000, 6700000, 5400000, 7800000, 6200000, 4100000, 1500000,
];
const REGION_QUANTITIES = [
  120, 85, 62, 91, 43, 38, 29, 450, 120, 58, 72, 89, 67, 54, 78, 62, 41, 15,
];

export const mockRegionStats: RegionStat[] = Object.entries(REGION_NAMES).map(
  ([code, name], i) => ({
    regionCode: code,
    regionName: name,
    amount: REGION_AMOUNTS[i] ?? 5000000,
    quantity: REGION_QUANTITIES[i] ?? 50,
  }),
);
