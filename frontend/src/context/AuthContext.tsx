import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType, LoginPayload, RegisterPayload } from '../types/auth.types';
import { authService } from '../services/authService';
import { setAccessToken, getAccessToken } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state on mount by attempting refresh token flow
  useEffect(() => {
    const initAuth = async () => {
      try {
        const newAccessToken = await authService.refreshToken();
        if (newAccessToken) {
          setToken(newAccessToken);
          const response = await authService.getCurrentUser();
          if (response.data?.user) {
            setUser(response.data.user);
          }
        }
      } catch (error) {
        // Refresh failed (user not logged in or cookie expired)
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for unauthorized events emitted by Axios interceptors
    const handleUnauthorized = () => {
      setUser(null);
      setToken(null);
      setAccessToken(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await authService.login(payload);
      if (res.data) {
        setUser(res.data.user);
        setToken(res.data.accessToken);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await authService.register(payload);
      if (res.data) {
        setUser(res.data.user);
        setToken(res.data.accessToken);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      setUser(null);
      setToken(null);
      setAccessToken(null);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token: getAccessToken(),
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
