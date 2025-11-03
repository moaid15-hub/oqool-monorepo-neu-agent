import React, { createContext, useContext, useCallback, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { LoggingService } from '../services/LoggingService';
import { ResponseFormatter } from '../services/ResponseFormatter';

// Error types
export const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

// Error context
const ErrorContext = createContext();

// Custom hook for using error handler
export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorProvider');
  }
  return context;
};

// Error Handler Component
export const ErrorHandler = ({ children, loggingService = LoggingService, responseFormatter = ResponseFormatter }) => {
  const formatErrorResponse = useCallback((error, errorType = ErrorTypes.UNKNOWN_ERROR) => {
    const errorResponse = {
      type: errorType,
      message: error.message || 'An unexpected error occurred',
      timestamp: new Date().toISOString()
    };

    // Only include stack trace in development mode with additional safety check
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment && error.stack) {
      errorResponse.stack = error.stack;
    }

    return responseFormatter.formatError(errorResponse);
  }, [responseFormatter]);

  const logError = useCallback((error, errorType, context = {}) => {
    const logData = {
      errorType,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    };

    if (errorType === ErrorTypes.DATABASE_ERROR || errorType === ErrorTypes.EXTERNAL_SERVICE_ERROR) {
      loggingService.error('System error occurred', logData);
    } else if (errorType === ErrorTypes.AUTHENTICATION_ERROR || errorType === ErrorTypes.AUTHORIZATION_ERROR) {
      loggingService.warn('Security-related error', logData);
    } else {
      loggingService.info('Application error', logData);
    }
  }, [loggingService]);

  const handleError = useCallback((error, errorType = ErrorTypes.UNKNOWN_ERROR, context = {}) => {
    // Log the error
    logError(error, errorType, context);

    // Format the error response
    return formatErrorResponse(error, errorType);
  }, [logError, formatErrorResponse]);

  const handleAsyncError = useCallback(async (asyncFunction, errorType = ErrorTypes.UNKNOWN_ERROR, context = {}) => {
    try {
      return await asyncFunction();
    } catch (error) {
      // Throw the formatted error instead of returning it
      const formattedError = handleError(error, errorType, context);
      throw formattedError;
    }
  }, [handleError]);

  const wrapWithErrorHandler = useCallback((fn, errorType = ErrorTypes.UNKNOWN_ERROR, context = {}) => {
    return function(...args) {
      try {
        const result = fn.apply(this, args);
        
        // Handle both Promise and thenable objects
        if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
          return result.catch(error => {
            const formattedError = handleError(error, errorType, context);
            throw formattedError;
          });
        }
        
        return result;
      } catch (error) {
        const formattedError = handleError(error, errorType, context);
        throw formattedError;
      }
    };
  }, [handleError]);

  // Map common error patterns to error types
  const classifyError = useCallback((error) => {
    if (error.name === 'ValidationError' || error.status === 400 || error.statusCode === 400) {
      return ErrorTypes.VALIDATION_ERROR;
    }
    if (error.name === 'UnauthorizedError' || error.status === 401 || error.statusCode === 401) {
      return ErrorTypes.AUTHENTICATION_ERROR;
    }
    if (error.name === 'ForbiddenError' || error.status === 403 || error.statusCode === 403) {
      return ErrorTypes.AUTHORIZATION_ERROR;
    }
    if (error.status === 404 || error.statusCode === 404) {
      return ErrorTypes.NOT_FOUND_ERROR;
    }
    if (error.name === 'DatabaseError' || error.code?.startsWith('23') || 
        error.name?.includes('Database') || error.name?.includes('SQL')) {
      return ErrorTypes.DATABASE_ERROR;
    }
    if (error.status === 429 || error.statusCode === 429) {
      return ErrorTypes.RATE_LIMIT_ERROR;
    }
    if (error.name === 'ExternalServiceError' || error.externalService) {
      return ErrorTypes.EXTERNAL_SERVICE_ERROR;
    }
    return ErrorTypes.UNKNOWN_ERROR;
  }, []);

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    handleError,
    handleAsyncError,
    wrapWithErrorHandler,
    classifyError,
    ErrorTypes
  }), [handleError, handleAsyncError, wrapWithErrorHandler, classifyError]);

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

ErrorHandler.propTypes = {
  children: PropTypes.node.isRequired,
  loggingService: PropTypes.shape({
    error: PropTypes.func.isRequired,
    warn: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired
  }),
  responseFormatter: PropTypes.shape({
    formatError: PropTypes.func.isRequired
  })
};

// Higher Order Component for error handling with ref forwarding
export const withErrorHandler = (Component, errorType = ErrorTypes.UNKNOWN_ERROR) => {
  const WithErrorHandler = forwardRef((props, ref) => {
    const errorHandler = useErrorHandler();
    
    const handleComponentError = (error, context = {}) => {
      return errorHandler.handleError(error, errorType, {
        component: Component.displayName || Component.name,
        ...context
      });
    };

    return (
      <Component
        {...props}
        ref={ref}
        handleError={handleComponentError}
        handleAsyncError={errorHandler.handleAsyncError}
      />
    );
  });

  WithErrorHandler.displayName = `WithErrorHandler(${Component.displayName || Component.name})`;
  
  return WithErrorHandler;
};

// Error boundary for React components
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const { loggingService = LoggingService } = this.props;
    
    // Sanitize error information for logging
    const sanitizedErrorInfo = {
      error: error.message,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    };

    // Only include full stack in development
    if (process.env.NODE_ENV === 'development') {
      sanitizedErrorInfo.stack = error.stack;
    }

    loggingService.error('React component error', sanitizedErrorInfo);
  }

  render() {
    if (this.state.hasError) {
      const { fallback: FallbackComponent, children } = this.props;
      
      if (FallbackComponent) {
        return <FallbackComponent error={this.state.error} />;
      }
      
      // Default fallback UI
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>We're sorry for the inconvenience. Please try refreshing the page.</p>
          {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
            <details style={{ textAlign: 'left', marginTop: '10px' }}>
              <summary>Error Details (Development)</summary>
              <pre>{this.state.error.stack}</pre>
            </details>
          )}
        </div>
      );
    }

    return children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.elementType,
  loggingService: PropTypes.shape({
    error: PropTypes.func.isRequired
  })
};

export default ErrorHandler;