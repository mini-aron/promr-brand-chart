export type AgreementType = 'TERMS_OF_SERVICE' | 'PRIVACY_POLICY' | 'MARKETING_CONSENT';

export type AgreementItem = {
  id: number;
  agreementType: AgreementType;
  version: string;
  required: boolean;
  content: string;
  effectiveFrom: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateAgreementParams = {
  agreementType: AgreementType;
  version: string;
  required: boolean;
  content: string;
  effectiveFrom: string;
};

export type GetAgreementListResponse = {
  list: AgreementItem[];
};
