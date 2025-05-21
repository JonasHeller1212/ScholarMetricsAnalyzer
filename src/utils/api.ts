/**
 * Custom API error class for handling application-specific errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public code: string
  ) {
    super(message);
    this.name = 'ApiError';
    
    // Ensures proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}