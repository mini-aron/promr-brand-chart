export type TokenPair = {
  accessToken: string;
};

export type LoginRequest = {
  accountId: string;
  password: string;
};

export type RegisterCorpRequest = {
  name: string;
  accountId: string;
  password: string;
  organizationName: string;
  email: string;
  businessRegistrationFileName: string;
  businessName: string;
  businessNumber: string;
};

export type RegisterDealerRequest = RegisterCorpRequest & {
  phoneNumber: string;
};

export type RegisterPharmaRequest = {
  name: string;
  accountId: string;
  password: string;
  organizationName: string;
  email: string;
  businessRegistrationFileName: string;
  businessName: string;
  businessNumber: string;
  brandId: number;
  deadlineDate?: number | null;
  representativeLogo: string;
};

export type BusinessFileOcrResponse = {
  fileName: string; //directory
  bussinessName: string;
  businessNumber: string;
};

export type PatchRepresentativeLogoResponse = {
  representativeLogo: string;
};
