'use client';

import { AppProvider } from '@/context/AppContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>{children}</AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
