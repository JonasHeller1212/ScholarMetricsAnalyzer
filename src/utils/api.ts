import type { Author } from '../types/scholar';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): Error {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    // Network errors
    if (error.name === 'AbortError') {
      return new ApiError('Request timed out. Please try again.', 'TIMEOUT');
    }
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return new ApiError('Network error. Please check your connection.', 'NETWORK_ERROR');
    }

    // Rate limiting
    if (error.message.toLowerCase().includes('rate limit')) {
      return new ApiError('Too many requests. Please wait a few minutes and try again.', 'RATE_LIMIT');
    }
    if (error.message.toLowerCase().includes('captcha')) {
      return new ApiError('Access temporarily restricted. Please try again in a few minutes.', 'CAPTCHA_REQUIRED');
    }

    // Profile errors
    if (error.message.toLowerCase().includes('profile not found')) {
      return new ApiError('Google Scholar profile not found. Please check the URL.', 'PROFILE_NOT_FOUND');
    }
    if (error.message.toLowerCase().includes('invalid url')) {
      return new ApiError('Invalid Google Scholar URL. Please enter a valid profile URL.', 'INVALID_URL');
    }

    // Proxy errors
    if (error.message.includes('proxy')) {
      return new ApiError('Unable to access Google Scholar. Please try again later.', 'PROXY_ERROR');
    }

    // Parse errors
    if (error.message.includes('parse')) {
      return new ApiError('Error processing profile data. Please try again.', 'PARSE_ERROR');
    }

    return error;
  }

  return new Error('An unexpected error occurred. Please try again.');
}

export async function fetchWithValidation<T>(url: string): Promise<T> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        'HTTP_ERROR',
        response.status
      );
    }
    const data = await response.json();
    return data as T;
  } catch (error) {
    throw handleApiError(error);
  }
}

export async function validateResponse<T>(response: Response): Promise<T> {
  try {
    if (!response.ok) {
      throw new ApiError(
        `HTTP error! status: ${response.status}`,
        'HTTP_ERROR',
        response.status
      );
    }
    const data = await response.json();
    return data as T;
  } catch (error) {
    throw handleApiError(error);
  }
}