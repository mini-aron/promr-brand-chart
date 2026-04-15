import axios, { formDataConfig } from '@/api/axios';
import { OrganizationInfoResponse } from '@/types/services/organizationService';


export function updateRepresentativeLogo (file: File){
    const formData = new FormData();
    formData.append('representativeLogo', file);
    return axios.post<void>('/organization/representative', formData, formDataConfig());
}

export function updateSalesDeclaration (file: File){
    const formData = new FormData();
    formData.append('file', file);
    return axios.post<void>('/organization/salesDeclaration', formData, formDataConfig());
}

export function updateCsoTrainingCompletion (file: File){
    const formData = new FormData();
    formData.append('file', file);
    return axios.post<void>('/organization/csoTrainingCompletion', formData, formDataConfig());
}

export function updatePhoneNumber (phoneNumber: string){
    return axios.post<{ phoneNumber: string }>('/organization/phoneNumber', { phoneNumber });
}

export function updateDeadlineDate (deadlineDate: string){
    return axios.post<{ deadlineDate: string }>('/organization/deadlineDate', { deadlineDate });
}

export function getOrganizationInfo (){
    return axios.get<OrganizationInfoResponse>('/organization/profile');
}

