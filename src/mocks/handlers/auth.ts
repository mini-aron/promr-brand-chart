import { http, HttpResponse } from 'msw';
import type {
  BusinessFileOcrResponse,
  PatchRepresentativeLogoResponse,
  TokenPair,
} from '@/types/services/authService';

function base64UrlEncodeJson(obj: Record<string, unknown>): string {
  const json = JSON.stringify(obj);
  const b64 =
    typeof Buffer !== 'undefined' ? Buffer.from(json, 'utf8').toString('base64') : btoa(json);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** 로그인 응답과 동일하게 JWT payload에 `role` 클레임을 넣어 프론트 역할 분기가 동작하도록 함 */
function mockAccessTokenForAccount(accountId: string): string {
  const lower = accountId.toLowerCase();
  let role: string;
  if (lower.includes('admin')) {
    role = 'ADMIN';
  } else if (lower.includes('pharma') || lower.includes('pharm')) {
    role = 'PHARMA';
  } else {
    role = 'CORPORATION';
  }
  const header = base64UrlEncodeJson({ alg: 'none', typ: 'JWT' });
  const payload = base64UrlEncodeJson({ role });
  return `${header}.${payload}.mock-signature`;
}

const MOCK_REFRESH_COOKIE =
  'RefreshToken=Bearer mock-refresh; HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh';

const mockRefreshTokens: TokenPair = {
  accessToken:
    base64UrlEncodeJson({ alg: 'none', typ: 'JWT' }) +
    '.' +
    base64UrlEncodeJson({ role: 'CORPORATION' }) +
    '.mock-signature',
};

const mockOcr: BusinessFileOcrResponse = {
  fileName: 'mock.pdf',
  bussinessName: 'mock-business',
  businessNumber: '000-00-00000',
};

const mockLogo: PatchRepresentativeLogoResponse = {
  representativeLogo: '/mock-logo.png',
};

/** authService 엔드포인트와 1:1, 와일드카드 path로 baseURL 무관 매칭 */
export const authHandlers = [
  http.post('*/auth/login', async ({ request }) => {
    let accountId = '';
    try {
      const body = (await request.json()) as { accountId?: string };
      accountId = body.accountId?.trim() ?? '';
    } catch {
      /* ignore */
    }
    const tokens: TokenPair = {
      accessToken: mockAccessTokenForAccount(accountId),
    };
    return HttpResponse.json(tokens, {
      headers: { 'Set-Cookie': MOCK_REFRESH_COOKIE },
    });
  }),
  http.post('*/refresh', () =>
    HttpResponse.json(mockRefreshTokens, {
      headers: { 'Set-Cookie': MOCK_REFRESH_COOKIE },
    }),
  ),
  http.post('*/auth/logout', () => new HttpResponse(null, { status: 204 })),
  http.post('*/register/corporation', () => HttpResponse.json({})),
  http.post('*/register/dealer', () => HttpResponse.json({})),
  http.post('*/register/pharmaceutical', () => HttpResponse.json({})),
  http.post('*/businessfile', () => HttpResponse.json(mockOcr)),
  http.patch('*/profile/representative', () => HttpResponse.json(mockLogo)),
];
