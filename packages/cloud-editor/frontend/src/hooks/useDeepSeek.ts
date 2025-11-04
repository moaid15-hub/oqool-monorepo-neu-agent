// packages/cloud-editor/frontend/src/hooks/useDeepSeek.ts
import { useState, useCallback } from 'react';
import { DeepSeekService } from '../services/deepseekService';

export interface DeepSeekState {
  loading: boolean;
  error: string | null;
  result: string | null;
}

export const useDeepSeek = (apiKey?: string) => {
  const [state, setState] = useState<DeepSeekState>({
    loading: false,
    error: null,
    result: null,
  });

  const deepSeekService = apiKey ? new DeepSeekService(apiKey) : null;

  const executeRequest = useCallback(
    async <T>(request: () => Promise<T>, onSuccess?: (result: T) => void) => {
      if (!deepSeekService) {
        setState((prev) => ({
          ...prev,
          error: 'DeepSeek API key is required',
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const result = await request();
        setState((prev) => ({
          ...prev,
          loading: false,
          result: result as string,
          error: null,
        }));

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    [deepSeekService]
  );

  const getCodeCompletion = useCallback(
    (prompt: string, context: string) => {
      return executeRequest(() => deepSeekService!.getCodeCompletion(prompt, context));
    },
    [executeRequest]
  );

  const explainCode = useCallback(
    (code: string) => {
      return executeRequest(() => deepSeekService!.explainCode(code));
    },
    [executeRequest]
  );

  const generateCode = useCallback(
    (description: string, language: string = 'javascript') => {
      return executeRequest(() => deepSeekService!.generateCode(description, language));
    },
    [executeRequest]
  );

  const fixCode = useCallback(
    (code: string, error: string) => {
      return executeRequest(() => deepSeekService!.fixCode(code, error));
    },
    [executeRequest]
  );

  const optimizeCode = useCallback(
    (code: string) => {
      return executeRequest(() => deepSeekService!.optimizeCode(code));
    },
    [executeRequest]
  );

  const clearState = useCallback(() => {
    setState({
      loading: false,
      error: null,
      result: null,
    });
  }, []);

  return {
    ...state,
    getCodeCompletion,
    explainCode,
    generateCode,
    fixCode,
    optimizeCode,
    clearState,
    isConfigured: !!deepSeekService,
  };
};
