import type { Metadata } from 'next';

export const SITE_NAME = 'Promr';

const DEFAULT_DESCRIPTION = 'Promr 실적·처방 관리';

function getMetadataBase(): URL {
  const raw = process.env.NEXT_PUBLIC_APP_URL;
  if (raw) return new URL(raw);
  return new URL('http://localhost:5001');
}

export function getRootMetadata(): Metadata {
  return {
    metadataBase: getMetadataBase(),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    openGraph: {
      type: 'website',
      locale: 'ko_KR',
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
    },
  };
}

type PageMetaInput = {
  title: string;
  description: string;
  canonicalPath?: string;
};

export function getPageMetadata({ title, description, canonicalPath }: PageMetaInput): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    openGraph: {
      title: fullTitle,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
    },
    ...(canonicalPath ? { alternates: { canonical: canonicalPath } } : {}),
  };
}
