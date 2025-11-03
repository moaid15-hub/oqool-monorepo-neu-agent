import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './Calculator.css';

// Constants for better maintainability
const DISPLAY_CONSTANTS = {
  MAX_DISPLAY_LENGTH: 12,
  MAX_NUMBER: 999999999999,
  MIN_NUMBER: 0.000001,
  EXPONENTIAL_DECIMALS: 6,
  MAX_HISTORY_ITEMS: 10
};

const OPERATOR_MAP = {
  '×': '*',
  '÷': '/',
  '+': '+',
  '-': '-'
};

const OPERATOR_DISPLAY_MAP = {
  '*': '×',
  '/': '÷',
  '+': '+',
  '-': '-'
};

// Validation schemas
const isValidNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num);
};

const isValidCalculation = (calc) => {
  return calc && 
         typeof calc.id === 'string' &&
         typeof calc.expression === 'string' &&
         typeof calc.result === 'string' &&
         calc.timestamp instanceof Date &&
         !isNaN(calc.timestamp.getTime());
};

const sanitizeHistoryData = (data) => {
  if (!Array.isArray(data)) return [];
  
  return data
    .filter(item => 
      item && 
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.expression === 'string' &&
      typeof item.result === 'string' &&
      item.timestamp
    )
    .map(item => ({
      id: String(item.id),
      expression: String(item.expression),
      result: String(item.result),
      timestamp: new Date(item.timestamp)
    }))
    .filter(item => !isNaN(item.timestamp.getTime()) && isValidCalculation(item))
    .slice(0, DISPLAY_CONSTANTS.MAX_HISTORY_ITEMS);
};

