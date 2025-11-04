import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (userData: RegisterData) => Promise<AuthResult>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
}

interface AuthResult {
  success: boolean;
  message: string;
  user?: User;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// API Service - Replace with actual backend API calls
class ApiService {
  private static baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

  static async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Include cookies for httpOnly tokens
        ...options,
      });

      const data = await response.json();
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Request failed'
        };
      }

      return {
        success: true,
        data: data.data || data
      };
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        message: 'Network error occurred'
      };
    }
  }

  static async login(email: string, password: string): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  static async register(userData: RegisterData): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  static async refreshToken(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/refresh', {
      method: 'POST',
    });
  }

  static async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/auth/logout', {
      method: 'POST',
    });
  }

  static async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request<{ user: User }>('/auth/me');
  }
}

// Validation helpers - Client-side validation for UX only, server does actual validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, message: 'Password is valid' };
};

const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 20;
};

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider Component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize auth state from backend
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async (): Promise<void> => {
    try {
      const result = await ApiService.getCurrentUser();
      
      if (result.success && result.data) {
        setUser(result.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setIsLoading(true);

      // Client-side validation for UX
      if (!email || !password) {
        return { success: false, message: 'Email and password are required' };
      }

      if (!validateEmail(email)) {
        return { success: false, message: 'Invalid email format' };
      }

      // Server handles actual authentication, password hashing, rate limiting, etc.
      const result = await ApiService.login(email, password);
      
      if (result.success && result.data) {
        setUser(result.data.user);
        return { success: true, message: 'Login successful', user: result.data.user };
      } else {
        return { success: false, message: result.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<AuthResult> => {
    try {
      setIsLoading(true);

      // Client-side validation for UX
      if (!userData.email || !userData.username || !userData.password) {
        return { success: false, message: 'All fields are required' };
      }

      if (!validateEmail(userData.email)) {
        return { success: false, message: 'Invalid email format' };
      }

      if (!validateUsername(userData.username)) {
        return { success: false, message: 'Username must be between 3 and 20 characters' };
      }

      const passwordValidation = validatePassword(userData.password);
      if (!passwordValidation.isValid) {
        return { success: false, message: passwordValidation.message };
      }

      // Server handles actual user creation, password hashing, duplicate checks, etc.
      const result = await ApiService.register(userData);
      
      if (result.success && result.data) {
        setUser(result.data.user);
        return { success: true, message: 'Registration successful', user: result.data.user };
      } else {
        return { success: false, message: result.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'An error occurred during registration' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  const refreshToken = async (): Promise<boolean> => {
    try {
      const result = await ApiService.refreshToken();
      
      if (result.success && result.data) {
        setUser(result.data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      setUser(null);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;