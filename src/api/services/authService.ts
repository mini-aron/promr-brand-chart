import axios from '@/api/axios';

export async function login(params: { email: string; password: string }) {
  const { data } = await axios.post<{ token: string }>('/auth/login', params);
  return data;
}

export async function logout() {
  await axios.post('/auth/logout');
}
