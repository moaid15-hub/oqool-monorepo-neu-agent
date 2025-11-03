import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from './AuthService';
import { userDatabase } from './database/UserDatabase';
import logger from './utils/logger'; // Assuming a more robust logging utility is implemented

// Context for user state management
const UserContext = createContext();

// Action types
const USER_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  CLEAR_USER: 'CLEAR_USER',
  UPDATE_USER: 'UPDATE_USER'
};

// Initial state
const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

// Reducer function
const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };
    
    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        loading: false,
        error: null
      };
    
    case USER_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
        user: null,
        isAuthenticated: false
      };
    
    case USER_ACTIONS.CLEAR_USER:
      return {
        ...{ ...initialState }
      };
    
    case USER_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    default:
      return state;
  }
};

// Custom hook for using user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// User Service Component
export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Check for existing session on mount
  useEffect(() => {
    const checkExistingSession = async () => {
      try {
        dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
        
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          const userData = await userDatabase.getUserById(currentUser.id);
          dispatch({ type: USER_ACTIONS.SET_USER, payload: userData });
        }
      } catch (error) {
        logger.error('Session check failed:', error); // Using logger instead of console.error
        dispatch({ type: USER_ACTIONS.SET_ERROR, payload: 'Failed to check user session' });
      }
    };

    checkExistingSession();

    // Cleanup function could be added here if necessary
  }, []);

  const handleErrors = (error, defaultMessage) => {
    logger.error(error); // Logging error for internal tracking
    const errorMessage = error.message || defaultMessage;
    dispatch({ type: USER_ACTIONS.SET_ERROR, payload: errorMessage });
    throw new Error(errorMessage); // Sanitize error before throwing
  };

  const register = async (userData) => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

      if (!userData.email || !userData.password) {
        throw new Error('Email and password are required');
      }

      const existingUser = await userDatabase.getUserByEmail(userData.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const newUser = await userDatabase.createUser(userData);
      await authService.login(userData.email, userData.password);
      dispatch({ type: USER_ACTIONS.SET_USER, payload: newUser });
      return newUser;
    } catch (error) {
      handleErrors(error, 'Registration failed');
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

      const authResult = await authService.login(email, password);
      if (!authResult.success) {
        throw new Error(authResult.message || 'Authentication failed');
      }

      const userData = await userDatabase.getUserByEmail(email);
      if (!userData) {
        throw new Error('User not found');
      }

      dispatch({ type: USER_ACTIONS.SET_USER, payload: userData });
      return userData;
    } catch (error) {
      handleErrors(error, 'Login failed');
    }
  };

  const logout = async () => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });
      
      await authService.logout();
      dispatch({ type: USER_ACTIONS.CLEAR_USER });
    } catch (error) {
      handleErrors(error, 'Logout failed');
    }
  };

  const updateProfile = async (updates) => {
    try {
      if (!state.user) {
        throw new Error('No user logged in');
      }

      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

      if (updates.email) {
        const existingUser = await userDatabase.getUserByEmail(updates.email);
        if (existingUser && existingUser.id !== state.user.id) {
          throw new Error('Email already in use');
        }
      }

      const updatedUser = await userDatabase.updateUser(state.user.id, updates);
      dispatch({ type: USER_ACTIONS.UPDATE_USER, payload: updatedUser });
      return updatedUser;
    } catch (error) {
      handleErrors(error, 'Profile update failed');
    }
  };

  const deleteAccount = async () => {
    try {
      if (!state.user) {
        throw new Error('No user logged in');
      }

      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

      await userDatabase.deleteUser(state.user.id);
      await authService.logout();
      
      dispatch({ type: USER_ACTIONS.CLEAR_USER });
    } catch (error) {
      handleErrors(error, 'Account deletion failed');
    }
  };

  const getUserById = async (userId) => {
    try {
      return await userDatabase.getUserById(userId);
    } catch (error) {
      handleErrors(error, 'Failed to get user by ID');
    }
  };

  const value = {
    user: state.user,
    loading: state.loading,
    error: state.error,
    isAuthenticated: state.isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    deleteAccount,
    getUserById,
    checkExistingSession: () => {} // Placeholder for direct calls if necessary
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext };