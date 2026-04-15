export type SendType = 'EMAIL' | 'PHONE';

export type ContractStatus = 
'REQUESTED'
| 'SUBMITTED'
| 'APPROVED'
| 'REJECTED'
| 'RESUBMIT_REQUESTED'

export type ContractRequestParams = { 
    sendType: SendType,
    phoneNumber?: string,
    email?: string,
    alias: string,
}

export type ContractRequestResponse = {
    contractRequestId: number,
    alias: string,  
    contractStatus: ContractStatus,
    reason: string,
    sendType: SendType,
    phoneNumber?: string,
    email?: string,
    createdAt: string,
    updatedAt: string
}

export type GetContractRequestParams = {
    contractStatus?: ContractStatus,
    sendType?: SendType,
}

export type GetContractRequestResponse = {
    list: ContractRequestResponse[],
}

export type GetContractRequestDetailResponse = Omit<ContractRequestResponse, 'alias'> & {
    corporation: {
        id?: number,
        businessName?: string,
        businessNumber?: string,
    },
    contract: {
        id: number,
        contractFileName: string,
        startDate: string,
        endDate: string,
        createdAt: string,
        updatedAt: string,
    },
    documents: {
        salesDeclarationCertificateFileName: string,
        csoTraningCompletionCertificateFileName: string,
        businessRegistrationFileName: string,
    },
}

type ReEntrusContractGraphItem = {
    corporationId: number,
    corporationName: string,
    contractStatus: ContractStatus, 
    child:{
        depth: number,
        corporationId: number,
        corporationName: string,
        contractStatus: ContractStatus
    }[]
}

export type GetReEntrusContractGraphResponse = {
    list: ReEntrusContractGraphItem[]
}

export type GetReEntrusContractDetailResponse = {
    depth: number,
    reEntrustContractId: number,
    reEntrustContractFileName: string,
    corporationName: string,
    contractStatus: ContractStatus,
    startDate: string,
    expireDate: string,
    documents: {
        salesDeclarationCertificateFileName: string,
        csoTraningCompletionCertificateFileName: string,
        businessRegistrationFileName: string,
    },
}


export type GetReEntrusContractListResponse = {
    list: {
        reEntrustContractId: number,
        reEntrustContractFileName: string,
        pharmaceuticalName: string,
        contracteeName: string,
        contractorName: string,
        startDate: string,
        expireDate: string,
        contractStatus: ContractStatus,
        reason: string,
        createdAt: string,
        updatedAt: string
    }[]
}

type contractItem = {
    id: number,
    contractorId: number,
    contractorName: string,
    contracteeId: number,
    contracteeName: string,
    contractFileName: string,
    startDate: string,
    endDate: string,
    createdAt: string,
    updatedAt: string,
    contractStatus: ContractStatus,
    reason: string
}

export type GetUploadedContractListResponse = {
    list: contractItem[]
}