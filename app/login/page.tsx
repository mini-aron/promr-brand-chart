import { getPageMetadata } from '@/lib/metadata/site';
import { LoginPage } from '@/features/auth/LoginPage';

export const metadata = getPageMetadata({
  title: '로그인',
  description: 'Promr Brand Chart에 오신 것을 환영합니다',
  canonicalPath: '/login',
});

export default function LoginRoute() {
  return <LoginPage />;
}
