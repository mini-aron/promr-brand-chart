/** 동의·약관 문서 공통 구조 타입 */

export type ConsentParagraph = {
  text: string;
};

export type TermsBlockKind = 'chapter' | 'article';

export type TermsBlock = {
  kind: TermsBlockKind;
  subheading: string;
  /** 조항 표기(예: 제3자 동의 `showClauseIndicator`와 동일한 렌더 훅) */
  showClauseIndicator?: boolean;
  paragraphs: ConsentParagraph[];
};

export type TermsDocument = {
  mainTitle: string;
  content: TermsBlock[];
};

export type ThirdPartyConsentSection = {
  subheading?: string;
  showClauseIndicator: boolean;
  paragraphs: ConsentParagraph[];
};

export type ThirdPartyConsentDocument = {
  mainTitle: string;
  content: ThirdPartyConsentSection[];
};
