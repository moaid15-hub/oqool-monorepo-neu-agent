import { useEffect, useState } from 'react';
import { fileService } from '../services/file-service';
import { useFileStore } from '../stores/file-store';
import { FileNode } from '../types';

export function useFileTree(workspacePath: string | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setFileTree, setRootPath } = useFileStore();

  useEffect(() => {
    if (!workspacePath) {return;}

    async function loadFileTree() {
      setLoading(true);
      setError(null);

      try {
        const tree = await buildFileTree(workspacePath!);
        setFileTree(tree);
        setRootPath(workspacePath!);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadFileTree();
  }, [workspacePath, setFileTree, setRootPath]);

  return { loading, error };
}

async function buildFileTree(path: string): Promise<FileNode[]> {
  const files = await fileService.readdir(path);

  const nodes: FileNode[] = [];

  for (const file of files) {
    const node: FileNode = {
      name: file.name,
      path: file.path,
      type: file.type,
      expanded: false,
    };

    if (file.type === 'directory') {
      node.children = [];
    }

    nodes.push(node);
  }

  return nodes.sort((a, b) => {
    if (a.type === b.type) {return a.name.localeCompare(b.name);}
    return a.type === 'directory' ? -1 : 1;
  });
}
