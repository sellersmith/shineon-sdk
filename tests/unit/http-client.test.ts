import { describe, it, expect, vi, afterEach } from 'vitest';
import { HttpClient } from '../../src/http-client.js';
import { ShineOnError } from '../../src/errors.js';
import { mockFetch, testConfig } from '../helpers/mock-fetch.js';

describe('HttpClient', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends Bearer auth header', async () => {
    const fetch = mockFetch({ body: { ok: true } });
    const client = new HttpClient(testConfig());
    await client.get('/v1/whoami');
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      }),
    );
  });

  it('sends Accept header on every request', async () => {
    const fetch = mockFetch({ body: { ok: true } });
    const client = new HttpClient(testConfig());
    await client.get('/v1/whoami');
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/json',
        }),
      }),
    );
  });

  it('builds query string from params, excludes undefined', async () => {
    const fetch = mockFetch({ body: { orders: [] } });
    const client = new HttpClient(testConfig());
    await client.get('/v1/orders', { status: 'shipped', limit: 10, empty: undefined });
    const url = fetch.mock.calls[0][0] as string;
    expect(url).toContain('status=shipped');
    expect(url).toContain('limit=10');
    expect(url).not.toContain('empty');
  });

  it('uses custom baseUrl', async () => {
    const fetch = mockFetch({ body: {} });
    const client = new HttpClient({ token: 'tok', baseUrl: 'https://staging.shineon.com' });
    await client.get('/v1/orders');
    const url = fetch.mock.calls[0][0] as string;
    expect(url).toContain('https://staging.shineon.com/v1/orders');
  });

  it('sends POST with JSON body and Content-Type header', async () => {
    const fetch = mockFetch({ body: { order: { id: 1 } } });
    const client = new HttpClient(testConfig());
    const body = { order: { source_id: '123' } };
    await client.post('/v1/orders', body);
    const [, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect((init.headers as Record<string, string>)['Content-Type']).toBe('application/json');
    expect(init.body).toBe(JSON.stringify(body));
    expect(init.method).toBe('POST');
  });

  it('sends PUT with JSON body', async () => {
    const fetch = mockFetch({ body: { order: { id: 1 } } });
    const client = new HttpClient(testConfig());
    const body = { order: { note: 'updated' } };
    await client.put('/v1/orders/1', body);
    const [, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe('PUT');
    expect(init.body).toBe(JSON.stringify(body));
  });

  it('throws ShineOnError on 401', async () => {
    mockFetch({ status: 401, body: { error: 'Unauthenticated' } });
    const client = new HttpClient(testConfig());
    await expect(client.get('/v1/orders')).rejects.toThrow(ShineOnError);
    await expect(client.get('/v1/orders')).rejects.toMatchObject({
      status: 401,
      message: 'Unauthenticated',
    });
  });

  it('throws ShineOnError on 404', async () => {
    mockFetch({ status: 404, body: { error: 'Not found' } });
    const client = new HttpClient(testConfig());
    await expect(client.get('/v1/orders/999')).rejects.toMatchObject({
      status: 404,
      message: 'Not found',
    });
  });

  it('throws ShineOnError on 422', async () => {
    mockFetch({ status: 422, body: { error: 'Unprocessable Entity' } });
    const client = new HttpClient(testConfig());
    await expect(client.post('/v1/orders', {})).rejects.toMatchObject({
      status: 422,
      message: 'Unprocessable Entity',
    });
  });

  it('throws ShineOnError on 500 with fallback message', async () => {
    mockFetch({ status: 500, body: { message: 'Internal error' } });
    const client = new HttpClient(testConfig());
    await expect(client.get('/v1/orders')).rejects.toMatchObject({
      status: 500,
      message: 'HTTP 500',
    });
  });

  it('retries on 429 and succeeds on second attempt', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Headers(),
        json: async () => ({}),
        text: async () => '',
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({ data: 'ok' }),
        text: async () => '{"data":"ok"}',
      });
    vi.stubGlobal('fetch', fetch);
    const client = new HttpClient({ ...testConfig(), maxRetries: 3 });
    const promise = client.get('/v1/orders');
    // advance past the backoff delay
    await vi.runAllTimersAsync();
    const result = await promise;
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(result).toEqual({ data: 'ok' });
    vi.useRealTimers();
  });

  it('respects retry-after header on 429', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Headers({ 'retry-after': '2' }),
        json: async () => ({}),
        text: async () => '',
      })
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => ({ ok: true }),
        text: async () => '{"ok":true}',
      });
    vi.stubGlobal('fetch', fetch);
    const client = new HttpClient({ ...testConfig(), maxRetries: 3 });
    const promise = client.get('/v1/orders');
    await vi.runAllTimersAsync();
    await promise;
    expect(fetch).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('throws after maxRetries exhausted on 429', async () => {
    vi.useFakeTimers();
    const fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      headers: new Headers(),
      json: async () => ({}),
      text: async () => '',
    });
    vi.stubGlobal('fetch', fetch);
    const client = new HttpClient({ ...testConfig(), maxRetries: 2 });

    let caughtError: unknown;
    const promise = client.get('/v1/orders').catch((e) => {
      caughtError = e;
    });
    await vi.runAllTimersAsync();
    await promise;

    expect(caughtError).toMatchObject({ status: 429 });
    // 1 initial + 2 retries
    expect(fetch).toHaveBeenCalledTimes(3);
    vi.useRealTimers();
  });

  it('throws ShineOnError with status 408 on timeout', async () => {
    // Simulate AbortError from fetch when signal fires
    const fetch = vi.fn().mockImplementation(() => {
      const err = new DOMException('signal aborted', 'AbortError');
      return Promise.reject(err);
    });
    vi.stubGlobal('fetch', fetch);
    const client = new HttpClient({ ...testConfig(), timeout: 1 });
    await expect(client.get('/v1/orders')).rejects.toMatchObject({
      status: 408,
      message: 'Request timeout',
    });
  });

  it('returns undefined for 202 empty response', async () => {
    mockFetch({ status: 202, body: null });
    const client = new HttpClient(testConfig());
    const result = await client.post('/v1/orders/1/cancel');
    expect(result).toBeUndefined();
  });
});
