import { api, setAccessToken } from './api';
import { LoginPayload, RegisterPayload, AuthResponse } from '../types/auth.types';

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', payload);
    if (response.data.data?.accessToken) {
      setAccessToken(response.data.data.accessToken);
    }
    return response.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', payload);
    if (response.data.data?.accessToken) {
      setAccessToken(response.data.data.accessToken);
    }
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      setAccessToken(null);
    }
  },

  async getCurrentUser(): Promise<AuthResponse> {
    const response = await api.get<AuthResponse>('/auth/me');
    return response.data;
  },

  async refreshToken(): Promise<string> {
    const response = await api.post<AuthResponse>('/auth/refresh');
    const token = response.data.data?.accessToken || '';
    setAccessToken(token);
    return token;
  },
};
