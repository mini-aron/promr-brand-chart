import type { UserRole } from '@/types';
import { useAppStore } from '@/store/appStore';

const ROLE_CLAIM_KEYS = ['role', 'userRole', 'accountType', 'type'] as const;

function decodeJwtPayload(accessToken: string): Record<string, unknown> | null {
  const parts = accessToken.split('.');
  if (parts.length < 2) return null;
  const payloadSegment = parts[1];
  try {
    const padded = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const padLen = (4 - (padded.length % 4)) % 4;
    const base64 = padded + '='.repeat(padLen);
    const json =
      typeof Buffer !== 'undefined' ? Buffer.from(base64, 'base64').toString('utf8') : atob(base64);
    const parsed: unknown = JSON.parse(json);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function normalizeRole(raw: unknown): UserRole | null {
  if (typeof raw !== 'string') return null;
  const u = raw.toUpperCase();
  if (u.includes('PHARMA') || u === 'PHARMACEUTICAL') return 'pharma';
  if (u.includes('CORP') || u === 'CORPORATION' || u === 'DEALER' || u === 'UPLOADER') {
    return 'corporation';
  }
  if (u === 'ADMIN' || u.includes('ADMIN')) return 'admin';
  return null;
}

function userRoleFromAccessToken(accessToken: string): UserRole | null {
  const payload = decodeJwtPayload(accessToken);
  if (!payload) return null;
  for (const k of ROLE_CLAIM_KEYS) {
    const r = normalizeRole(payload[k]);
    if (r) return r;
  }
  return null;
}

/**
 * JWT payload에서 역할을 읽어 appStore에 반영합니다. 알 수 없으면 null (스토어 변경 없음).
 * 로그인 직후·새로고침 복구에 공통 사용. 서명 검증은 하지 않습니다.
 */
export function applyUserRoleFromAccessToken(accessToken: string): UserRole | null {
  const userRole = userRoleFromAccessToken(accessToken);
  if (!userRole) return null;
  const { setUserRole, setCurrentCorporationId, setCurrentPharmaId } = useAppStore.getState();
  setUserRole(userRole);
  if (userRole === 'corporation') setCurrentCorporationId('corp-1');
  if (userRole === 'pharma') setCurrentPharmaId('pharma-1');
  return userRole;
}
