import {
  AuthenticationError,
  NotFoundError,
  PermissionError,
  PostaSendError,
  RateLimitError,
  ValidationError,
} from './errors.js';

interface RequestOptions {
  method?: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

export class HttpClient {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;

  constructor(baseUrl: string, apiKey: string, timeout = 30_000) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.timeout = timeout;
  }

  async request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, query } = options;

    const url = new URL(`${this.baseUrl}${path}`);
    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) url.searchParams.set(key, String(value));
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    let response: Response;
    try {
      response = await fetch(url.toString(), {
        method,
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch (err) {
      clearTimeout(timer);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new PostaSendError('Request timed out', 408, 'TIMEOUT');
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }

    if (response.status === 204) return undefined as T;

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message: string = data?.message ?? response.statusText;
      switch (response.status) {
        case 401: throw new AuthenticationError(message);
        case 403: throw new PermissionError(message);
        case 404: throw new NotFoundError(message);
        case 422: throw new ValidationError(message, data?.errors);
        case 429: {
          const retryAfter = response.headers.get('Retry-After');
          throw new RateLimitError(retryAfter ? Number(retryAfter) : undefined);
        }
        default: throw new PostaSendError(message, response.status);
      }
    }

    return (data?.data ?? data) as T;
  }

  get<T>(path: string, query?: RequestOptions['query']): Promise<T> {
    return this.request<T>(path, { query });
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'POST', body });
  }

  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>(path, { method: 'PATCH', body });
  }

  delete<T = void>(path: string): Promise<T> {
    return this.request<T>(path, { method: 'DELETE' });
  }
}
