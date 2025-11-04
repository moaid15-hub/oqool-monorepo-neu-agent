import React from 'react';
import './ActivityBar.css';

type ActivityType = 'explorer' | 'search' | 'git' | 'debug' | 'extensions' | 'ai';

interface ActivityBarProps {
  active: ActivityType;
  onActivityChange: (activity: ActivityType) => void;
}

export const ActivityBar: React.FC<ActivityBarProps> = ({ active, onActivityChange }) => {
  const activities: Array<{ id: ActivityType; icon: string; title: string }> = [
    { id: 'explorer', icon: '📁', title: 'المستكشف' },
    { id: 'search', icon: '🔍', title: 'البحث' },
    { id: 'git', icon: '🔀', title: 'Git' },
    { id: 'extensions', icon: '🧩', title: 'الإضافات' },
    { id: 'ai', icon: '🤖', title: 'AI Assistant' },
  ];

  return (
    <div className="activity-bar">
      <div className="activity-items">
        {activities.map((activity) => (
          <button
            key={activity.id}
            className={`activity-item ${active === activity.id ? 'active' : ''}`}
            onClick={() => onActivityChange(activity.id)}
            title={activity.title}
          >
            <span className="activity-icon">{activity.icon}</span>
          </button>
        ))}
      </div>
      <div className="activity-bottom">
        <button className="activity-item" title="الإعدادات">
          <span className="activity-icon">⚙️</span>
        </button>
      </div>
    </div>
  );
};
