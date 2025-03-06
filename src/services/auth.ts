import { api } from './api';
import { storage } from './storage';
import { localUserStore } from './localUserStore';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const user = await localUserStore.validateUser(credentials.email, credentials.password);
      
      const response: AuthResponse = {
        token: `local_token_${user.id}`,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      };

      await storage.setAuthToken(response.token);
      await storage.setUserData(response.user);

      return response;
    } catch (error) {
      // Fallback to test account if it matches
      if (credentials.email === 'test@example.com' && credentials.password === 'password') {
        const response: AuthResponse = {
          token: 'dummy_token',
          user: {
            id: 'test',
            name: 'Test User',
            email: credentials.email,
          },
        };

        await storage.setAuthToken(response.token);
        await storage.setUserData(response.user);

        return response;
      }
      throw error;
    }
  },

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const user = await localUserStore.createUser(
      credentials.name,
      credentials.email,
      credentials.password
    );
    
    const response: AuthResponse = {
      token: `local_token_${user.id}`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };

    await storage.setAuthToken(response.token);
    await storage.setUserData(response.user);

    return response;
  },

  async logout(): Promise<void> {
    await storage.clearAuth();
  },
}; 