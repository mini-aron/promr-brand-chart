import Link from 'next/link';

export type NotFoundViewProps = {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

/**
 * app/not-found 및 클라이언트에서 리소스 미발견 시 동일한 UI를 제공하기 위한 컴포넌트.
 */
export function NotFoundView({
  title = '페이지를 찾을 수 없습니다',
  description,
  primaryHref = '/',
  primaryLabel = '홈으로 돌아가기',
  secondaryHref,
  secondaryLabel,
}: NotFoundViewProps) {
  return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: description ? 8 : 16 }}>{title}</h1>
      {description ? (
        <p style={{ color: 'var(--color-text-muted)', marginBottom: 20 }}>{description}</p>
      ) : null}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {secondaryHref && secondaryLabel ? (
          <Link href={secondaryHref} style={{ textDecoration: 'underline' }}>
            {secondaryLabel}
          </Link>
        ) : null}
        <Link href={primaryHref} style={{ textDecoration: 'underline' }}>
          {primaryLabel}
        </Link>
      </div>
    </div>
  );
}
