import { create } from 'zustand';
import type { ThemeMode } from '@/theme';

const STORAGE_KEY = 'promr-theme';

function readStoredMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light';
  const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
  if (stored === 'light' || stored === 'dark') return stored;
  return 'light';
}

function applyDataTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', mode);
}

type ThemeState = {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  themeMode: 'light',
  setThemeMode: (mode) => {
    set({ themeMode: mode });
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, mode);
      applyDataTheme(mode);
    }
  },
  toggleTheme: () => {
    const next = get().themeMode === 'light' ? 'dark' : 'light';
    get().setThemeMode(next);
  },
}));

/** Providers 트리 최초 클라이언트 렌더에서 localStorage와 DOM을 스토어와 맞춤 */
export function hydrateThemeFromStorage(): void {
  const mode = readStoredMode();
  useThemeStore.setState({ themeMode: mode });
  applyDataTheme(mode);
}

export function useThemeMode() {
  const themeMode = useThemeStore((s) => s.themeMode);
  const setThemeMode = useThemeStore((s) => s.setThemeMode);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  return { themeMode, setThemeMode, toggleTheme };
}
