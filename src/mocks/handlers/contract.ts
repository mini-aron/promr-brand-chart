import { http, HttpResponse } from 'msw';
import type {
  ContractRequestParams,
  ContractRequestResponse,
  GetContractRequestDetailResponse,
  GetContractRequestResponse,
  GetReEntrusContractDetailResponse,
  GetReEntrusContractGraphResponse,
  GetReEntrusContractListResponse,
  GetUploadedContractListResponse,
} from '@/types/services/contractService';

let mockContractRequestSeq = 1000;

const MOCK_CONTRACT_PREVIEW_PATH = '/demo/contract_sample.png';
const MOCK_REPORT_PREVIEW_PATH = '/demo/report_certificate_sample.png';
const MOCK_SUBCONTRACT_PREVIEW_PATH = '/demo/subcontract_contract_sample.png';

type MockDocumentFields = GetContractRequestDetailResponse['documents'] & {
  csoTrainingCompletionCertificateFileName?: string;
};

function createMockDocuments(
  salesDeclarationCertificateFileName: string,
  csoTrainingFileName: string,
  businessRegistrationFileName: string,
): MockDocumentFields {
  return {
    salesDeclarationCertificateFileName,
    // 서버/프론트 오타 혼재 대응: 두 키를 함께 내려준다.
    csoTraningCompletionCertificateFileName: csoTrainingFileName,
    csoTrainingCompletionCertificateFileName: csoTrainingFileName,
    businessRegistrationFileName,
  };
}

function buildMockContractRequestDetail(
  item: ContractRequestResponse,
): GetContractRequestDetailResponse {
  return {
    contractRequestId: item.contractRequestId,
    contractStatus: item.contractStatus,
    reason: item.reason,
    sendType: item.sendType,
    phoneNumber: item.phoneNumber,
    email: item.email,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    corporation: {
      id: item.contractRequestId + 100,
      businessName: `${item.alias} 법인`,
      businessNumber: `100-00-${String(item.contractRequestId).padStart(5, '0')}`,
    },
    contract: {
      id: item.contractRequestId + 5000,
      contractFileName: MOCK_CONTRACT_PREVIEW_PATH,
      startDate: '2026-04-15',
      endDate: '2027-04-14',
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    },
    documents: createMockDocuments(
      MOCK_REPORT_PREVIEW_PATH,
      MOCK_CONTRACT_PREVIEW_PATH,
      MOCK_CONTRACT_PREVIEW_PATH,
    ),
  };
}

const mockContractRequestStore: ContractRequestResponse[] = [
  {
    contractRequestId: 1,
    alias: '\uC0D8\uD50C \uC774\uBA54\uC77C \uC694\uCCAD',
    contractStatus: 'REQUESTED',
    reason: '',
    sendType: 'EMAIL',
    email: 'contracts@demo.kr',
    createdAt: '2026-04-01T08:00:00.000Z',
    updatedAt: '2026-04-01T08:00:00.000Z',
  },
  {
    contractRequestId: 2,
    alias: '\uC0D8\uD50C \uC804\uD654 \uC694\uCCAD',
    contractStatus: 'SUBMITTED',
    reason: '',
    sendType: 'PHONE',
    phoneNumber: '01012345678',
    createdAt: '2026-04-02T09:00:00.000Z',
    updatedAt: '2026-04-02T10:00:00.000Z',
  },
];

const mockContractRequestDetailMap: Record<number, GetContractRequestDetailResponse> = {
  1: {
    contractRequestId: 1,
    contractStatus: 'REQUESTED',
    reason: '',
    sendType: 'EMAIL',
    email: 'contracts@demo.kr',
    createdAt: '2026-04-01T08:00:00.000Z',
    updatedAt: '2026-04-01T08:00:00.000Z',
    corporation: {
      id: 101,
      businessName: '샘플 메디컬',
      businessNumber: '123-45-67890',
    },
    contract: {
      id: 5001,
      contractFileName: MOCK_CONTRACT_PREVIEW_PATH,
      startDate: '2026-04-01',
      endDate: '2027-03-31',
      createdAt: '2026-04-01T08:00:00.000Z',
      updatedAt: '2026-04-01T08:00:00.000Z',
    },
    documents: createMockDocuments(
      MOCK_REPORT_PREVIEW_PATH,
      MOCK_CONTRACT_PREVIEW_PATH,
      MOCK_CONTRACT_PREVIEW_PATH,
    ),
  },
  2: {
    contractRequestId: 2,
    contractStatus: 'SUBMITTED',
    reason: '',
    sendType: 'PHONE',
    phoneNumber: '01012345678',
    createdAt: '2026-04-02T09:00:00.000Z',
    updatedAt: '2026-04-02T10:00:00.000Z',
    corporation: {
      id: 102,
      businessName: '데모 헬스케어',
      businessNumber: '234-56-78901',
    },
    contract: {
      id: 5002,
      contractFileName: MOCK_CONTRACT_PREVIEW_PATH,
      startDate: '2026-04-02',
      endDate: '2027-04-01',
      createdAt: '2026-04-02T09:00:00.000Z',
      updatedAt: '2026-04-02T10:00:00.000Z',
    },
    documents: createMockDocuments(MOCK_REPORT_PREVIEW_PATH, '', MOCK_CONTRACT_PREVIEW_PATH),
  },
};

