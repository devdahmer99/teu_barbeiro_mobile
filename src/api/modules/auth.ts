import {api} from '@/api/client';
import {LoginResponse, User} from '@/types/auth';

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginData {
  access_token: string;
  token_type: string;
  user: User;
  barbershop?: {
    id: number;
    name: string;
  };
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const {data} = await api.post<LoginData>('/auth/login', payload);

  return {
    access_token: data.access_token,
    token_type: data.token_type,
    user: data.barbershop
      ? {
          ...data.user,
          barbershop: data.barbershop,
        }
      : data.user,
  };
}

export async function me(): Promise<User> {
  const {data} = await api.get<User | {user: User}>('/auth/me');

  return 'user' in data ? data.user : data;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}
