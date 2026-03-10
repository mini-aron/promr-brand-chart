/** @jsxImportSource @emotion/react */
import type { SerializedStyles } from '@emotion/react';
import type { InputHTMLAttributes } from 'react';
import { filterFieldInput } from '@/style/FilterFieldStyles';

export type FilterInputProps = InputHTMLAttributes<HTMLInputElement> & {
  /** 추가 스타일 (width 제한 등) */
  css?: SerializedStyles;
};

/**
 * 필터 영역용 input. Select와 동일한 높이·패딩(minHeight 48px).
 */
export function FilterInput({ css: customCss, ...props }: FilterInputProps) {
  return <input css={[filterFieldInput, customCss]} {...props} />;
}
