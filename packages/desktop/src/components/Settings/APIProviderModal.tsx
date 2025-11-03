import React, { useState } from 'react';
import './APIProviderModal.css';

interface APIProvider {
  id: string;
  name: string;
  apiKey: string;
  models: string[];
  baseURL?: string;
  isActive: boolean;
}

interface APIProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (provider: APIProvider) => void;
}

const AVAILABLE_PROVIDERS = [
  {
    id: 'anthropic',
    name: '🧠 Anthropic Claude (Code Expert)',
    baseURL: 'https://api.anthropic.com/v1',
    defaultModels: [
      'claude-sonnet-4-20250514',
      'claude-opus-4-20250514',
      'claude-3-5-sonnet-20241022',
    ],
  },
  {
    id: 'deepseek',
    name: '🔮 DeepSeek (Code Specialist)',
    baseURL: 'https://api.deepseek.com/v1',
    defaultModels: ['deepseek-coder', 'deepseek-coder-33b-instruct'],
  },
  {
    id: 'google',
    name: '✨ Google CodeGemini',
    baseURL: 'https://generativelanguage.googleapis.com/v1',
    defaultModels: ['codechat-bison-32k', 'gemini-1.5-pro', 'code-gecko'],
  },
  {
    id: 'openai',
    name: '⚡ OpenAI (Code Focused)',
    baseURL: 'https://api.openai.com/v1',
    defaultModels: ['gpt-4o', 'gpt-4-turbo', 'gpt-4'],
  },
  {
    id: 'custom',
    name: '🔧 Custom Code Provider',
    baseURL: '',
    defaultModels: [],
  },
];

export const APIProviderModal: React.FC<APIProviderModalProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedProvider, setSelectedProvider] = useState<string>('anthropic');
  const [apiKey, setApiKey] = useState<string>('');
  const [baseURL, setBaseURL] = useState<string>('');
  const [customModels, setCustomModels] = useState<string>('');
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  if (!isOpen) {return null;}

  const currentProvider = AVAILABLE_PROVIDERS.find((p) => p.id === selectedProvider);
  const availableModels = currentProvider?.defaultModels || [];

  const handleModelToggle = (model: string) => {
    setSelectedModels((prev) =>
      prev.includes(model) ? prev.filter((m) => m !== model) : [...prev, model]
    );
  };

  const handleSave = () => {
    const modelsToUse =
      selectedProvider === 'custom'
        ? customModels
            .split(',')
            .map((m) => m.trim())
            .filter(Boolean)
        : selectedModels.length > 0
          ? selectedModels
          : availableModels;

    // Use default baseURL if not custom, or user-provided baseURL
    const finalBaseURL =
      selectedProvider === 'custom'
        ? baseURL.trim() || undefined
        : currentProvider?.baseURL || undefined;

    const provider: APIProvider = {
      id: `${selectedProvider}-${Date.now()}`,
      name: currentProvider?.name || 'Custom',
      apiKey: apiKey.trim(),
      models: modelsToUse,
      baseURL: finalBaseURL,
      isActive: true,
    };

    onSave(provider);
    handleClose();
  };

  const handleClose = () => {
    setSelectedProvider('anthropic');
    setApiKey('');
    setBaseURL('');
    setCustomModels('');
    setSelectedModels([]);
    onClose();
  };

  return (
    <div className="api-modal-overlay" onClick={handleClose}>
      <div className="api-modal" onClick={(e) => e.stopPropagation()}>
        <div className="api-modal-header">
          <h2>إضافة مزود API للبرمجة</h2>
          <button className="api-modal-close" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="api-modal-body">
          {/* Info Banner */}
          <div
            style={{
              padding: '12px',
              background: '#2d2d30',
              border: '1px solid #3e3e42',
              borderRadius: '6px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#cccccc',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '6px', color: '#4fc3f7' }}>
              💻 نماذج متخصصة في كتابة الأكواد
            </div>
            <div style={{ fontSize: '12px', color: '#999999' }}>
              جميع النماذج المتاحة متخصصة في كتابة وتطوير الأكواد البرمجية
            </div>
          </div>

          {/* Provider Selection */}
          <div className="api-form-group">
            <label>اختر المزود</label>
            <select
              value={selectedProvider}
              onChange={(e) => {
                setSelectedProvider(e.target.value);
                setSelectedModels([]);
              }}
              className="api-select"
            >
              {AVAILABLE_PROVIDERS.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          {/* API Key Input */}
          <div className="api-form-group">
            <label>مفتاح الـ API</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="أدخل مفتاح الـ API..."
              className="api-input"
            />
          </div>

          {/* Base URL (for custom providers) */}
          {selectedProvider === 'custom' && (
            <div className="api-form-group">
              <label>Base URL (اختياري)</label>
              <input
                type="text"
                value={baseURL}
                onChange={(e) => setBaseURL(e.target.value)}
                placeholder="https://api.example.com"
                className="api-input"
              />
            </div>
          )}

          {/* Model Selection */}
          <div className="api-form-group">
            <label>الموديلات المتاحة</label>
            {selectedProvider === 'custom' ? (
              <textarea
                value={customModels}
                onChange={(e) => setCustomModels(e.target.value)}
                placeholder="أدخل أسماء الموديلات مفصولة بفاصلة (مثال: model-1, model-2)"
                className="api-textarea"
                rows={4}
              />
            ) : (
              <div className="api-models-list">
                {availableModels.length === 0 ? (
                  <p className="no-models">لا توجد موديلات متاحة</p>
                ) : (
                  availableModels.map((model) => (
                    <label key={model} className="api-model-item">
                      <input
                        type="checkbox"
                        checked={selectedModels.includes(model)}
                        onChange={() => handleModelToggle(model)}
                      />
                      <span>{model}</span>
                    </label>
                  ))
                )}
              </div>
            )}
            {selectedProvider !== 'custom' && selectedModels.length === 0 && (
              <p className="api-hint">لم تختر أي موديل - سيتم استخدام جميع الموديلات المتاحة</p>
            )}
          </div>
        </div>

        <div className="api-modal-footer">
          <button className="api-btn api-btn-secondary" onClick={handleClose}>
            إلغاء
          </button>
          <button
            className="api-btn api-btn-primary"
            onClick={handleSave}
            disabled={!apiKey.trim()}
          >
            حفظ المزود
          </button>
        </div>
      </div>
    </div>
  );
};
