import React, { useState, useRef } from 'react';
import { useI18n } from '../hooks/useI18n';

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
}

interface ChatPanelProps {
  onSendMessage?: (message: string, agent: string) => void;
  messages?: ChatMessage[];
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onSendMessage, messages = [] }) => {
  const [activeTab, setActiveTab] = useState('chat');
  const [inputValue, setInputValue] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('Claude Sonnet 3.5');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useI18n();

  const agents = [
    'Claude Sonnet 3.5',
    'Claude Opus 3',
    'ChatGPT-4',
    'ChatGPT-4 Turbo',
    'GPT-3.5 Turbo',
    'DeepSeek V3',
    'Gemini Pro',
    'Gemini Ultra',
    'Llama 3',
    'Mistral Large',
  ];

  const shortcuts = [
    { labelKey: 'shortcuts.commands', keys: ['Ctrl', 'Shift', 'P'] },
    { labelKey: 'shortcuts.file', keys: ['Ctrl', 'P'] },
    { labelKey: 'shortcuts.chat', keys: ['Ctrl', 'Alt', 'I'] },
  ];

  const handleSendMessage = () => {
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim(), selectedAgent);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  return (
    <div className="chat-panel">
      {/* Chat Header */}
      <div className="chat-header">
        <div className="chat-tabs">
          <div
            className={`chat-tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            {t('chat.tab')}
          </div>
        </div>

        <div className="chat-actions">
          <button className="chat-action-btn" title="New Chat">
            +
          </button>
          <button className="chat-action-btn" title="Settings">
            ⚙
          </button>
          <button className="chat-action-btn" title="More">
            ⋯
          </button>
        </div>
      </div>

      {/* Chat Content */}
      <div className="chat-content">
        {messages.length === 0 ? (
          <div className="chat-welcome">
            <div className="chat-icon">
              <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="30" y="30" width="60" height="60" rx="5" />
                <path d="M45 50 L55 60 L75 40" />
              </svg>
            </div>

            <div className="welcome-content">
              <h3 className="chat-title">{t('chat.title')}</h3>
              <p className="chat-subtitle">{t('chat.subtitle')}</p>

              <button className="generate-instructions-btn">{t('chat.link')}</button>
              <p className="onboard-text">{t('chat.onboard')}</p>

              <div className="shortcuts-list">
                {shortcuts.map((shortcut, index) => (
                  <div key={index} className="shortcut-item">
                    <span className="shortcut-label">{t(shortcut.labelKey as any)}</span>
                    <div className="shortcut-keys">
                      {shortcut.keys.map((key, keyIndex) => (
                        <span key={keyIndex} className="key">
                          {key}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="chat-messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.type}`}>
                <div className="message-content">
                  <p>{message.content}</p>
                  <span className="message-time">{message.timestamp.toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="chat-input-area">
        <div className="input-container">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t('chat.placeholder')}
            className="chat-input"
            rows={1}
          />
        </div>

        <div className="chat-controls">
          <div className="agent-selector">
            <span className="agent-label">{t('chat.agent')}</span>
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="agent-select"
            >
              {agents.map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="send-button"
            title="Send Message"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
