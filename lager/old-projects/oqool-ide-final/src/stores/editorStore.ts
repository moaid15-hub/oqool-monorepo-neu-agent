import { create } from 'zustand';

interface File {
  path: string;
  name: string;
  content: string;
  language: string;
}

interface EditorStore {
  files: File[];
  activeFile: File | null;
  openFile: (file: File) => void;
  updateContent: (path: string, content: string) => void;
  closeFile: (path: string) => void;
}

const welcomeFile = {
  path: '/src/welcome.tsx',
  name: 'welcome.tsx',
  content: `// 🚀 Welcome to Oqool IDE - Professional Code Editor!

// This is a REAL Monaco Editor (same as VS Code)
import React from 'react';

interface WelcomeProps {
  name: string;
}

const Welcome: React.FC<WelcomeProps> = ({ name }) => {
  const greet = () => {
    console.log(\`Hello, \${name}! 🎉\`);
    return \`Welcome to Oqool IDE!\`;
  };

  return (
    <div className="welcome">
      <h1>{greet()}</h1>
      <p>Start coding now with full TypeScript support!</p>
    </div>
  );
};

export default Welcome;

/* 🎨 Features Available:
 * ✅ Full TypeScript & JavaScript support
 * ✅ IntelliSense & Auto-completion
 * ✅ Syntax Highlighting
 * ✅ Multiple tabs
 * ✅ Real-time error checking
 * ✅ Code folding
 * ✅ Minimap
 * ✅ Find & Replace
 * ✅ Activity Bar with icons
 * ✅ AI Assistant Panel
 * ✅ Terminal Integration
 *
 * Try typing to see IntelliSense in action!
 */`,
  language: 'typescript',
};

export const useEditorStore = create<EditorStore>((set) => ({
  files: [welcomeFile],
  activeFile: welcomeFile,
  openFile: (file) => set((state) => ({
    files: state.files.find(f => f.path === file.path)
      ? state.files
      : [...state.files, file],
    activeFile: file,
  })),
  updateContent: (path, content) => set((state) => ({
    files: state.files.map(f =>
      f.path === path ? { ...f, content } : f
    ),
    activeFile: state.activeFile?.path === path
      ? { ...state.activeFile, content }
      : state.activeFile,
  })),
  closeFile: (path) => set((state) => ({
    files: state.files.filter(f => f.path !== path),
    activeFile: state.activeFile?.path === path ? null : state.activeFile,
  })),
}));