const mockReEntrusGraph: GetReEntrusContractGraphResponse = {
  list: [
    {
      corporationId: 101,
      corporationName: '굿모닝위탁',
      contractStatus: 'APPROVED',
      child: [
        {
          depth: 2,
          corporationId: 201,
          corporationName: '헬스케어CSO',
          contractStatus: 'SUBMITTED',
        },
        {
          depth: 3,
          corporationId: 301,
          corporationName: '메디팜위탁',
          contractStatus: 'REJECTED',
        },
      ],
    },
    {
      corporationId: 101,
      corporationName: '굿모닝위탁',
      contractStatus: 'APPROVED',
      child: [
        {
          depth: 2,
          corporationId: 202,
          corporationName: '케어솔루션',
          contractStatus: 'APPROVED',
        },
      ],
    },
    {
      corporationId: 101,
      corporationName: '굿모닝위탁',
      contractStatus: 'APPROVED',
      child: [
        {
          depth: 2,
          corporationId: 203,
          corporationName: '그린헬스파트너스',
          contractStatus: 'RESUBMIT_REQUESTED',
        },
        {
          depth: 3,
          corporationId: 303,
          corporationName: '서울메디유통',
          contractStatus: 'SUBMITTED',
        },
        {
          depth: 4,
          corporationId: 403,
          corporationName: '베스트케어링크',
          contractStatus: 'APPROVED',
        },
      ],
    },
    {
      corporationId: 104,
      corporationName: '온누리바이오',
      contractStatus: 'REJECTED',
      child: [
        {
          depth: 2,
          corporationId: 204,
          corporationName: '프라임헬스케어',
          contractStatus: 'REQUESTED',
        },
      ],
    },
  ],
};

