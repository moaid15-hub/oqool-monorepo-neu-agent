// packages/cloud-editor/frontend/src/components/AIStatusIndicator.tsx
import React from 'react';

interface AIStatusIndicatorProps {
  isActive: boolean;
  isProcessing: boolean;
  hasApiKey: boolean;
  className?: string;
}

export const AIStatusIndicator: React.FC<AIStatusIndicatorProps> = ({
  isActive,
  isProcessing,
  hasApiKey,
  className,
}) => {
  const getStatusIcon = () => {
    if (isProcessing) return '🔄';
    if (!hasApiKey) return '🔑';
    if (isActive) return '🤖';
    return '💤';
  };

  const getStatusText = () => {
    if (isProcessing) return 'جاري المعالجة...';
    if (!hasApiKey) return 'يحتاج API Key';
    if (isActive) return 'الذكاء الاصطناعي نشط';
    return 'الذكاء الاصطناعي متاح';
  };

  const getStatusColor = () => {
    if (isProcessing) return '#ffc107'; // أصفر
    if (!hasApiKey) return '#dc3545'; // أحمر
    if (isActive) return '#28a745'; // أخضر
    return '#6c757d'; // رمادي
  };

  return (
    <div
      className={`ai-status-indicator ${className || ''}`}
      style={{
        background: `linear-gradient(135deg, ${getStatusColor()}, ${getStatusColor()}aa)`,
        borderColor: getStatusColor(),
      }}
      title={getStatusText()}
    >
      <span className="status-icon">{getStatusIcon()}</span>
      <span className="status-text">{getStatusText()}</span>
      {isProcessing && (
        <div className="processing-spinner">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};
