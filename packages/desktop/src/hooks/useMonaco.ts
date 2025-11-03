import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import { configureMonaco, defaultEditorOptions } from '../../config/monaco.config';

export function useMonaco() {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!containerRef.current) {return;}

    // Configure Monaco on first use
    configureMonaco();

    // Create editor
    const editor = monaco.editor.create(containerRef.current, defaultEditorOptions);
    editorRef.current = editor;

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      editor.layout();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      editor.dispose();
    };
  }, []);

  return { containerRef, editor: editorRef.current };
}
