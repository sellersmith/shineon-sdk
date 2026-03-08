import { describe, it, expect, vi, afterEach } from 'vitest';
import { ShineOn } from '../../src/index.js';
import { mockFetch, testConfig } from '../helpers/mock-fetch.js';

describe('whoami', () => {
  afterEach(() => { vi.restoreAllMocks(); });

  it('whoami() → GET /v1/whoami', async () => {
    const body = { id: 1, name: 'Test Partner' };
    const fetch = mockFetch({ body });
    const client = new ShineOn(testConfig());
    const result = await client.whoami();
    expect(result).toEqual(body);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/whoami');
    expect(init.method).toBe('GET');
  });
});
