import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

// API Configuration
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// Service endpoints
const SERVICE_ENDPOINTS = {
  USER_SERVICE: '/api/users',
  TODO_SERVICE: '/api/todos'
};

// Custom hook for API calls with retry logic
const useApiService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    withCredentials: true, // Enable sending cookies over cross-domain requests
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Request interceptor for logging (conditional based on the environment)
  apiClient.interceptors.request.use(
    (config) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for error handling
  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', error.response?.data || error.message);
      }
      return Promise.reject(error);
    }
  );

  const makeRequest = useCallback(async (method, endpoint, data = null, options = {}) => {
    let lastError;
    let timeoutId;

    const abortController = new AbortController(); // For aborting fetch requests
    options.signal = abortController.signal;

    for (let attempt = 0; attempt < API_CONFIG.RETRY_ATTEMPTS; attempt++) {
      try {
        setLoading(true);
        setError(null);

        const sanitizedEndpoint = encodeURI(endpoint); // Basic sanitation
        
        const config = {
          method,
          url: sanitizedEndpoint,
          ...options
        };

        if (data && (method === 'post' || method === 'put' || method === 'patch')) {
          config.data = JSON.stringify(data); // Ensure data is properly encoded
        }

        const response = await apiClient(config);
        setLoading(false);
        return response.data;
      } catch (err) {
        lastError = err;
        
        // Don't retry on 4xx errors (client errors)
        if (err.response?.status >= 400 && err.response?.status < 500) {
          break;
        }
        
        if (attempt < API_CONFIG.RETRY_ATTEMPTS - 1) {
          await new Promise(resolve => {
            timeoutId = setTimeout(resolve, API_CONFIG.RETRY_DELAY);
          });
        }
      } finally {
        if (attempt === API_CONFIG.RETRY_ATTEMPTS - 1) {
          setLoading(false);
          clearTimeout(timeoutId); // Clear the timeout to prevent memory leaks
          abortController.abort(); // Abort any pending requests on final attempt
        }
      }
    }
    
    setError(lastError);
    throw lastError;
  }, [apiClient]);

  return { loading, error, makeRequest };
};

// Service-specific hooks
const useUserService = () => {
  const { loading, error, makeRequest } = useApiService();

  const getUsers = useCallback(() => 
    makeRequest('get', SERVICE_ENDPOINTS.USER_SERVICE), [makeRequest]);

  const getUserById = useCallback((id) => 
    makeRequest('get', `${SERVICE_ENDPOINTS.USER_SERVICE}/${id}`), [makeRequest]);

  const createUser = useCallback((userData) => 
    makeRequest('post', SERVICE_ENDPOINTS.USER_SERVICE, userData), [makeRequest]);

  const updateUser = useCallback((id, userData) => 
    makeRequest('put', `${SERVICE_ENDPOINTS.USER_SERVICE}/${id}`, userData), [makeRequest]);

  const deleteUser = useCallback((id) => 
    makeRequest('delete', `${SERVICE_ENDPOINTS.USER_SERVICE}/${id}`), [makeRequest]);

  return {
    loading,
    error,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  };
};

const useTodoService = () => {
  const { loading, error, makeRequest } = useApiService();

  const getTodos = useCallback(() => 
    makeRequest('get', SERVICE_ENDPOINTS.TODO_SERVICE), [makeRequest]);

  const getTodoById = useCallback((id) => 
    makeRequest('get', `${SERVICE_ENDPOINTS.TODO_SERVICE}/${id}`), [makeRequest]);

  const createTodo = useCallback((todoData) => 
    makeRequest('post', SERVICE_ENDPOINTS.TODO_SERVICE, todoData), [makeRequest]);

  const updateTodo = useCallback((id, todoData) => 
    makeRequest('put', `${SERVICE_ENDPOINTS.TODO_SERVICE}/${id}`, todoData), [makeRequest]);

  const deleteTodo = useCallback((id) => 
    makeRequest('delete', `${SERVICE_ENDPOINTS.TODO_SERVICE}/${id}`), [makeRequest]);

  const getTodosByUserId = useCallback((userId) => 
    makeRequest('get', `${SERVICE_ENDPOINTS.TODO_SERVICE}?userId=${encodeURIComponent(userId)}`), [makeRequest]);

  return {
    loading,
    error,
    getTodos,
    getTodoById,
    createTodo,
    updateTodo,
    deleteTodo,
    getTodosByUserId
  };
};

// Main WebServer Component
const WebServer = ({ children, onServiceError }) => {
  const [services, setServices] = useState({
    userService: null,
    todoService: null
  });

  const userService = useUserService();
  const todoService = useTodoService();

  // Initialize services and handle errors
  useEffect(() => {
    const initializeServices = () => {
      setServices({
        userService,
        todoService
      });
    };

    initializeServices();
  }, [userService, todoService]);

  // Global error handler
  useEffect(() => {
    const handleServiceError = (error) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Service Error:', error);
      }
      if (onServiceError) {
        onServiceError(error);
      }
    };

    if (userService.error) {
      handleServiceError(userService.error);
    }
    
    if (todoService.error) {
      handleServiceError(todoService.error);
    }
  }, [userService.error, todoService.error, onServiceError]);

  // Provide services to children via context or props
  const contextValue = {
    services,
    isLoading: userService.loading || todoService.loading
  };

  return (
    <div className="web-server" data-testid="web-server">
      {services.userService && services.todoService ? (
        React.Children.map(children, child =>
          React.cloneElement(child, { webServerContext: contextValue })
        )
      ) : (
        <div className="loading-state">
          <p>Initializing services...</p>
        </div>
      )}
      
      {(userService.loading || todoService.loading) && (
        <div className="global-loading" data-testid="global-loading">
          <div className="loading-spinner"></div>
          <span>Processing request...</span>
        </div>
      )}
    </div>
  );
};

// PropTypes
WebServer.propTypes = {
  children: PropTypes.node,
  onServiceError: PropTypes.func
};

// Default props
WebServer.defaultProps = {
  onServiceError: () => {}
};

export default WebServer;
export { useUserService, useTodoService, useApiService };