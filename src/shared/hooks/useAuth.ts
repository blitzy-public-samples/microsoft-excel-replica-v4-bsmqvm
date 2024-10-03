import { useState, useEffect, useCallback } from 'react';
import { AuthenticationService } from '../services/AuthenticationService';
import { IUser } from '../interfaces/IUser';
import { UserRoleEnum } from '../enums/UserRoleEnum';
import { SecurityConfig } from '../config/SecurityConfig';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string, email: string) => Promise<void>;
}

const useAuth = (): AuthState & AuthActions => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const checkExistingAuth = async () => {
      const token = localStorage.getItem(SecurityConfig.TOKEN_KEY);
      if (token) {
        try {
          const validatedUser = await AuthenticationService.validateToken(token);
          setUser(validatedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem(SecurityConfig.TOKEN_KEY);
        }
      }
    };

    checkExistingAuth();
  }, []);

  const login = useCallback(async (username: string, password: string): Promise<void> => {
    try {
      const { user, token } = await AuthenticationService.login(username, password);
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem(SecurityConfig.TOKEN_KEY, token);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await AuthenticationService.logout();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(SecurityConfig.TOKEN_KEY);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }, []);

  const register = useCallback(async (username: string, password: string, email: string): Promise<void> => {
    try {
      const { user, token } = await AuthenticationService.register(username, password, email);
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem(SecurityConfig.TOKEN_KEY, token);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }, []);

  return {
    user,
    isAuthenticated,
    login,
    logout,
    register,
  };
};

export default useAuth;