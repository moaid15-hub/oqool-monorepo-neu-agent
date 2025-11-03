import React, { useState } from 'react';
import { aiService, AIPersonality } from '../../services/ai-service';
import { AIMessage } from '../../types';
import { AIPersonalitySelector } from './AIPersonalitySelector';
import { AIChatMessage } from './AIChatMessage';
import './AIPanel.css';

export const AIPanel: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState<AIPersonality>('alex');

  const handleSend = async () => {
    if (!input.trim() || loading) {return;}

    const userMessage: AIMessage = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await aiService.call({
        personality,
        messages: [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user', content: input },
        ],
      });

      const aiMessage: AIMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('AI Error:', error);
      const errorMessage: AIMessage = {
        role: 'assistant',
        content: `❌ حدث خطأ: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <h3>🤖 مساعد AI</h3>
        <AIPersonalitySelector selected={personality} onChange={setPersonality} />
      </div>

      <div className="ai-chat-container">
        {messages.length === 0 ? (
          <div className="ai-welcome">
            <h2>👋 مرحباً!</h2>
            <p>أنا {aiService.getPersonalityInfo(personality).name}</p>
            <p>{aiService.getPersonalityInfo(personality).description}</p>
          </div>
        ) : (
          messages.map((msg, i) => <AIChatMessage key={i} message={msg} />)
        )}
        {loading && (
          <div className="ai-loading">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <div className="ai-input-container">
        <textarea
          className="ai-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="اسأل أي سؤال... (Enter للإرسال)"
          rows={3}
        />
        <button className="ai-send-button" onClick={handleSend} disabled={!input.trim() || loading}>
          📤 إرسال
        </button>
      </div>
    </div>
  );
};
