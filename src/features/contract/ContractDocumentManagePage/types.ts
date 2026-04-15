export type ContractDocumentStatus = 'valid' | 'expired';

export type ContractDocumentRow = {
  id: string;
  csoName: string;
  contractDate: string;
  expiryDate: string;
  status: ContractDocumentStatus;
  /** 법인이 등록할 수 있는 서류 종류 */
  documents: {
    reportCert: boolean;
    contract: boolean;
    subcontractContract: boolean;
    businessLicense: boolean;
    /** CSO 교육 이수증 */
    csoTrainingCert: boolean;
  };
  /** 서류별 다운로드 URL(미지정 시 데모 기본 URL 사용) */
  documentUrls?: Partial<{
    reportCert: string;
    contract: string;
    subcontractContract: string;
    businessLicense: string;
    csoTrainingCert: string;
  }>;
  subcontracting: boolean;
};
