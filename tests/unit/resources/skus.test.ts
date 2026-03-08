import { describe, it, expect, vi, afterEach } from 'vitest';
import { ShineOn } from '../../../src/index.js';
import { mockFetch, testConfig } from '../../helpers/mock-fetch.js';

const baseSku = {
  id: 'SO-20023',
  title: 'Men\'s Ring',
  available: true,
};

describe('SKUs', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('list() → GET /v1/skus', async () => {
    const listResponse = { skus: [baseSku] };
    const fetch = mockFetch({ body: listResponse });
    const client = new ShineOn(testConfig());
    const result = await client.skus.list();
    expect(result).toEqual(listResponse);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/skus');
    expect(init.method).toBe('GET');
  });

  it('get(skuId) → GET /v1/skus/{skuId}', async () => {
    const skuResponse = { sku: baseSku };
    const fetch = mockFetch({ body: skuResponse });
    const client = new ShineOn(testConfig());
    const result = await client.skus.get('SO-20023');
    expect(result).toEqual(skuResponse);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/skus/SO-20023');
    expect(init.method).toBe('GET');
  });
});
