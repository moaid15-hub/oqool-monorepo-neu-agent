import { RequestParser } from './RequestParser';
import { ErrorHandler } from './ErrorHandler';

/**
 * Input Validation Middleware
 * Validates calculation inputs for type safety, range checking, and operation validity
 */
class InputValidation {
  #supportedOperations;
  #numericRange;
  #operandCounts;

  constructor(config = {}) {
    const {
      supportedOperations = ['add', 'subtract', 'multiply', 'divide', 'power', 'sqrt'],
      numericRange = {
        min: -Number.MAX_SAFE_INTEGER,
        max: Number.MAX_SAFE_INTEGER
      },
      operandCounts = {
        add: 2,
        subtract: 2,
        multiply: 2,
        divide: 2,
        power: 2,
        sqrt: 1
      }
    } = config;

    this.#supportedOperations = new Set(supportedOperations.map(op => op.toLowerCase()));
    this.#numericRange = { ...numericRange };
    this.#operandCounts = new Map(Object.entries(operandCounts));
  }

  /**
   * Main validation middleware function
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next middleware function
   */
  validateCalculationInput(req, res, next) {
    try {
      const parsedRequest = RequestParser.parseCalculationRequest(req);
      
      // Validate parsed result structure
      this.#validateParsedRequest(parsedRequest);
      
      const { operation, operands } = parsedRequest;
      
      // Convert operation to lowercase once and reuse
      const normalizedOperation = this.#normalizeOperation(operation);
      
      // Validate operation
      this.#validateOperation(normalizedOperation);
      
      // Validate operands based on operation type
      this.#validateOperands(normalizedOperation, operands);
      
      // Additional operation-specific validations
      this.#validateSpecificRules(normalizedOperation, operands);
      
      next();
    } catch (error) {
      ErrorHandler.handleValidationError(res, error);
    }
  }

  /**
   * Validate parsed request structure
   * @param {Object} parsedRequest - Parsed request object
   * @private
   */
  #validateParsedRequest(parsedRequest) {
    if (!parsedRequest || typeof parsedRequest !== 'object') {
      throw new Error('Invalid request format');
    }

    if (typeof parsedRequest.operation === 'undefined') {
      throw new Error('Operation is required');
    }

