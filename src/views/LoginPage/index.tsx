'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';
import { Column } from '@/components/Common/Flex';
import * as s from './index.css';

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
    <div className={s.page}>
      <div className={s.card}>
        <img src="/logo.svg" alt="PROPF" width={122} height={56} className={s.logo} />
        <h1 className={s.title}>로그인</h1>
        <p className={s.subtitle}>
          Promr Brand Chart에 오신 것을 환영합니다
        </p>
        <form onSubmit={handleSubmit}>
          <Column gap={theme.spacing(4)}>
            <div>
              <label htmlFor="email" className={s.label}>
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@company.com"
                className={s.input}
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className={s.label}>
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={s.input}
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
            {error && <div className={s.error}>{error}</div>}
            <Button type="submit" variant="primary" size="default" disabled={isLoading} className={s.submitButton}>
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </Column>
        </form>
        <Link href="/promotion" className={s.link}>
          프로모션 페이지로 돌아가기
        </Link>
      </div>
    </div>
  );
}
