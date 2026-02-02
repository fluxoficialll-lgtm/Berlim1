
export type AiModelTask = 'marketing_suggestion' | 'content_moderation' | 'translation' | 'ads_auction' | 'general_chat';
export type AiModelTier = 'flash' | 'pro' | 'ultra';

export interface AiRequestOptions {
  task: AiModelTask;
  tier?: AiModelTier;
  jsonMode?: boolean;
  temperature?: number;
  systemInstruction?: string;
}

export interface AiUsageMetrics {
  promptTokens?: number;
  completionTokens?: number;
  totalTokens?: number;
}

export interface AiResponse<T = string> {
  content: T;
  usage?: AiUsageMetrics;
  provider: string;
  model: string;
}
