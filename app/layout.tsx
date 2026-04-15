/* @jsxImportSource react */
import type { Metadata } from 'next';
import nextDynamic from 'next/dynamic';
import { DevToolsTimingDetector } from '@/components/DevToolsTimingDetector';
import './globals.css';

const Providers = nextDynamic(
  () => import('@/shared/components/providers/Providers').then((m) => ({ default: m.Providers })),
  { ssr: false },
);

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    default: 'Promr',
    template: '%s | Promr',
  },
  description: 'Promr 실적·처방 관리',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <DevToolsTimingDetector />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
