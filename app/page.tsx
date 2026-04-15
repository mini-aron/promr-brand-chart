import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_ACCESS_COOKIE } from '@/utils/authCookies';

/**
 * 서버에서 access 쿠키 여부로 분기. 클라이언트 useAuthSession과 동일한 `promr_auth_token`을 본다.
 */
export default function RootPage() {
  const token = cookies().get(AUTH_ACCESS_COOKIE)?.value;
  if (token) {
    redirect('/home');
  }
  redirect('/promotion');
}
