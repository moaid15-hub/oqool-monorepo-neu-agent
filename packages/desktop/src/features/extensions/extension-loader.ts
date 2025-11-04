import { ExtensionManifest } from './extension-api';
import fs from 'fs-extra';
import path from 'path';

export async function loadExtension(
  extensionPath: string,
  manifest: ExtensionManifest
): Promise<string> {
  // Read the main entry point
  const mainFile = path.join(extensionPath, manifest.main);

  if (!fs.existsSync(mainFile)) {
    throw new Error(`Extension main file not found: ${mainFile}`);
  }

  // Read extension code
  const code = await fs.readFile(mainFile, 'utf-8');

  // Basic validation
  if (!code.trim()) {
    throw new Error('Extension main file is empty');
  }

  // Check for required activate function
  if (!code.includes('function activate') && !code.includes('activate =')) {
    console.warn(`Extension ${manifest.name} does not export an activate function`);
  }

  return code;
}

export function validateManifest(manifest: any): manifest is ExtensionManifest {
  if (!manifest.name || typeof manifest.name !== 'string') {
    throw new Error('Extension manifest must have a "name" field');
  }

  if (!manifest.version || typeof manifest.version !== 'string') {
    throw new Error('Extension manifest must have a "version" field');
  }

  if (!manifest.main || typeof manifest.main !== 'string') {
    throw new Error('Extension manifest must have a "main" field');
  }

  return true;
}
