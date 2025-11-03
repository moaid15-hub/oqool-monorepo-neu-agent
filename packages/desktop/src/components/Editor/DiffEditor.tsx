import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import './DiffEditor.css';

interface DiffEditorProps {
  original: string;
  modified: string;
  language?: string;
}

export const DiffEditor: React.FC<DiffEditorProps> = ({
  original,
  modified,
  language = 'typescript',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) {return;}

    const diffEditor = monaco.editor.createDiffEditor(containerRef.current, {
      theme: 'oqool-dark',
      automaticLayout: true,
      renderSideBySide: true,
      readOnly: true,
    });

    const originalModel = monaco.editor.createModel(original, language);
    const modifiedModel = monaco.editor.createModel(modified, language);

    diffEditor.setModel({
      original: originalModel,
      modified: modifiedModel,
    });

    editorRef.current = diffEditor;

    return () => {
      originalModel.dispose();
      modifiedModel.dispose();
      diffEditor.dispose();
    };
  }, [original, modified, language]);

  return <div ref={containerRef} className="diff-editor" />;
};
