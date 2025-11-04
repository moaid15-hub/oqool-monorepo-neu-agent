import React from 'react';
import SplitLayout from './components/SplitLayout';
import { NotificationContainer } from './components/Notification';
import { useGlobalNotifications } from './hooks/useNotifications';
import './index.css';

function App() {
  const { notifications, removeNotification } = useGlobalNotifications();

  return (
    <div className="app">
      <SplitLayout />

      {/* نظام الإشعارات العام */}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
        position="top-right"
        maxNotifications={5}
      />
    </div>
  );
}

export default App;
