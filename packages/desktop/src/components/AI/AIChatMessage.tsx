import React from 'react';
import { AIMessage as AIMessageType } from '../../types';
import { formatDate } from '../../utils';
import './AIChatMessage.css';

interface AIChatMessageProps {
  message: AIMessageType;
}

export const AIChatMessage: React.FC<AIChatMessageProps> = ({ message }) => {
  return (
    <div className={`ai-message ${message.role}`}>
      <div className="message-header">
        <span className="message-role">{message.role === 'user' ? '👤 أنت' : '🤖 AI'}</span>
        {message.timestamp && <span className="message-time">{formatDate(message.timestamp)}</span>}
      </div>
      <div className="message-content">{message.content}</div>
    </div>
  );
};
