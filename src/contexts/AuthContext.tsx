import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthResponse } from '../services/auth';
import { storage } from '../services/storage';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: AuthResponse['user'] | null;
  token: string | null;
}

interface AuthContextType extends AuthState {
  setAuth: (auth: AuthResponse | null) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    token: null,
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const [token, user] = await Promise.all([
        storage.getAuthToken(),
        storage.getUserData<AuthResponse['user']>(),
      ]);

      setState({
        isLoading: false,
        isAuthenticated: Boolean(token && user),
        user,
        token,
      });
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const setAuth = async (auth: AuthResponse | null) => {
    if (auth) {
      await Promise.all([
        storage.setAuthToken(auth.token),
        storage.setUserData(auth.user),
      ]);

      setState({
        isLoading: false,
        isAuthenticated: true,
        user: auth.user,
        token: auth.token,
      });
    } else {
      await storage.clearAuth();
      setState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      });
    }
  };

  const logout = async () => {
    await setAuth(null);
  };

  return (
    <AuthContext.Provider value={{ ...state, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 