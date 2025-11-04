import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './FrontendApplication.css';
import { fetchTodosAPI, addTodoAPI, toggleTodoAPI, deleteTodoAPI, clearCompletedAPI } from '../services/todoService';
import useErrorHandler from '../hooks/useErrorHandler';

const FrontendApplication = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const { error, handleError, clearError } = useErrorHandler();

  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchTodosAPI();
      setTodos(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      const newTodo = await addTodoAPI(inputValue.trim());
      setTodos(prev => [...prev, newTodo]);
      setInputValue('');
    } catch (err) {
      handleError(err);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const updatedTodo = await toggleTodoAPI(id);
      setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));
    } catch (err) {
      handleError(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteTodoAPI(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      handleError(err);
    }
  };

  const clearCompleted = async () => {
    try {
      await clearCompletedAPI();
      setTodos(prev => prev.filter(t => !t.completed));
    } catch (err) {
      handleError(err);
    }
  };

  const filteredTodos = useMemo(() => todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  }), [todos, filter]);

  const activeTodosCount = useMemo(() => todos.filter(todo => !todo.completed).length, [todos]);
  const completedTodosCount = todos.length - activeTodosCount;

  if (loading && todos.length === 0) {
    return (
      <div className="frontend-app loading">
        <div className="loading-spinner">Loading todos...</div>
      </div>
    );
  }

  return (
    <div className="frontend-app">
      <header className="app-header">
        <h1>Todo App</h1>
        <p>Manage your tasks efficiently</p>
      </header>

      <main className="app-main">
        <form onSubmit={addTodo} className="add-todo-form">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="todo-input"
            maxLength={255}
            disabled={loading}
          />
          <button 
            type="submit" 
            className="add-button"
            disabled={loading || !inputValue.trim()}
          >
            Add
          </button>
        </form>

        {error && (
          <div className="error-message">
            Error: {error}
            <button onClick={clearError} className="dismiss-error">
              ×
            </button>
          </div>
        )}

        {filteredTodos.length > 0 ? (
          <ul className="todo-list">
            {filteredTodos.map(todo => (
              <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="todo-checkbox"
                  disabled={loading}
                />
                <span className="todo-title">{todo.title}</span>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="delete-button"
                  disabled={loading}
                  aria-label={`Delete todo: ${todo.title}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="empty-state">
            {todos.length === 0 ? 'No todos yet. Add one above!' : 'No todos match the current filter.'}
          </div>
        )}

        {todos.length > 0 && (
          <footer className="app-footer">
            <div className="todo-stats">
              <span>{activeTodosCount} item{activeTodosCount !== 1 ? 's' : ''} left</span>
            </div>
            
            <div className="filter-buttons">
              {['all', 'active', 'completed'].map(filterType => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`filter-button ${filter === filterType ? 'active' : ''}`}
                  disabled={loading}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>

            {completedTodosCount > 0 && (
              <button
                onClick={clearCompleted}
                className="clear-completed"
                disabled={loading}
              >
                Clear Completed ({completedTodosCount})
              </button>
            )}
          </footer>
        )}
      </main>
    </div>
  );
};

export default FrontendApplication;