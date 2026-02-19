export type UserRole = 'client' | 'barber' | 'owner';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  barbershop?: {
    id: number;
    name: string;
  };
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}
