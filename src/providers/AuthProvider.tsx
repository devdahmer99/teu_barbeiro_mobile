import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react';

import {setAuthToken} from '@/api/client';
import {login as loginRequest, logout as logoutRequest, me} from '@/api/modules/auth';
import {User} from '@/types/auth';

const TOKEN_STORAGE_KEY = '@teu-barbeiro:token';

interface SignInPayload {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  signIn: (payload: SignInPayload) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const hydrate = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
      if (!storedToken) {
        return;
      }

      setAuthToken(storedToken);
      const profile = await me();
      setUser(profile);
    } catch {
      setAuthToken(null);
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const signIn = useCallback(async (payload: SignInPayload) => {
    const response = await loginRequest(payload);
    if (!response?.access_token) {
      throw new Error('Resposta de autenticação inválida. Verifique se o backend mobile está ativo.');
    }

    setAuthToken(response.access_token);
    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, response.access_token);

    const profile = response.user ?? (await me());
    setUser(profile);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await logoutRequest();
    } finally {
      setAuthToken(null);
      setUser(null);
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await me();
      setUser(profile);
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      signIn,
      signOut,
      refreshUser,
    }),
    [isLoading, signIn, signOut, user, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
