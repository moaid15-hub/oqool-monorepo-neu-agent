import React, { useState } from 'react';

interface KeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySave: (service: string, key: string) => void;
}

const KeyManager: React.FC<KeyManagerProps> = ({ isOpen, onClose, onKeySave }) => {
  const [apiKeys, setApiKeys] = useState({
    deepseek: '',
    openai: '',
    claude: '',
  });

  const handleSave = (service: string) => {
    if (apiKeys[service as keyof typeof apiKeys]) {
      onKeySave(service, apiKeys[service as keyof typeof apiKeys]);
      // محاكاة حفظ آمن
      console.log(`تم حفظ مفتاح ${service} بشكل آمن`);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: '#2d2d2d',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        zIndex: 1000,
        minWidth: '400px',
      }}
    >
      <h3>🔑 مركز إدارة مفاتيح API</h3>

      <div style={{ margin: '15px 0' }}>
        <label>DeepSeek API Key:</label>
        <input
          type="password"
          value={apiKeys.deepseek}
          onChange={(e) => setApiKeys({ ...apiKeys, deepseek: e.target.value })}
          placeholder="أدخل مفتاح DeepSeek API"
          style={{ width: '100%', marginTop: '5px', padding: '8px' }}
        />
        <button onClick={() => handleSave('deepseek')} style={{ marginTop: '5px' }}>
          💾 حفظ DeepSeek
        </button>
      </div>

      <div style={{ margin: '15px 0' }}>
        <label>OpenAI API Key:</label>
        <input
          type="password"
          value={apiKeys.openai}
          onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
          placeholder="أدخل مفتاح OpenAI API"
          style={{ width: '100%', marginTop: '5px', padding: '8px' }}
        />
        <button onClick={() => handleSave('openai')} style={{ marginTop: '5px' }}>
          � حفظ OpenAI
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <button onClick={onClose}>إغلاق</button>
        <button
          onClick={() => {
            Object.keys(apiKeys).forEach((service) => {
              if (apiKeys[service as keyof typeof apiKeys]) {
                handleSave(service);
              }
            });
            onClose();
          }}
        >
          حفظ الكل
        </button>
      </div>
    </div>
  );
};

export default KeyManager;
