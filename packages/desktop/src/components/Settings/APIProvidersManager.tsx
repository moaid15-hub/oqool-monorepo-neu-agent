import React, { useState, useEffect } from 'react';
import { APIProviderModal } from './APIProviderModal';
import './APIProvidersManager.css';

interface APIProvider {
  id: string;
  name: string;
  apiKey: string;
  models: string[];
  baseURL?: string;
  isActive: boolean;
}

export const APIProvidersManager: React.FC = () => {
  const [providers, setProviders] = useState<APIProvider[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      // @ts-ignore
      const result = await window.electron.settings.get('api.providers');
      if (result.success && result.value) {
        setProviders(result.value);
      }
    } catch (error) {
      console.error('Failed to load providers:', error);
    }
  };

  const saveProviders = async (newProviders: APIProvider[]) => {
    try {
      // @ts-ignore
      await window.electron.settings.set('api.providers', newProviders);
      setProviders(newProviders);
    } catch (error) {
      console.error('Failed to save providers:', error);
    }
  };

  const handleAddProvider = (provider: APIProvider) => {
    const newProviders = [...providers, provider];
    saveProviders(newProviders);
  };

  const handleDeleteProvider = (id: string) => {
    const newProviders = providers.filter((p) => p.id !== id);
    saveProviders(newProviders);
  };

  const handleToggleProvider = (id: string) => {
    const newProviders = providers.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p));
    saveProviders(newProviders);
  };

  const handleSelectProvider = async (id: string) => {
    setSelectedProvider(id);
    try {
      // @ts-ignore
      await window.electron.settings.set('api.activeProvider', id);
    } catch (error) {
      console.error('Failed to set active provider:', error);
    }
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) {return '***';}
    return key.slice(0, 4) + '...' + key.slice(-4);
  };

  return (
    <div className="api-providers-manager">
      <div className="api-providers-header">
        <h3>مزودي API</h3>
        <button className="api-add-btn" onClick={() => setIsModalOpen(true)}>
          + إضافة API
        </button>
      </div>

      {providers.length === 0 ? (
        <div className="api-empty-state">
          <div className="api-empty-icon">🔑</div>
          <p>لم تقم بإضافة أي مزود API بعد</p>
          <button className="api-empty-btn" onClick={() => setIsModalOpen(true)}>
            إضافة مزود API الأول
          </button>
        </div>
      ) : (
        <div className="api-providers-list">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className={`api-provider-card ${provider.isActive ? 'active' : 'inactive'} ${selectedProvider === provider.id ? 'selected' : ''}`}
            >
              <div className="api-provider-main">
                <div className="api-provider-info">
                  <div className="api-provider-name">{provider.name}</div>
                  <div className="api-provider-key">مفتاح API: {maskApiKey(provider.apiKey)}</div>
                  <div className="api-provider-models">{provider.models.length} موديل متاح</div>
                </div>

                <div className="api-provider-actions">
                  <label className="api-toggle">
                    <input
                      type="checkbox"
                      checked={provider.isActive}
                      onChange={() => handleToggleProvider(provider.id)}
                    />
                    <span className="api-toggle-slider"></span>
                  </label>

                  <button
                    className="api-action-btn api-select-btn"
                    onClick={() => handleSelectProvider(provider.id)}
                    disabled={!provider.isActive}
                  >
                    {selectedProvider === provider.id ? '✓ مفعّل' : 'تفعيل'}
                  </button>

                  <button
                    className="api-action-btn api-delete-btn"
                    onClick={() => handleDeleteProvider(provider.id)}
                    title="حذف"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              {provider.models.length > 0 && (
                <div className="api-provider-models-list">
                  {provider.models.slice(0, 3).map((model, idx) => (
                    <span key={idx} className="api-model-badge">
                      {model}
                    </span>
                  ))}
                  {provider.models.length > 3 && (
                    <span className="api-model-badge api-model-more">
                      +{provider.models.length - 3} أخرى
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <APIProviderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddProvider}
      />
    </div>
  );
};
