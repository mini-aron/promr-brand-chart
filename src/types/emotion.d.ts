/** Emotion css prop 타입 (아직 Emotion 사용 중인 컴포넌트용) */
import type { SerializedStyles } from '@emotion/react';

declare module 'react' {
  interface DOMAttributes<T> {
    css?: SerializedStyles | Array<SerializedStyles | false | undefined>;
  }
}
