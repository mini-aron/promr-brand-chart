import axios from '@/api/axios';
import { GetAgreementListResponse, UpdateAgreementParams } from '@/types/services/agreementService';

export async function getAgreementList() {
  return axios.get<GetAgreementListResponse>(`/agreement/list`);
}

export async function getAgreementDetail(agreementId: number) {
  return axios.get(`/agreement/${agreementId}`);
}

export async function agreeToAgreement(agreementId: number) {
  return axios.post(`/agreement/${agreementId}/agree`);
}

export async function updateAgreement(params: UpdateAgreementParams) {
  return axios.patch(`/agreement`, params);
}
