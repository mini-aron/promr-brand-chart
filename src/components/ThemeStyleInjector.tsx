'use client';

import { useRef, type ReactNode } from 'react';
import { hydrateThemeFromStorage } from '@/store/themeStore';

const lightVars = `
  --color-primary: #2563eb;
  --color-primary-hover: #1d4ed8;
  --color-secondary: #64748b;
  --color-background: #f8fafc;
  --color-surface: #ffffff;
  --color-border: #e2e8f0;
  --color-text: #0f172a;
  --color-text-muted: #64748b;
  --color-success: #16a34a;
  --color-error: #dc2626;
  --color-overlay: rgba(0,0,0,0.4);
  --color-overlay-strong: rgba(0,0,0,0.6);
  --color-button-text: #ffffff;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
`;

const darkVars = `
  --color-primary: #3b82f6;
  --color-primary-hover: #60a5fa;
  --color-secondary: #94a3b8;
  --color-background: #0f172a;
  --color-surface: #1e293b;
  --color-border: #334155;
  --color-text: #f1f5f9;
  --color-text-muted: #94a3b8;
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-overlay: rgba(0,0,0,0.6);
  --color-overlay-strong: rgba(0,0,0,0.8);
  --color-button-text: #ffffff;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.3);
`;

export function ThemeStyleInjector({ children }: { children: ReactNode }) {
  const didHydrate = useRef(false);
  if (typeof window !== 'undefined' && !didHydrate.current) {
    didHydrate.current = true;
    hydrateThemeFromStorage();
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `:root{${lightVars}}body{color:var(--color-text);background-color:var(--color-background);}:root[data-theme="dark"]{${darkVars}}`,
        }}
      />
      {children}
    </>
  );
}
