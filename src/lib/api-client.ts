// Utility functions for API interactions
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export const handleAPIError = (error: any): string => {
  if (error instanceof APIError) {
    return error.message;
  }
  
  if (error.response?.status === 401) {
    return 'Authentication failed. Please check your API keys.';
  }
  
  if (error.response?.status === 429) {
    return 'Rate limit exceeded. Please try again later.';
  }
  
  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }
  
  if (error.message?.includes('network')) {
    return 'Network error. Please check your internet connection.';
  }
  
  return error.message || 'An unexpected error occurred.';
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i === maxRetries - 1) {
        throw lastError;
      }
      
      // Exponential backoff
      const delay = baseDelay * Math.pow(2, i);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};
