import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

// Type definitions
interface User {
  id: string;
  username: string;
  email: string;
  role: 'Admin' | 'Manager';
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<LoginResult>;
  register: (userData: RegisterCredentials) => Promise<LoginResult>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<LoginResult>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));

  useEffect(() => {
    const initializeAuth = async () => {
      // Only try to get profile if we have a valid, non-empty token
      if (token && typeof token === 'string' && token.trim().length > 10) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to get user profile:', error);
          // Clear invalid token
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      } else {
        // Clear any invalid tokens
        if (token && (typeof token !== 'string' || token.trim().length <= 10)) {
          localStorage.removeItem('authToken');
          setToken(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]); // Include token in dependencies

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    try {
      const response = await authAPI.login(credentials);
      
      const { token: authToken, user: userData } = response.data;
      
      localStorage.setItem('authToken', authToken);
      setToken(authToken);
      setUser(userData);
      
      return { success: true };
    } catch (error: any) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (userData: RegisterCredentials): Promise<LoginResult> => {
    try {
      const response = await authAPI.register(userData);
      const { token: authToken, user: newUser } = response.data;
      
      localStorage.setItem('authToken', authToken);
      setToken(authToken);
      setUser(newUser);
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (token) {
        await authAPI.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
    }
  };

  const updateProfile = async (profileData: Partial<User>): Promise<LoginResult> => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.data);
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'Admin';

  const value: AuthContextType = {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 