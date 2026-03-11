'use client';
/** @jsxImportSource @emotion/react */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { css } from '@emotion/react';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';
import { Column } from '@/components/Common/Flex';

const pageStyles = css({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.colors.background,
  padding: theme.spacing(6),
});

const cardStyles = css({
  width: '100%',
  maxWidth: 480,
  padding: theme.spacing(8),
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadow.md,
});

const logoStyles = css({
  display: 'block',
  textAlign: 'center',
  fontSize: 36,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  marginBottom: theme.spacing(3),
  '& .logo-pro': { color: theme.colors.primary },
  '& .logo-pf': { color: theme.colors.text },
});

const titleStyles = css({
  fontSize: 24,
  fontWeight: 600,
  color: theme.colors.text,
  marginBottom: theme.spacing(2),
  textAlign: 'center',
});

const subtitleStyles = css({
  fontSize: 15,
  color: theme.colors.textMuted,
  marginBottom: theme.spacing(6),
  textAlign: 'center',
  lineHeight: 1.5,
});

const inputStyles = css({
  width: '100%',
  padding: `${theme.spacing(2.5)}px ${theme.spacing(4)}px`,
  fontSize: 15,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.background,
  color: theme.colors.text,
  boxSizing: 'border-box',
  '&::placeholder': { color: theme.colors.textMuted },
  '&:focus': {
    outline: 'none',
    borderColor: theme.colors.primary,
  },
});

const labelStyles = css({
  fontSize: 14,
  fontWeight: 500,
  color: theme.colors.textMuted,
  marginBottom: theme.spacing(2),
});

const errorStyles = css({
  fontSize: 14,
  color: theme.colors.error,
  marginTop: theme.spacing(2),
});

const linkStyles = css({
  display: 'block',
  fontSize: 15,
  color: theme.colors.primary,
  textDecoration: 'none',
  marginTop: theme.spacing(5),
  textAlign: 'center',
  '&:hover': { textDecoration: 'underline' },
});

export function LoginPage() {
  const router = useRouter();
  const { login, isLoading, isAuthenticated } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) router.replace('/home');
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email.trim(), password);
    } catch {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.');
    }
  };

  return (
    <div css={pageStyles}>
      <div css={cardStyles}>
        <span css={logoStyles}>
          <span className="logo-pro">PRO</span>
          <span className="logo-pf">PF</span>
        </span>
        <h1 css={titleStyles}>로그인</h1>
        <p css={subtitleStyles}>
          Promr Brand Chart에 오신 것을 환영합니다
        </p>
        <form onSubmit={handleSubmit}>
          <Column gap={theme.spacing(4)}>
            <div>
              <label htmlFor="email" css={labelStyles}>
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@company.com"
                css={inputStyles}
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" css={labelStyles}>
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                css={inputStyles}
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
            {error && <div css={errorStyles}>{error}</div>}
            <Button type="submit" variant="primary" size="default" disabled={isLoading} css={css({ width: '100%', padding: `${theme.spacing(3)}px`, fontSize: 16 })}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </Column>
        </form>
        <Link href="/promotion" css={linkStyles}>
          프로모션 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
}
