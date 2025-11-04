// src/hooks/useAI.ts
import { useCallback, useState } from 'react';
import { AIPersonality } from '../types/electron';

export const useAI = () => {
  const [personalities, setPersonalities] = useState<AIPersonality[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(
    async (
      message: string,
      personality: string = 'architect',
      model: string = 'claude-3-5-sonnet-20241022'
    ) => {
      setLoading(true);
      try {
        const result = await window.electron.ai.sendMessage(message, personality, model);
        return result;
      } catch (error) {
        console.error('Error sending AI message:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getPersonalities = useCallback(async () => {
    try {
      const result = await window.electron.ai.getPersonalities();
      setPersonalities(result);
      return result;
    } catch (error) {
      console.error('Error getting AI personalities:', error);
      throw error;
    }
  }, []);

  const getModels = useCallback(async () => {
    try {
      const result = await window.electron.ai.getModels();
      setModels(result);
      return result;
    } catch (error) {
      console.error('Error getting AI models:', error);
      throw error;
    }
  }, []);

  const godMode = useCallback(
    async (message: string, model: string = 'claude-3-5-sonnet-20241022') => {
      setLoading(true);
      try {
        const result = await window.electron.ai.godMode(message, model);
        return result;
      } catch (error) {
        console.error('Error in AI God Mode:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const chatWithPersonality = useCallback(
    async (
      message: string,
      personalityId: string,
      model: string = 'claude-3-5-sonnet-20241022'
    ) => {
      return await sendMessage(message, personalityId, model);
    },
    [sendMessage]
  );

  const getArchitectAdvice = useCallback(
    async (message: string) => {
      return await sendMessage(message, 'architect');
    },
    [sendMessage]
  );

  const getCodeReview = useCallback(
    async (code: string) => {
      return await sendMessage(`يرجى مراجعة هذا الكود:\n\n${code}`, 'reviewer');
    },
    [sendMessage]
  );

  const getCodeOptimization = useCallback(
    async (code: string) => {
      return await sendMessage(`يرجى تحسين هذا الكود:\n\n${code}`, 'optimizer');
    },
    [sendMessage]
  );

  const debugCode = useCallback(
    async (code: string, error?: string) => {
      const debugMessage = error
        ? `يرجى إصلاح هذا الخطأ في الكود:\n\nالكود:\n${code}\n\nالخطأ:\n${error}`
        : `يرجى تصحيح أخطاء هذا الكود:\n\n${code}`;
      return await sendMessage(debugMessage, 'debugger');
    },
    [sendMessage]
  );

  return {
    // Core functions
    sendMessage,
    getPersonalities,
    getModels,
    godMode,

    // Convenience functions
    chatWithPersonality,
    getArchitectAdvice,
    getCodeReview,
    getCodeOptimization,
    debugCode,

    // State
    personalities,
    models,
    loading,
  };
};
