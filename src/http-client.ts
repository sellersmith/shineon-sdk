/// <reference lib="dom" />
import { ShineOnError } from './errors.js';
import type { ShineOnConfig } from './types/common.js';

import type { HttpMethod } from './types/common.js';

const DEFAULT_BASE_URL = 'https://api.shineon.com';
const DEFAULT_TIMEOUT = 30_000;
const DEFAULT_MAX_RETRIES = 3;

export class HttpClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly timeout: number;
  private readonly maxRetries: number;

  constructor(config: ShineOnConfig) {
    this.token = config.token;
    this.baseUrl = (config.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, '');
    this.timeout = config.timeout ?? DEFAULT_TIMEOUT;
    this.maxRetries = config.maxRetries ?? DEFAULT_MAX_RETRIES;
  }

  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const url = this.buildUrl(path, params);
    return this.request<T>('GET', url);
  }

  async post<T>(path: string, body?: unknown): Promise<T> {
    const url = this.buildUrl(path);
    return this.request<T>('POST', url, body);
  }

  async put<T>(path: string, body?: unknown): Promise<T> {
    const url = this.buildUrl(path);
    return this.request<T>('PUT', url, body);
  }

  async delete<T>(path: string): Promise<T> {
    const url = this.buildUrl(path);
    return this.request<T>('DELETE', url);
  }

  private buildUrl(path: string, params?: Record<string, unknown>): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }

  private async request<T>(
    method: HttpMethod,
    url: string,
    body?: unknown,
    attempt = 0,
  ): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${this.token}`,
        Accept: 'application/json',
      };

      const init: RequestInit = {
        method,
        headers,
        signal: controller.signal,
      };

      if (body !== undefined) {
        headers['Content-Type'] = 'application/json';
        init.body = JSON.stringify(body);
      }

      const response = await fetch(url, init);

      // Rate limit retry with exponential backoff
      if (response.status === 429 && attempt < this.maxRetries) {
        const retryAfter = response.headers.get('retry-after');
        const parsed = retryAfter ? Number(retryAfter) : NaN;
        const delay = !Number.isNaN(parsed) && parsed > 0
          ? parsed * 1000
          : Math.min(1000 * 2 ** attempt, 30_000);
        await this.sleep(delay);
        return this.request<T>(method, url, body, attempt + 1);
      }

      if (!response.ok) {
        let errorBody: unknown;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = await response.text().catch(() => null);
        }

        const message =
          errorBody !== null &&
          typeof errorBody === 'object' &&
          'error' in errorBody
            ? (errorBody as { error: string }).error
            : `HTTP ${response.status}`;

        throw new ShineOnError(message, response.status, errorBody);
      }

      // 202 Accepted (e.g., cancel order) may have empty body
      const text = await response.text();
      if (!text) return undefined as unknown as T;
      return JSON.parse(text) as T;
    } catch (error) {
      if (error instanceof ShineOnError) throw error;
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ShineOnError('Request timeout', 408);
      }
      throw new ShineOnError(
        error instanceof Error ? error.message : 'Unknown error',
        0,
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
