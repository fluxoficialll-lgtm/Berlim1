
export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
}

export interface ConnectionResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  statusCode?: number;
}

export type ConnectionProvider = 'gemini' | 'stripe' | 'paypal' | 'syncpay';