const mockReEntrusDetailMap: Record<number, GetReEntrusContractDetailResponse> = {
  101: {
    depth: 1,
    reEntrustContractId: 9001,
    reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
    corporationName: '굿모닝위탁',
    contractStatus: 'APPROVED',
    startDate: '2026-03-15',
    expireDate: '2027-03-14',
    documents: createMockDocuments(
      MOCK_REPORT_PREVIEW_PATH,
      MOCK_CONTRACT_PREVIEW_PATH,
      MOCK_CONTRACT_PREVIEW_PATH,
    ),
  },
  102: {
    depth: 1,
    reEntrustContractId: 9002,
    reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
    corporationName: '굿모닝위탁',
    contractStatus: 'SUBMITTED',
    startDate: '2026-04-01',
    expireDate: '2027-03-31',
    documents: createMockDocuments(MOCK_REPORT_PREVIEW_PATH, '', MOCK_CONTRACT_PREVIEW_PATH),
  },
  201: {
    depth: 2,
    reEntrustContractId: 9201,
    reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
    corporationName: '헬스케어CSO',
    contractStatus: 'SUBMITTED',
    startDate: '2026-04-01',
    expireDate: '2027-03-14',
    documents: createMockDocuments('', MOCK_CONTRACT_PREVIEW_PATH, MOCK_CONTRACT_PREVIEW_PATH),
  },
  202: {
    depth: 2,
    reEntrustContractId: 9202,
    reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
    corporationName: '케어솔루션',
    contractStatus: 'APPROVED',
    startDate: '2026-04-10',
    expireDate: '2027-04-09',
    documents: createMockDocuments(
      MOCK_REPORT_PREVIEW_PATH,
      MOCK_CONTRACT_PREVIEW_PATH,
      MOCK_CONTRACT_PREVIEW_PATH,
    ),
  },
  301: {
    depth: 3,
    reEntrustContractId: 9301,
    reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
    corporationName: '메디팜위탁',
    contractStatus: 'REJECTED',
    startDate: '2026-04-12',
    expireDate: '2026-12-31',
    documents: createMockDocuments('', '', MOCK_CONTRACT_PREVIEW_PATH),
  },
  103: {
    depth: 1,
    reEntrustContractId: 9003,
    reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
    corporationName: '굿모닝위탁',
    contractStatus: 'REQUESTED',
    startDate: '2026-05-01',
    expireDate: '2027-04-30',
    documents: createMockDocuments('', '', MOCK_CONTRACT_PREVIEW_PATH),
  },
  104: {
    depth: 1,
    reEntrustContractId: 9004,
    reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
    corporationName: '온누리바이오',
    contractStatus: 'REJECTED',
    startDate: '2026-02-10',
    expireDate: '2026-11-30',
    documents: createMockDocuments('', '', MOCK_CONTRACT_PREVIEW_PATH),
  },
  203: {
    depth: 2,
    reEntrustContractId: 9203,
    reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
    corporationName: '그린헬스파트너스',
    contractStatus: 'RESUBMIT_REQUESTED',
    startDate: '2026-05-10',
    expireDate: '2027-05-09',
    documents: createMockDocuments(MOCK_REPORT_PREVIEW_PATH, '', MOCK_CONTRACT_PREVIEW_PATH),
  },
  204: {
    depth: 2,
    reEntrustContractId: 9204,
    reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
    corporationName: '프라임헬스케어',
    contractStatus: 'REQUESTED',
    startDate: '2026-06-01',
    expireDate: '2027-05-31',
    documents: createMockDocuments('', MOCK_CONTRACT_PREVIEW_PATH, ''),
  },
  303: {
    depth: 3,
    reEntrustContractId: 9303,
    reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
    corporationName: '서울메디유통',
    contractStatus: 'SUBMITTED',
    startDate: '2026-05-20',
    expireDate: '2027-05-19',
    documents: createMockDocuments(
      MOCK_REPORT_PREVIEW_PATH,
      MOCK_CONTRACT_PREVIEW_PATH,
      MOCK_CONTRACT_PREVIEW_PATH,
    ),
  },
  403: {
    depth: 4,
    reEntrustContractId: 9403,
    reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
    corporationName: '베스트케어링크',
    contractStatus: 'APPROVED',
    startDate: '2026-06-15',
    expireDate: '2027-06-14',
    documents: createMockDocuments(
      MOCK_REPORT_PREVIEW_PATH,
      MOCK_CONTRACT_PREVIEW_PATH,
      MOCK_CONTRACT_PREVIEW_PATH,
    ),
  },
};

const mockReEntrusList: GetReEntrusContractListResponse = {
  list: [
    {
      reEntrustContractId: 101,
      reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
      pharmaceuticalName: '샘플제약',
      contracteeName: '샘플 메디컬',
      contractorName: '상위 CSO A',
      startDate: '2026-03-15',
      expireDate: '2027-03-14',
      contractStatus: 'APPROVED',
      reason: '',
      createdAt: '2026-04-01T08:00:00.000Z',
      updatedAt: '2026-04-01T08:00:00.000Z',
    },
    {
      reEntrustContractId: 201,
      reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
      pharmaceuticalName: '샘플제약',
      contracteeName: '베스트 CSO',
      contractorName: '상위 CSO B',
      startDate: '2026-04-01',
      expireDate: '2027-03-14',
      contractStatus: 'SUBMITTED',
      reason: '',
      createdAt: '2026-04-03T09:30:00.000Z',
      updatedAt: '2026-04-03T10:00:00.000Z',
    },
    {
      reEntrustContractId: 301,
      reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
      pharmaceuticalName: '데모바이오',
      contracteeName: '메디 위탁',
      contractorName: '상위 CSO C',
      startDate: '2026-04-12',
      expireDate: '2026-12-31',
      contractStatus: 'REJECTED',
      reason: '서류 누락',
      createdAt: '2026-04-05T07:00:00.000Z',
      updatedAt: '2026-04-05T07:10:00.000Z',
    },
    {
      reEntrustContractId: 203,
      reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
      pharmaceuticalName: 'Green Health',
      contracteeName: 'Reen Care',
      contractorName: 'Lower CSO D',
      startDate: '2026-05-10',
      expireDate: '2027-05-09',
      contractStatus: 'RESUBMIT_REQUESTED',
      reason: 'Business registration resubmission requested',
      createdAt: '2026-04-07T11:20:00.000Z',
      updatedAt: '2026-04-07T11:50:00.000Z',
    },
    {
      reEntrustContractId: 303,
      reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
      pharmaceuticalName: 'Seoul Medi',
      contracteeName: 'Seoul Medi Distribution',
      contractorName: 'Lower CSO E',
      startDate: '2026-05-20',
      expireDate: '2027-05-19',
      contractStatus: 'SUBMITTED',
      reason: '',
      createdAt: '2026-04-09T10:00:00.000Z',
      updatedAt: '2026-04-09T10:05:00.000Z',
    },
    {
      reEntrustContractId: 204,
      reEntrustContractFileName: MOCK_SUBCONTRACT_PREVIEW_PATH,
      pharmaceuticalName: 'Prime Pharma',
      contracteeName: 'Prime Distribution',
      contractorName: 'Lower CSO F',
      startDate: '2026-06-01',
      expireDate: '2027-05-31',
      contractStatus: 'REQUESTED',
      reason: '',
      createdAt: '2026-04-10T09:00:00.000Z',
      updatedAt: '2026-04-10T09:00:00.000Z',
    },
  ],
};

