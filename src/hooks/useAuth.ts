/**
 * 인증 상태/액션 훅 (Context 또는 Redux 연동)
 */
export function useAuth() {
  return {
    isAuthenticated: false,
    user: null as { id: string; email: string } | null,
    login: async (_email: string, _password: string) => {},
    logout: () => {},
  };
}
