/**
 * AI Gateway - Unified Multi-Provider System
 * نظام موحد لإدارة جميع مزودي الـ AI
 */

// Services
export { DeepSeekService } from './services/deepseek-service';
export { ClaudeService } from './services/claude-service';
export { OpenAIService } from './services/openai-service';

// Main Adapter
export { 
  UnifiedAIAdapter,
  type AIProvider,
  type AIPersonality,
  type Message,
  type AIResponse,
  type UnifiedAIAdapterConfig,
} from './unified-ai-adapter';

// Default export
export { UnifiedAIAdapter as default } from './unified-ai-adapter';