const mockUploadedContractList: GetUploadedContractListResponse = {
  list: [
    {
      id: 1,
      contractorId: 101,
      contractorName: '한국메디컬',
      contracteeId: 201,
      contracteeName: '샘플 제약',
      contractFileName: 'sample-contract-2026-01.pdf',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      createdAt: '2026-01-01T09:00:00.000Z',
      updatedAt: '2026-01-01T09:00:00.000Z',
      contractStatus: 'APPROVED',
      reason: '',
    },
    {
      id: 2,
      contractorId: 101,
      contractorName: '한국메디컬',
      contracteeId: 202,
      contracteeName: '데모 메디컬',
      contractFileName: 'demo-medical-contract.pdf',
      startDate: '2026-03-01',
      endDate: '2027-02-28',
      createdAt: '2026-03-01T10:30:00.000Z',
      updatedAt: '2026-03-01T10:30:00.000Z',
      contractStatus: 'SUBMITTED',
      reason: '',
    },
  ],
};

function nowIso(): string {
  return new Date().toISOString();
}

/** `requestContract` POST — `contractService.requestContract`와 동일 경로 */
export const contractHandlers = [
  http.post('*/contract/request', async ({ request }) => {
    let body: Partial<ContractRequestParams> = {};
    try {
      body = (await request.json()) as ContractRequestParams;
    } catch {
      /* ignore */
    }

    const sendType = body.sendType === 'PHONE' ? 'PHONE' : 'EMAIL';
    const alias = body.alias?.trim() || 'mock-alias';

    const res: ContractRequestResponse = {
      contractRequestId: ++mockContractRequestSeq,
      alias,
      contractStatus: 'REQUESTED',
      reason: '',
      sendType,
      email: sendType === 'EMAIL' ? body.email?.trim() : undefined,
      phoneNumber: sendType === 'PHONE' ? body.phoneNumber : undefined,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    mockContractRequestStore.unshift(res);
    mockContractRequestDetailMap[res.contractRequestId] = buildMockContractRequestDetail(res);
    return HttpResponse.json(res);
  }),
  http.get('*/contract/request/list', ({ request }) => {
    const url = new URL(request.url);
    const contractStatus = url.searchParams.get('contractStatus');
    const sendType = url.searchParams.get('sendType');
    let list = [...mockContractRequestStore];
    if (contractStatus) {
      list = list.filter((r) => r.contractStatus === contractStatus);
    }
    if (sendType) {
      list = list.filter((r) => r.sendType === sendType);
    }
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const body: GetContractRequestResponse = { list };
    return HttpResponse.json(body);
  }),
  http.get('*/contract/request/:contractRequestId', ({ params }) => {
    const contractRequestId = Number(params.contractRequestId);
    if (Number.isNaN(contractRequestId)) {
      return HttpResponse.json({ message: 'invalid contractRequestId' }, { status: 400 });
    }

    const detail = mockContractRequestDetailMap[contractRequestId];
    if (!detail) {
      return HttpResponse.json({ message: 'not found' }, { status: 404 });
    }

    return HttpResponse.json(detail);
  }),
  http.get('*/contract/list', () => {
    return HttpResponse.json(mockUploadedContractList);
  }),
  http.get('*/contract/re-entrust/graph', () => {
    return HttpResponse.json(mockReEntrusGraph);
  }),
  http.get('*/contract/re-entrust/list', () => {
    return HttpResponse.json(mockReEntrusList);
  }),
  http.get('*/contract/re-entrust/:reEntrustContractId', ({ params }) => {
    const reEntrustContractId = Number(params.reEntrustContractId);
    if (!mockReEntrusDetailMap[reEntrustContractId]) {
      return HttpResponse.json({ message: 'not found' }, { status: 404 });
    }
    return HttpResponse.json(mockReEntrusDetailMap[reEntrustContractId]);
  }),
];
