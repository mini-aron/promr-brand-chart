import { getPageMetadata } from '@/lib/metadata/site';
import { SignupPage } from '@/features/auth/SignupPage';

export const metadata = getPageMetadata({
  title: '회원가입',
  description: '회원가입 신청 페이지입니다.',
  canonicalPath: '/signup',
});

export default function SignupRoute() {
  return <SignupPage />;
}
