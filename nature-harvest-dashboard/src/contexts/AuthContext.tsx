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
  validateToken: () => Promise<boolean>;
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
  const [token, setToken] = useState<string | null>(sessionStorage.getItem('authToken'));

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      // Only try to get profile if we have a valid, non-empty token
      if (token && typeof token === 'string' && token.trim().length > 10) {
        try {
          const response = await authAPI.getProfile();
          setUser(response.data);
        } catch (error) {
          console.error('Failed to get user profile:', error);
          // Clear invalid token
          sessionStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
        }
      } else {
        // Clear any invalid tokens
        if (token && (typeof token !== 'string' || token.trim().length <= 10)) {
          sessionStorage.removeItem('authToken');
          setToken(null);
        }
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, []); // Remove token from dependencies to prevent infinite loops

  const login = async (credentials: LoginCredentials): Promise<LoginResult> => {
    try {
      const response = await authAPI.login(credentials);
      
      const { token: authToken, user: userData } = response.data;
      
      sessionStorage.setItem('authToken', authToken);
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
      
      sessionStorage.setItem('authToken', authToken);
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
      // Clear all authentication data
      sessionStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setLoading(false);
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

  // Function to validate token and refresh user data if needed
  const validateToken = async (): Promise<boolean> => {
    if (!token || typeof token !== 'string' || token.trim().length <= 10) {
      return false;
    }

    try {
      const response = await authAPI.getProfile();
      setUser(response.data);
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      // Clear invalid token
      sessionStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      return false;
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
    validateToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 