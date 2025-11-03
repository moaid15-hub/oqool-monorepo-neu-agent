import vm from 'vm';
import { ExtensionContext, ExtensionAPI } from './extension-api';

export interface Sandbox {
  executeExtension(code: string): any;
  dispose(): void;
}

export function createSandbox(context: ExtensionContext, api: ExtensionAPI): Sandbox {
  // Create a sandboxed environment
  // Context is stored for potential future use in extension APIs
  console.log('Creating sandbox for extension at:', context.extensionPath);

  const sandbox: any = {
    console: {
      log: (...args: any[]) => console.log('[Extension]', ...args),
      warn: (...args: any[]) => console.warn('[Extension]', ...args),
      error: (...args: any[]) => console.error('[Extension]', ...args),
      info: (...args: any[]) => console.info('[Extension]', ...args),
    },
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    Promise,
    JSON,
    Math,
    Date,
    Array,
    Object,
    String,
    Number,
    Boolean,
    RegExp,
    Map,
    Set,
    WeakMap,
    WeakSet,
    // Extension APIs
    oqool: api,
    // Don't expose process, require, or other Node.js globals
  };

  // Create VM context
  const vmContext = vm.createContext(sandbox);

  return {
    executeExtension(code: string): any {
      try {
        // Wrap code to prevent direct access to global scope
        const wrappedCode = `
          (function() {
            'use strict';
            ${code}
            // Return activate function if exported
            return typeof activate === 'function' ? activate : undefined;
          })()
        `;

        const result = vm.runInContext(wrappedCode, vmContext, {
          timeout: 5000, // 5 second timeout
          displayErrors: true,
        });

        return result;
      } catch (error) {
        console.error('Error executing extension code:', error);
        throw error;
      }
    },

    dispose(): void {
      // Cleanup sandbox
      Object.keys(sandbox).forEach((key) => {
        delete sandbox[key];
      });
    },
  };
}
