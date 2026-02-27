/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { theme } from '@/theme';

/**
 * 필터 영역 input/select와 동일한 크기.
 * Select size="large"와 맞추기 위한 공통 스타일.
 */
export const filterFieldInput = css({
  boxSizing: 'border-box',
  display: 'block',
  width: '100%',
  minHeight: 48,
  padding: `0 ${theme.spacing(3)}px`,
  fontSize: 15,
  borderRadius: theme.radius.md,
  border: `2px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  '&::placeholder': { color: theme.colors.textMuted },
  '&:hover': { borderColor: theme.colors.primary },
  '&:focus': {
    outline: 'none',
    borderColor: theme.colors.primary,
    boxShadow: `0 0 0 3px ${theme.colors.primary}20`,
  },
});
