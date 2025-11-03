import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { validateNumberInput } from '../utils/InputValidation';
import { handleError, ErrorTypes } from '../utils/ErrorHandler';

/**
 * Pure arithmetic functions defined outside component to avoid recreation
 */

/**
 * Adds two numbers
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @returns {number} Sum of a and b
 */
const add = (a, b) => a + b;

/**
 * Subtracts second number from first
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @returns {number} Difference of a and b
 */
const subtract = (a, b) => a - b;

/**
 * Multiplies two numbers
 * @param {number} a - First operand
 * @param {number} b - Second operand
 * @returns {number} Product of a and b
 */
const multiply = (a, b) => a * b;

/**
 * Divides first number by second number
 * @param {number} a - First operand (dividend)
 * @param {number} b - Second operand (divisor)
 * @returns {number} Quotient of a divided by b
 * @throws {Error} When divisor is zero
 */
const divide = (a, b) => {
  if (b === 0) {
    throw new Error('Division by zero is not allowed');
  }
  return a / b;
};

/**
 * Operation symbols mapping for display purposes
 */
const OPERATION_SYMBOLS = {
  add: '+',
  subtract: '-',
  multiply: '×',
  divide: '÷'
};

/**
 * Valid operation types
 */
const VALID_OPERATIONS = ['add', 'subtract', 'multiply', 'divide'];

/**
 * Validates operation parameter
 * @param {string} operation - Operation to validate
 * @throws {Error} When operation is invalid
 */
const validateOperation = (operation) => {
  if (!VALID_OPERATIONS.includes(operation)) {
    throw new Error(`Unsupported operation: ${operation}. Valid operations are: ${VALID_OPERATIONS.join(', ')}`);
  }
};

/**
 * Validates number range to prevent floating point precision issues
 * @param {number} num - Number to validate
 * @throws {Error} When number is outside safe range
 */
const validateNumberRange = (num) => {
  const MAX_SAFE_NUMBER = Number.MAX_SAFE_INTEGER;
  const MIN_SAFE_NUMBER = Number.MIN_SAFE_INTEGER;
  
  if (num > MAX_SAFE_NUMBER || num < MIN_SAFE_NUMBER) {
    throw new Error(`Number ${num} is outside safe calculation range`);
  }
};

/**
 * Generates unique ID using crypto.randomUUID() when available, falls back to timestamp with random suffix
 * @returns {string} Unique identifier
 */
const generateUniqueId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Custom hook for calculation engine with arithmetic operations
 * @returns {Object} Hook interface with calculation methods and state
 */
const useCalculationEngine = () => {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Validates and processes arithmetic operation
   * @param {string} operation - Operation type ('add', 'subtract', 'multiply', 'divide')
   * @param {number|string} a - First operand
   * @param {number|string} b - Second operand
   * @returns {Promise<number>} Calculation result
   * @throws {Error} When validation fails or calculation error occurs
   */
  const performCalculation = useCallback(async (operation, a, b) => {
    try {
      setIsLoading(true);
      
      // Input validation
      validateOperation(operation);
      const validatedA = validateNumberInput(a);
      const validatedB = validateNumberInput(b);
      
      if (validatedA === null || validatedB === null) {
        throw new Error('Invalid input: Numbers must be valid numeric values');
      }

      // Number range validation
      validateNumberRange(validatedA);
      validateNumberRange(validatedB);

      let calculationResult;
      
      switch (operation) {
        case 'add':
          calculationResult = add(validatedA, validatedB);
          break;
        case 'subtract':
          calculationResult = subtract(validatedA, validatedB);
          break;
        case 'multiply':
          calculationResult = multiply(validatedA, validatedB);
          break;
        case 'divide':
          calculationResult = divide(validatedA, validatedB);
          break;
        default:
          // This should never happen due to validateOperation, but kept for safety
          throw new Error(`Unsupported operation: ${operation}`);
      }

      // Validate result range
      validateNumberRange(calculationResult);

      // Create calculation record with memoized structure
      const calculationRecord = {
        id: generateUniqueId(),
        operation,
        operands: [validatedA, validatedB],
        result: calculationResult,
        timestamp: new Date().toISOString()
      };

      setResult(calculationResult);
      setHistory(prev => [calculationRecord, ...prev.slice(0, 9)]); // Keep last 10 calculations
      
      return calculationResult;

    } catch (error) {
      const handledError = handleError(error, ErrorTypes.CALCULATION_ERROR);
      console.error('Calculation error:', handledError);
      throw handledError;
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies needed as all functions are pure and defined outside

  /**
   * Clear calculation history and reset result
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    setResult(null);
  }, []);

  /**
   * Get operation symbol for display
   * @param {string} operation - Operation type
   * @returns {string} Symbol representing the operation
   */
  const getOperationSymbol = useCallback((operation) => {
    return OPERATION_SYMBOLS[operation] || operation;
  }, []);

  // Memoize history to prevent unnecessary re-renders
  const memoizedHistory = useMemo(() => history, [history]);

  return {
    // Core functionality
    performCalculation,
    
    // State access
    result,
    history: memoizedHistory,
    isLoading,
    
    // Utility functions
    clearHistory,
    getOperationSymbol
  };
};

// PropTypes for better development experience
useCalculationEngine.propTypes = {
  // This is a hook, so no props are expected
};

export default useCalculationEngine;