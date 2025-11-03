// packages/cloud-editor/frontend/src/components/AIAssistant.tsx
import React, { useState, useRef } from 'react';
import { useDeepSeek } from '../hooks/useDeepSeek';
import { useNotifications } from '../hooks/useNotifications';

interface AIAssistantProps {
  apiKey?: string;
  selectedText?: string;
  currentCode?: string;
  language?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({
  apiKey,
  selectedText,
  currentCode,
  language = 'javascript',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [activeTab, setActiveTab] = useState<
    'complete' | 'explain' | 'generate' | 'fix' | 'optimize'
  >('complete');
  const resultRef = useRef<HTMLDivElement>(null);

  const {
    loading,
    error,
    result,
    getCodeCompletion,
    explainCode,
    generateCode,
    fixCode,
    optimizeCode,
    clearState,
    isConfigured,
  } = useDeepSeek(apiKey);

  const { addNotification } = useNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !selectedText) return;

    try {
      switch (activeTab) {
        case 'complete':
          await getCodeCompletion(prompt || selectedText || '', currentCode || '');
          break;
        case 'explain':
          await explainCode(selectedText || prompt);
          break;
        case 'generate':
          await generateCode(prompt, language);
          break;
        case 'fix':
          await fixCode(currentCode || selectedText || '', prompt);
          break;
        case 'optimize':
          await optimizeCode(selectedText || currentCode || '');
          break;
      }

      addNotification('تمت العملية بنجاح!', 'success');
    } catch (err) {
      addNotification(error || 'حدث خطأ في معالجة الطلب', 'error');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addNotification('تم نسخ النص إلى الحافظة', 'success');
  };

  if (!isConfigured) {
    return (
      <div className="ai-assistant-config">
        <div className="config-message">
          <span>🤖</span>
          <p>يرجى إدخال API Key لتفعيل مساعد الذكاء الاصطناعي</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`ai-assistant ${isOpen ? 'open' : ''}`}>
      <button
        className="ai-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="مساعد الذكاء الاصطناعي"
      >
        🤖 AI
      </button>

      {isOpen && (
        <div className="ai-panel">
          <div className="ai-header">
            <h3>🤖 مساعد الذكاء الاصطناعي</h3>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>

          <div className="ai-tabs">
            <button
              className={activeTab === 'complete' ? 'active' : ''}
              onClick={() => setActiveTab('complete')}
            >
              إكمال الكود
            </button>
            <button
              className={activeTab === 'explain' ? 'active' : ''}
              onClick={() => setActiveTab('explain')}
            >
              شرح الكود
            </button>
            <button
              className={activeTab === 'generate' ? 'active' : ''}
              onClick={() => setActiveTab('generate')}
            >
              توليد كود
            </button>
            <button
              className={activeTab === 'fix' ? 'active' : ''}
              onClick={() => setActiveTab('fix')}
            >
              إصلاح خطأ
            </button>
            <button
              className={activeTab === 'optimize' ? 'active' : ''}
              onClick={() => setActiveTab('optimize')}
            >
              تحسين الكود
            </button>
          </div>

          <form onSubmit={handleSubmit} className="ai-form">
            {activeTab === 'explain' || activeTab === 'optimize' ? (
              <div className="selected-code">
                <label>الكود المحدد:</label>
                <pre>{selectedText || 'لم يتم تحديد أي كود'}</pre>
              </div>
            ) : (
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={
                  activeTab === 'complete'
                    ? 'اكتب بداية الكود أو الوصف...'
                    : activeTab === 'generate'
                      ? 'صف الكود المطلوب...'
                      : activeTab === 'fix'
                        ? 'صف المشكلة أو الخطأ...'
                        : 'اكتب طلبك...'
                }
                rows={4}
                disabled={loading}
              />
            )}

            <div className="ai-actions">
              <button type="submit" disabled={loading || (!prompt.trim() && !selectedText)}>
                {loading ? '⏳ جاري المعالجة...' : '🚀 تنفيذ'}
              </button>
              <button type="button" onClick={clearState} disabled={loading}>
                🗑️ مسح
              </button>
            </div>
          </form>

          {error && (
            <div className="ai-error">
              <p>❌ خطأ: {error}</p>
            </div>
          )}

          {result && (
            <div className="ai-result" ref={resultRef}>
              <div className="result-header">
                <h4>📝 النتيجة:</h4>
                <button onClick={() => copyToClipboard(result)}>📋 نسخ</button>
              </div>
              <pre className="result-content">{result}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
