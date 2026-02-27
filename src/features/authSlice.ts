/**
 * Redux auth 슬라이스.
 * 사용 시: npm install @reduxjs/toolkit react-redux
 * store.ts에서 configureStore에 authReducer 등록.
 */
export const authSliceName = 'auth';

export interface AuthState {
  token: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  token: null,
  userId: null,
};

export function authReducer(state = initialState, action: { type: string; payload?: unknown }): AuthState {
  switch (action.type) {
    case 'auth/setToken':
      return { ...state, token: action.payload as string | null };
    case 'auth/setUserId':
      return { ...state, userId: action.payload as string | null };
    default:
      return state;
  }
}
