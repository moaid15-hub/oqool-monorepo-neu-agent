import React, { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className={`oqool-input-wrapper ${className}`}>
      {label && <label className="input-label">{label}</label>}
      <input className={`oqool-input ${error ? 'error' : ''}`} {...props} />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};
