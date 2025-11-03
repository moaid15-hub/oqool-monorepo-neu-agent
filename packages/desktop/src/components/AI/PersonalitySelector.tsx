import React from 'react';
import './PersonalitySelector.css';

export type AIPersonality = 'helpful' | 'professional' | 'creative' | 'concise' | 'detailed';

interface PersonalitySelectorProps {
  selected: AIPersonality;
  onChange: (personality: AIPersonality) => void;
}

const personalities = [
  {
    id: 'helpful' as AIPersonality,
    name: 'مساعد ودود',
    icon: '😊',
    description: 'مساعد لطيف ومتعاون',
  },
  {
    id: 'professional' as AIPersonality,
    name: 'محترف',
    icon: '💼',
    description: 'رسمي ودقيق',
  },
  {
    id: 'creative' as AIPersonality,
    name: 'مبدع',
    icon: '🎨',
    description: 'حلول إبداعية ومبتكرة',
  },
  {
    id: 'concise' as AIPersonality,
    name: 'مختصر',
    icon: '⚡',
    description: 'إجابات قصيرة ومباشرة',
  },
  {
    id: 'detailed' as AIPersonality,
    name: 'مفصّل',
    icon: '📚',
    description: 'شرح شامل ومفصل',
  },
];

export const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="personality-selector">
      <h4 className="selector-title">اختر شخصية المساعد</h4>
      <div className="personality-grid">
        {personalities.map((personality) => (
          <div
            key={personality.id}
            className={`personality-card ${selected === personality.id ? 'selected' : ''}`}
            onClick={() => onChange(personality.id)}
          >
            <div className="personality-icon">{personality.icon}</div>
            <div className="personality-name">{personality.name}</div>
            <div className="personality-description">{personality.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
