import React, { createContext, useContext, useReducer, useEffect } from 'react';
import Cookies from 'js-cookie';

// Authentication Context
const AuthContext = createContext();

// Action Types
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Initial State
const initialState = {
  user: null,
  token: Cookies.get('authToken'), // Changed from localStorage to httpOnly Cookie
  isLoading: false,
  error: null,
  isAuthenticated: false
};

// Auth Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        error: null,
        isAuthenticated: true
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        error: action.payload,
        isAuthenticated: false
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        token: null
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    default:
      return state;
  }
};

// API Service
class AuthService {
  static async login(email, password) {
    try {
      // Add basic input validation
      if (typeof email !== 'string' || typeof password !== 'string' || email.length === 0 || password.length === 0) {
        throw new Error('Invalid input');
      }

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error('Login failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error('An error occurred during login');
    }
  }

  static async register(userData) {
    try {
      // Add basic input validation
      if (typeof userData !== 'object' || !userData.email || !userData.password) {
        throw new Error('Invalid input');
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error('Registration failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error('An error occurred during registration');
    }
  }

  static async verifyToken(token) {
    try {
      if (typeof token !== 'string' || token.length === 0) {
        throw new Error('Invalid token');
      }

      const response = await fetch('/api/auth/verify', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Token verification failed');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Token verification failed');
    }
  }
}

// Custom Hook for Authentication
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Authentication Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for existing valid token on mount
  useEffect(() => {
    const controller = new AbortController();
    const checkExistingAuth = async () => {
      if (state.token) {
        try {
          const userData = await AuthService.verifyToken(state.token);
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: userData.user,
              token: state.token
            }
          });
        } catch (error) {
          // Token is invalid, clear it
          Cookies.remove('authToken');
          dispatch({ type: AUTH_ACTIONS.LOGOUT });
        }
      }
    };

    checkExistingAuth();

    return () => controller.abort(); // Cleanup function to cancel the fetch request
  }, []);

  // Login function
  const login = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    
    try {
      const data = await AuthService.login(email, password);
      Cookies.set('authToken', data.token, { secure: true, httpOnly: true }); // Securely store token
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: data
      });
      
      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: 'Failed to login' // Generic error message
      });
      
      return { success: false, error: 'Failed to login' };
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });
    
    try {
      const data = await AuthService.register(userData);
      Cookies.set('authToken', data.token, { secure: true, httpOnly: true }); // Securely store token
      
      dispatch({
        type: AUTH_ACTIONS.REGISTER_SUCCESS,
        payload: data
      });
      
      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: 'Failed to register' // Generic error message
      });
      
      return { success: false, error: 'Failed to register' };
    }
  };

  // Logout function
  const logout = () => {
    Cookies.remove('authToken');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Higher Order Component for protecting routes
export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }

    return <Component {...props} />;
  };
};

// Protected Route Component
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;