const Calculator = ({ authService, apiService }) => {
  const [display, setDisplay] = useState('0');
  const [currentInput, setCurrentInput] = useState('0');
  const [previousInput, setPreviousInput] = useState('');
  const [operator, setOperator] = useState(null);
  const [waitingForNewInput, setWaitingForNewInput] = useState(false);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  // Load history from localStorage on component mount
  useEffect(() => {
    loadHistoryFromStorage();
  }, []);

  const loadHistoryFromStorage = useCallback(() => {
    try {
      const storedHistory = localStorage.getItem('calculatorHistory');
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        const sanitizedHistory = sanitizeHistoryData(parsedHistory);
        setHistory(sanitizedHistory);
      }
    } catch (error) {
      console.error('Failed to load history from storage:', error);
      setHistory([]);
    }
  }, []);

  const saveHistoryToStorage = useCallback((historyData) => {
    try {
      localStorage.setItem('calculatorHistory', JSON.stringify(historyData));
    } catch (error) {
      console.error('Failed to save history to storage:', error);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleNumberInput = useCallback((number) => {
    clearError();
    
    if (waitingForNewInput) {
      setDisplay(number);
      setCurrentInput(number);
      setWaitingForNewInput(false);
      return;
    }

    const newInput = currentInput === '0' ? number : currentInput + number;
    setDisplay(newInput);
    setCurrentInput(newInput);
  }, [currentInput, waitingForNewInput, clearError]);

  const handleDecimal = useCallback(() => {
    clearError();
    
    if (waitingForNewInput) {
      setDisplay('0.');
      setCurrentInput('0.');
      setWaitingForNewInput(false);
      return;
    }

    if (!currentInput.includes('.')) {
      const newInput = currentInput + '.';
      setDisplay(newInput);
      setCurrentInput(newInput);
    }
  }, [currentInput, waitingForNewInput, clearError]);

  const performCalculation = useCallback((first, second, operatorSymbol) => {
    try {
      if (!isValidNumber(first) || !isValidNumber(second)) {
        throw new Error('Invalid number input');
      }

      const firstNum = parseFloat(first);
      const secondNum = parseFloat(second);
      const calcOperator = OPERATOR_MAP[operatorSymbol] || operatorSymbol;

      let result;
      switch (calcOperator) {
        case '+':
          result = firstNum + secondNum;
          break;
        case '-':
          result = firstNum - secondNum;
          break;
        case '*':
          result = firstNum * secondNum;
          break;
        case '/':
          if (secondNum === 0) {
            throw new Error('Cannot divide by zero');
          }
          result = firstNum / secondNum;
          break;
        default:
          throw new Error(`Unknown operator: ${operatorSymbol}`);
      }

      if (!isFinite(result)) {
        throw new Error('Calculation resulted in invalid number');
      }

      return { value: result.toString(), error: null };
    } catch (error) {
      return { value: null, error: error.message };
    }
  }, []);

  const handleOperator = useCallback((nextOperator) => {
    clearError();

    if (previousInput && operator && !waitingForNewInput) {
      const result = performCalculation(previousInput, currentInput, operator);
      
      if (result.error) {
        setError(result.error);
        return;
      }

      setDisplay(result.value);
      setPreviousInput(result.value);
      setCurrentInput(result.value);
      setOperator(nextOperator);
      setWaitingForNewInput(true);
      return;
    }

    setPreviousInput(currentInput);
    setOperator(nextOperator);
    setWaitingForNewInput(true);
  }, [previousInput, operator, currentInput, waitingForNewInput, performCalculation, clearError]);

  const handleEquals = useCallback(async () => {
    clearError();
    
    if (!operator || waitingForNewInput) {
      return;
    }

    const result = performCalculation(previousInput, currentInput, operator);
    
    if (result.error) {
      setError(result.error);
      return;
    }

    const displayOperator = OPERATOR_DISPLAY_MAP[operator] || operator;
    const calculation = {
      id: Date.now().toString(),
      expression: `${previousInput} ${displayOperator} ${currentInput}`,
      result: result.value,
      timestamp: new Date()
    };

    try {
      // Save to backend if authenticated
      if (authService.isAuthenticated()) {
        await apiService.saveCalculation(calculation);
      }

      // Update local state and storage
      const newHistory = [calculation, ...history];
      const trimmedHistory = newHistory.length > DISPLAY_CONSTANTS.MAX_HISTORY_ITEMS 
        ? newHistory.slice(0, DISPLAY_CONSTANTS.MAX_HISTORY_ITEMS)
        : newHistory;

      setDisplay(result.value);
      setPreviousInput('');
      setOperator(null);
      setWaitingForNewInput(true);
      setHistory(trimmedHistory);
      
      saveHistoryToStorage(trimmedHistory);
    } catch (error) {
      console.error('Failed to save calculation:', error);
      setError('Failed to save calculation');
    }
  }, [operator, waitingForNewInput, previousInput, currentInput, performCalculation, history, authService, apiService, saveHistoryToStorage, clearError]);

  const handleClear = useCallback(() => {
    clearError();
    setDisplay('0');
    setCurrentInput('0');
    setPreviousInput('');
    setOperator(null);
    setWaitingForNewInput(false);
  }, [clearError]);

  const handleClearAll = useCallback(() => {
    clearError();
    setDisplay('0');
    setCurrentInput('0');
    setPreviousInput('');
    setOperator(null);
    setWaitingForNewInput(false);
    setHistory([]);
    localStorage.removeItem('calculatorHistory');
  }, [clearError]);

  const handleClearEntry = useCallback(() => {
    clearError();
    setDisplay('0');
    setCurrentInput('0');
    setWaitingForNewInput(false);
  }, [clearError]);

  const handleBackspace = useCallback(() => {
    clearError();
    
    if (waitingForNewInput) {
      return;
    }

    const newInput = currentInput.length > 1 
      ? currentInput.slice(0, -1) 
      : '0';
    
    setDisplay(newInput);
    setCurrentInput(newInput);
  }, [currentInput, waitingForNewInput, clearError]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('calculatorHistory');
  }, []);

  const formatDisplay = useMemo(() => {
    return (value) => {
      const num = parseFloat(value);
      if (isNaN(num)) return value;
      
      // Format large numbers with exponential notation
      if (Math.abs(num) > DISPLAY_CONSTANTS.MAX_NUMBER || 
          (Math.abs(num) < DISPLAY_CONSTANTS.MIN_NUMBER && num !== 0)) {
        return num.toExponential(DISPLAY_CONSTANTS.EXPONENTIAL_DECIMALS);
      }
      
      return num.toString().length > DISPLAY_CONSTANTS.MAX_DISPLAY_LENGTH 
        ? num.toExponential(DISPLAY_CONSTANTS.EXPONENTIAL_DECIMALS)
        : value;
    };
  }, []);

  const sanitizeHTML = useCallback((text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }, []);

  const HistoryItem = React.memo(({ calc }) => (
    <div className="history-item">
      <div 
        className="history-expression" 
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(calc.expression) }}
      />
      <div 
        className="history-result" 
        dangerouslySetInnerHTML={{ __html: sanitizeHTML(`= ${calc.result}`) }}
      />
      <div className="history-timestamp">
        {calc.timestamp.toLocaleTimeString()}
      </div>
    </div>
  ));

  const formattedDisplay = useMemo(() => formatDisplay(display), [display, formatDisplay]);

  return (
    <div className="calculator">
      {error && (
        <div className="error-message">
          {error}
          <button className="error-close" onClick={clearError}>×</button>
        </div>
      )}
      
      <div className="calculator-layout">
        <div className="calculator-main">
          <div className="display">
            <div className="display-value">{formattedDisplay}</div>
            {operator && (
              <div className="display-operation">
                {previousInput} {OPERATOR_DISPLAY_MAP[operator] || operator}
              </div>
            )}
          </div>
          
          <div className="keypad">
            <div className="keypad-row">
              <button className="btn btn-clear" onClick={handleClearAll}>AC</button>
              <button className="btn btn-clear" onClick={handleClear}>C</button>
              <button className="btn btn-clear" onClick={handleClearEntry}>CE</button>
              <button className="btn btn-clear" onClick={handleBackspace}>⌫</button>
              <button className="btn btn-operator" onClick={() => handleOperator('÷')}>÷</button>
            </div>
            
            <div className="keypad-row">
              <button className="btn btn-number" onClick={() => handleNumberInput('7')}>7</button>
              <button className="btn btn-number" onClick={() => handleNumberInput('8')}>8</button>
              <button className="btn btn-number" onClick={() => handleNumberInput('9')}>9</button>
              <button className="btn btn-operator" onClick={() => handleOperator('×')}>×</button>
            </div>
            
            <div className="keypad-row">
              <button className="btn btn-number" onClick={() => handleNumberInput('4')}>4</button>
              <button className="btn btn-number" onClick={() => handleNumberInput('5')}>5</button>
              <button className="btn btn-number" onClick={() => handleNumberInput('6')}>6</button>
              <button className="btn btn-operator" onClick={() => handleOperator('-')}>-</button>
            </div>
            
            <div className="keypad-row">
              <button className="btn btn-number" onClick={() => handleNumberInput('1')}>1</button>
              <button className="btn btn-number" onClick={() => handleNumberInput('2')}>2</button>
              <button className="btn btn-number" onClick={() => handleNumberInput('3')}>3</button>
              <button className="btn btn-operator" onClick={() => handleOperator('+')}>+</button>
            </div>
            
            <div className="keypad-row">
              <button className="btn btn-number btn-zero" onClick={() => handleNumberInput('0')}>0</button>
              <button className="btn btn-number" onClick={handleDecimal}>.</button>
              <button className="btn btn-equals" onClick={handleEquals}>=</button>
            </div>
          </div>
        </div>
        
        <div className="history-panel">
          <div className="history-header">
            <h3>History</h3>
            {history.length > 0 && (
              <button className="btn-clear-history" onClick={clearHistory}>
                Clear
              </button>
            )}
          </div>
          
          <div className="history-list">
            {history.length === 0 ? (
              <div className="history-empty">No calculations yet</div>
            ) : (
              history.map(calc => (
                <HistoryItem key={calc.id} calc={calc} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;