import { vi } from 'vitest';

interface MockResponseOptions {
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
}

/** Create a mock fetch that returns configured responses */
export function mockFetch(options: MockResponseOptions = {}) {
  const { status = 200, body = {}, headers = {} } = options;
  const fn = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(headers),
    json: async () => body,
    text: async () => (body !== null && body !== undefined ? JSON.stringify(body) : ''),
  });
  vi.stubGlobal('fetch', fn);
  return fn;
}

/** Create a ShineOn client config for testing */
export function testConfig() {
  return { token: 'test-token', baseUrl: 'https://api.shineon.com' };
}
