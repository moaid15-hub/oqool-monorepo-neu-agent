// مثال على كيفية استخدام SplitLayout في App.tsx (اختياري)
import React from 'react';
import FileTree from './components/FileTree';
import Editor from './components/Editor';
import Terminal from './components/Terminal';
import SplitLayout from './components/SplitLayout';
import './styles.css';

function App() {
  return (
    <div className="app" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <SplitLayout direction="vertical">
        <SplitLayout direction="horizontal">
          <FileTree />
          <Editor />
        </SplitLayout>
        <Terminal />
      </SplitLayout>
    </div>
  );
}

export default App;
