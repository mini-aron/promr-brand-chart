export type OrganizationType = 'ADMIN' | 'PHARMACEUTICAL' | 'CORPORATION' | 'DEALER' | 'DEALER';

export type OrganizationInfoResponse = {
    organizationType: OrganizationType,
    businessName: string,
    email: string,
    businessRegistrationFileName: string,
    businessNumber: string,
    //법인 
    salesDeclarationCertificateFileName: string | null,
    csoTrainingCompletionCertificateFileName: string | null,
    phoneNumber: string | null,
    //제약사 
    brandId: number | null,
    deadlineDate: string | null,
    representativeLogo: string | null
}