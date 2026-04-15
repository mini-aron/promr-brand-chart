import axios from '@/api/axios';
import { formDataConfig } from '@/api/axios';
import {
  LoginRequest,
  TokenPair,
  RegisterCorpRequest,
  RegisterDealerRequest,
  RegisterPharmaRequest,
  BusinessFileOcrResponse,
  PatchRepresentativeLogoResponse,
} from '@/types/services/authService';

export async function login(params: LoginRequest): Promise<TokenPair> {
  const { data } = await axios.post<TokenPair>('/auth/login', params);
  return data;
}

export async function refresh(): Promise<TokenPair> {
  const { data } = await axios.post<TokenPair>('/refresh');
  return data;
}

export async function logout(): Promise<void> {
  await axios.post('/auth/logout');
}

export async function registerCorp(
  params: RegisterCorpRequest,
  options?: { uuid?: string },
): Promise<unknown> {
  const { data } = await axios.post(
    '/register/corporation',
    params,
    options?.uuid ? { params: { uuid: options.uuid } } : undefined,
  );
  return data;
}

export async function registerDealer(params: RegisterDealerRequest): Promise<unknown> {
  const { data } = await axios.post('/register/dealer', params);
  return data;
}

export async function registerPharma(params: RegisterPharmaRequest): Promise<unknown> {
  const { data } = await axios.post('/register/pharmaceutical', params);
  return data;
}

export async function recognizeBusinessRegistration(file: File): Promise<BusinessFileOcrResponse> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axios.post<BusinessFileOcrResponse>(
    '/business-file',
    formData,
    formDataConfig(),
  );
  return data;
}

export async function patchRepresentativeLogo(
  image: File,
): Promise<PatchRepresentativeLogoResponse> {
  const formData = new FormData();
  formData.append('image', image);
  const { data } = await axios.patch<PatchRepresentativeLogoResponse>(
    '/profile/representative',
    formData,
    formDataConfig(),
  );
  return data;
}
