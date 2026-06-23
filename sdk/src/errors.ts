export class PostaSendError extends Error {
  readonly statusCode: number;
  readonly code?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.name = 'PostaSendError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class AuthenticationError extends PostaSendError {
  constructor(message = 'Invalid or missing API key') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class PermissionError extends PostaSendError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'PERMISSION_ERROR');
    this.name = 'PermissionError';
  }
}

export class NotFoundError extends PostaSendError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends PostaSendError {
  readonly details?: unknown;

  constructor(message: string, details?: unknown) {
    super(message, 422, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.details = details;
  }
}

export class RateLimitError extends PostaSendError {
  readonly retryAfter?: number;

  constructor(retryAfter?: number) {
    super('Rate limit exceeded', 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
  }
}
