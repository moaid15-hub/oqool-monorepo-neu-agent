// packages/cloud-editor/frontend/src/components/Settings.tsx
import React, { useState, useEffect } from 'react';

interface SettingsProps {
  onApiKeyChange: (apiKey: string) => void;
  currentApiKey: string;
}

export const Settings: React.FC<SettingsProps> = ({ onApiKeyChange, currentApiKey }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(currentApiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    // تحميل API key من localStorage
    const savedApiKey = localStorage.getItem('deepseek-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeyChange(savedApiKey);
    }
  }, [onApiKeyChange]);

  const handleSave = () => {
    localStorage.setItem('deepseek-api-key', apiKey);
    onApiKeyChange(apiKey);
    setIsOpen(false);
  };

  const handleClear = () => {
    setApiKey('');
    localStorage.removeItem('deepseek-api-key');
    onApiKeyChange('');
  };

  return (
    <>
      <button className="settings-btn" onClick={() => setIsOpen(true)} title="الإعدادات">
        ⚙️
      </button>

      {isOpen && (
        <div className="settings-modal">
          <div className="settings-content">
            <div className="settings-header">
              <h2>⚙️ إعدادات المحرر</h2>
              <button onClick={() => setIsOpen(false)}>×</button>
            </div>

            <div className="settings-body">
              <div className="setting-item">
                <label htmlFor="apiKey">مفتاح DeepSeek API:</label>
                <div className="api-key-input">
                  <input
                    id="apiKey"
                    type={showApiKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="أدخل مفتاح DeepSeek API"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="toggle-visibility"
                  >
                    {showApiKey ? '🙈' : '👁️'}
                  </button>
                </div>
                <small>
                  يمكنك الحصول على مفتاح API من{' '}
                  <a
                    href="https://platform.deepseek.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    موقع DeepSeek
                  </a>
                </small>
              </div>

              <div className="setting-item">
                <h3>🤖 ميزات الذكاء الاصطناعي:</h3>
                <ul>
                  <li>✨ إكمال الكود التلقائي</li>
                  <li>📖 شرح الكود بالعربية</li>
                  <li>🔧 إصلاح الأخطاء</li>
                  <li>⚡ تحسين الأداء</li>
                  <li>🚀 توليد كود جديد</li>
                </ul>
              </div>
            </div>

            <div className="settings-footer">
              <button onClick={handleClear} className="clear-btn">
                🗑️ مسح
              </button>
              <button onClick={handleSave} className="save-btn">
                💾 حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
