import { http, HttpResponse } from 'msw';
import type { GetAgreementListResponse } from '@/types/services/agreementService';

/** MSW demo — production uses API `content` */
const mockAgreementList: GetAgreementListResponse = {
  list: [
    {
      id: 1,
      agreementType: 'TERMS_OF_SERVICE',
      version: '1.0',
      required: true,
      content:
        'Article 1 (Purpose)\nThis Terms of Service governs use of the service.\n\nArticle 2 (Definitions)\nTerms used herein are defined as set forth below.\n\n(MSW demo — replace with production content.)',
      effectiveFrom: '2026-01-01',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      agreementType: 'PRIVACY_POLICY',
      version: '1.0',
      required: true,
      content:
        '1. Personal data collected\nName, email, phone, business registration data may be collected at signup.\n\n2. Purposes of use\nService provision, identity verification, legal compliance.\n\n3. Retention\nRetained as required by law or policy, then destroyed.\n\n(MSW demo — replace with production content.)',
      effectiveFrom: '2026-01-01',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 3,
      agreementType: 'MARKETING_CONSENT',
      version: '1.0',
      required: false,
      content:
        'You may receive marketing by email or SMS (events, promotions, new features). Declining does not restrict signup or core service use.\n\n(MSW demo.)',
      effectiveFrom: '2026-01-01',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    },
  ],
};

export const agreementHandlers = [
  http.get('*/agreement/list', () => HttpResponse.json(mockAgreementList)),
];