    if (typeof parsedRequest.operands === 'undefined') {
      throw new Error('Operands are required');
    }
  }

  /**
   * Normalize operation string
   * @param {string} operation - The mathematical operation
   * @returns {string} Normalized operation
   * @private
   */
  #normalizeOperation(operation) {
    if (typeof operation !== 'string') {
      throw new Error('Operation must be a string');
    }

    // Sanitize operation string
    if (operation.length > 50) {
      throw new Error('Operation name too long');
    }

    // Remove special characters and normalize
    const sanitized = operation.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    if (sanitized.length === 0) {
      throw new Error('Operation name cannot be empty');
    }

    return sanitized;
  }

  /**
   * Validate operation type
   * @param {string} operation - The normalized mathematical operation
   * @private
   */
  #validateOperation(operation) {
    if (!this.#supportedOperations.has(operation)) {
      throw new Error(`Unsupported operation: ${operation}. Supported operations: ${Array.from(this.#supportedOperations).join(', ')}`);
    }
  }

  /**
   * Validate operands based on operation requirements
   * @param {string} operation - The normalized mathematical operation
   * @param {Array} operands - Array of operands
   * @private
   */
  #validateOperands(operation, operands) {
    if (!Array.isArray(operands)) {
      throw new Error('Operands must be provided as an array');
    }

    // Check operand count based on operation
    const requiredOperandCount = this.#getRequiredOperandCount(operation);
    if (operands.length !== requiredOperandCount) {
      throw new Error(`Operation '${operation}' requires exactly ${requiredOperandCount} operand${requiredOperandCount === 1 ? '' : 's'}`);
    }

    // Validate each operand
    operands.forEach((operand, index) => {
      this.#validateSingleOperand(operand, index);
    });
  }

  /**
   * Get required number of operands for each operation
   * @param {string} operation - The normalized mathematical operation
   * @returns {number} Required operand count
   * @private
   */
  #getRequiredOperandCount(operation) {
    const count = this.#operandCounts.get(operation);
    if (count === undefined) {
      throw new Error(`Unsupported operation: ${operation}. Cannot determine required operand count`);
    }
    return count;
  }

  /**
   * Validate a single operand
   * @param {*} operand - The operand to validate
   * @param {number} index - Operand index for error reporting
   * @private
   */
  #validateSingleOperand(operand, index) {
    // Type validation
    if (typeof operand !== 'number') {
      throw new Error(`Operand ${index + 1} must be a number`);
    }

    // Check for NaN and finite values
    if (Number.isNaN(operand)) {
      throw new Error(`Operand ${index + 1} cannot be NaN`);
    }

    if (!Number.isFinite(operand)) {
      throw new Error(`Operand ${index + 1} must be a finite number`);
    }

    // Check for precision limits
    if (!Number.isSafeInteger(operand) && Math.abs(operand) > Number.MAX_SAFE_INTEGER) {
      throw new Error(`Operand ${index + 1} exceeds JavaScript number precision limits`);
    }

    // Range validation
    if (operand < this.#numericRange.min || operand > this.#numericRange.max) {
      throw new Error(
        `Operand ${index + 1} must be between ${this.#numericRange.min} and ${this.#numericRange.max}`
      );
    }
  }

  /**
   * Operation-specific validation rules
   * @param {string} operation - The normalized mathematical operation
   * @param {Array} operands - Array of operands
   * @private
   */
  #validateSpecificRules(operation, operands) {
    switch (operation) {
      case 'divide':
        if (operands[1] === 0) {
          throw new Error('Division by zero is not allowed');
        }
        break;
        
      case 'sqrt':
        if (operands[0] < 0) {
          throw new Error('Square root of negative numbers is not supported');
        }
        break;
        
      case 'power':
        // Prevent extremely large exponents that could cause performance issues
        if (Math.abs(operands[1]) > 1000) {
          throw new Error('Exponent magnitude too large. Maximum allowed: 1000');
        }
        break;
        
      default:
        // No additional validation needed for basic operations
        break;
    }
  }

  /**
   * Add custom operation to supported operations
   * @param {string} operation - Operation to add
   * @param {number} operandCount - Required number of operands
   */
  addSupportedOperation(operation, operandCount) {
    const normalizedOperation = this.#normalizeOperation(operation);
    
    if (this.#supportedOperations.has(normalizedOperation)) {
      throw new Error(`Operation '${normalizedOperation}' is already supported`);
    }

    if (typeof operandCount !== 'number' || operandCount < 0 || !Number.isInteger(operandCount)) {
      throw new Error('Operand count must be a non-negative integer');
    }

    this.#supportedOperations.add(normalizedOperation);
    this.#operandCounts.set(normalizedOperation, operandCount);
  }

  /**
   * Remove supported operation
   * @param {string} operation - Operation to remove
   */
  removeSupportedOperation(operation) {
    const normalizedOperation = this.#normalizeOperation(operation);
    
    if (!this.#supportedOperations.has(normalizedOperation)) {
      throw new Error(`Operation '${normalizedOperation}' is not currently supported`);
    }

    this.#supportedOperations.delete(normalizedOperation);
    this.#operandCounts.delete(normalizedOperation);
  }

  /**
   * Update numeric range constraints
   * @param {Object} range - New range constraints
   * @param {number} range.min - Minimum value
   * @param {number} range.max - Maximum value
   */
  setNumericRange(range) {
    if (typeof range.min !== 'number' || typeof range.max !== 'number') {
      throw new Error('Range min and max must be numbers');
    }
    
    if (range.min >= range.max) {
      throw new Error('Range min must be less than max');
    }

    this.#numericRange = { ...range };
  }

  /**
   * Get current validation configuration
   * @returns {Object} Current validation settings
   */
  getValidationConfig() {
    return {
      supportedOperations: Array.from(this.#supportedOperations),
      numericRange: this.#numericRange,
      operandCounts: Object.fromEntries(this.#operandCounts)
    };
  }
}

// Export only the class for consistent usage
export default InputValidation;