// electron/ipc/ai.ts
import { ipcMain } from 'electron';
import { UnifiedAIAdapter, type AIRole } from '@oqool/shared/ai-gateway';

// ============================================
// تهيئة Unified AI Adapter
// ============================================

let aiAdapter: UnifiedAIAdapter | null = null;

// تهيئة AI Adapter مع API Keys من environment variables
function initializeAIAdapter(): UnifiedAIAdapter {
  if (aiAdapter) {
    return aiAdapter;
  }

  aiAdapter = new UnifiedAIAdapter({
    claude: process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    deepseek: process.env.DEEPSEEK_API_KEY,
    defaultProvider: 'deepseek', // DeepSeek as default (cheapest)
  });

  return aiAdapter;
}

// ============================================
// تعريف الشخصيات الـ8 - mapped to AIRole
// ============================================

const PERSONALITIES: Record<AIRole, { name: string; emoji: string; description: string }> = {
  architect: {
    name: 'Architect - System Designer',
    emoji: '🏗️',
    description: 'مهندس معماري برمجي - تصميم البنى المعمارية والأنماط',
  },
  coder: {
    name: 'Coder - Code Writer',
    emoji: '💻',
    description: 'مبرمج محترف - كتابة كود نظيف وفعال',
  },
  reviewer: {
    name: 'Reviewer - Code Analyst',
    emoji: '👁️',
    description: 'محلل كود - مراجعة الكود واكتشاف المشاكل',
  },
  tester: {
    name: 'Tester - QA Expert',
    emoji: '🧪',
    description: 'خبير اختبارات - كتابة الاختبارات وضمان الجودة',
  },
  debugger: {
    name: 'Debugger - Problem Solver',
    emoji: '🐛',
    description: 'محلل أخطاء - تتبع المشاكل وحلها',
  },
  optimizer: {
    name: 'Optimizer - Performance Guru',
    emoji: '⚡',
    description: 'محسن أداء - تحسين السرعة والكفاءة',
  },
  security: {
    name: 'Security - Security Expert',
    emoji: '🔐',
    description: 'خبير أمن سيبراني - حماية الكود من الثغرات',
  },
  devops: {
    name: 'DevOps - Infrastructure Pro',
    emoji: '🔧',
    description: 'خبير DevOps - أتمتة ونشر التطبيقات',
  },
};

// ============================================
// Setup Handlers
// ============================================

export function setupAIHandlers() {

  // ============================================
  // 1. إرسال رسالة للـ AI
  // ============================================
  ipcMain.handle('ai:sendMessage', async (_, message: string, personality: string, provider?: string) => {
    try {
      const adapter = initializeAIAdapter();
      const role = personality as AIRole;
      const personalityConfig = PERSONALITIES[role];

      if (!personalityConfig) {
        throw new Error('Personality not found');
      }

      // استخدام Unified AI Adapter مع Smart Provider Selection
      const response = await adapter.processWithPersonality(
        role,
        message,
        undefined, // no context
        (provider as any) || 'auto' // auto-select best provider
      );

      return {
        success: true,
        message: response.response,
        personality: personalityConfig.name,
        emoji: personalityConfig.emoji,
        model: response.model,
        provider: response.provider,
        cost: response.cost,
        tokensUsed: response.tokensUsed,
      };
    } catch (error: any) {
      console.error('AI Error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  });

  // ============================================
  // 2. الحصول على قائمة الشخصيات
  // ============================================
  ipcMain.handle('ai:getPersonalities', async () => {
    return Object.entries(PERSONALITIES).map(([key, value]) => ({
      id: key,
      name: value.name,
      emoji: value.emoji,
      description: value.description,
    }));
  });

  // ============================================
  // 3. الحصول على المزودين المتاحين
  // ============================================
  ipcMain.handle('ai:getProviders', async () => {
    try {
      const adapter = initializeAIAdapter();
      return adapter.getAvailableProviders();
    } catch (error: any) {
      console.error('Error getting providers:', error);
      return [
        { id: 'auto', name: 'Auto-Select', available: false },
        { id: 'deepseek', name: 'DeepSeek', available: false },
        { id: 'claude', name: 'Claude (Anthropic)', available: false },
        { id: 'openai', name: 'OpenAI (GPT-4)', available: false },
      ];
    }
  });

  // ============================================
  // 4. الحصول على معلومات التكلفة
  // ============================================
  ipcMain.handle('ai:getCostComparison', async () => {
    try {
      const adapter = initializeAIAdapter();
      return adapter.getCostComparison();
    } catch (error: any) {
      console.error('Error getting cost comparison:', error);
      return [];
    }
  });

  // ============================================
  // 5. God Mode - استشارة جميع الشخصيات
  // ============================================
  ipcMain.handle('ai:godMode', async (_, message: string, provider?: string) => {
    const adapter = initializeAIAdapter();
    const results: any[] = [];

    // استشارة كل شخصية باستخدام Smart Selection
    for (const [key, personality] of Object.entries(PERSONALITIES)) {
      try {
        const role = key as AIRole;
        const response = await adapter.processWithPersonality(
          role,
          message,
          undefined,
          (provider as any) || 'auto'
        );

        results.push({
          personality: personality.name,
          emoji: personality.emoji,
          response: response.response,
          id: key,
          provider: response.provider,
          model: response.model,
          cost: response.cost,
          tokensUsed: response.tokensUsed,
        });
      } catch (error: any) {
        console.error(`Error with ${key}:`, error);
        results.push({
          personality: personality.name,
          emoji: personality.emoji,
          response: `خطأ: ${error.message}`,
          id: key,
          error: true,
        });
      }
    }

    return {
      success: true,
      results: results,
      totalCost: results.reduce((sum, r) => sum + (r.cost || 0), 0),
    };
  });
}
