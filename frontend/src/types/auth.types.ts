export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    accessToken: string;
  };
  error?: any;
}

export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}
