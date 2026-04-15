import axios from '@/api/axios';
import {
  ContractRequestParams,
  ContractRequestResponse,
  GetContractRequestParams,
  GetContractRequestResponse,
  GetContractRequestDetailResponse,
  GetReEntrusContractGraphResponse,
  GetReEntrusContractListResponse,
  GetReEntrusContractDetailResponse,
  GetUploadedContractListResponse,
} from '@/types/services/contractService';
import { formDataConfig } from '@/api/axios';

function parseFilenameFromContentDisposition(header?: string): string | undefined {
  if (!header) return undefined;
  const m = /filename\*?=(?:UTF-8''|")?([^";\n]+)/i.exec(header);
  return m?.[1]?.replace(/"/g, '')?.trim();
}

// 계약 요청
export async function requestContract(
  params: ContractRequestParams,
): Promise<ContractRequestResponse> {
  const { data } = await axios.post<ContractRequestResponse>('/contract/request', params);
  return data;
}

/** 엑셀 양식 파일 다운로드 (GET) */
export async function downloadContractRequestExcel(): Promise<void> {
  const { data, headers } = await axios.get<Blob>('/contract/excel', {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(data);
  try {
    const a = document.createElement('a');
    a.href = url;
    const cd =
      headers['content-disposition'] ??
      (headers as Record<string, string | undefined>)['Content-Disposition'];
    a.download = parseFilenameFromContentDisposition(cd) ?? 'contract-request-template.xlsx';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** 엑셀 일괄 업로드 (POST multipart) */
export async function requestContractExcel(file: File): Promise<void> {
  const formData = new FormData();
  formData.append('file', file);
  await axios.post<void>('/contract/excel', formData, formDataConfig());
}

export function getContractRequest(params?: GetContractRequestParams) {
  return axios.get<GetContractRequestResponse>('/contract/request/list', { params });
}

export function getContractRequestDetail(contractRequestId: number) {
  return axios.get<GetContractRequestDetailResponse>(`/contract/request/${contractRequestId}`);
}

export function approveContractRequest(contractRequestId: number) {
  return axios.patch<void>(`/contract/request/${contractRequestId}/approve`);
}

export function rejectContractRequest(contractRequestId: number) {
  return axios.patch<void>(`/contract/request/${contractRequestId}/reject`);
}

export function uploadContractDocument(contractRequestId: number, document: File) {
  return axios.patch<void>(`/contract/request/${contractRequestId}/document`, { document });
}

//재위탁 통보서
export function getReEntrusContractGraph() {
  return axios.get<GetReEntrusContractGraphResponse>(`/contract/re-entrust/graph`);
}

export function getReEntrusContractList() {
  return axios.get<GetReEntrusContractListResponse>(`/contract/re-entrust/list`);
}

export function getReEntrusContractDetail(reEntrustContractId: number) {
  return axios.get<GetReEntrusContractDetailResponse>(
    `/contract/re-entrust/${reEntrustContractId}`,
  );
}

// 업로드한 계약서
export function getUploadedContractList() {
  return axios.get<GetUploadedContractListResponse>(`/contract/list`);
}
