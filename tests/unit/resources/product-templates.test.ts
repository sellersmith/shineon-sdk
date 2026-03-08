import { describe, it, expect, vi, afterEach } from 'vitest';
import { ShineOn } from '../../../src/index.js';
import { mockFetch, testConfig } from '../../helpers/mock-fetch.js';

const baseTemplate = {
  id: 10,
  title: 'Classic Ring',
  sku: 'SO-20023',
};

describe('ProductTemplates', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('list() → GET /v1/product_templates', async () => {
    const listResponse = { product_templates: [baseTemplate] };
    const fetch = mockFetch({ body: listResponse });
    const client = new ShineOn(testConfig());
    const result = await client.productTemplates.list();
    expect(result).toEqual(listResponse);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/product_templates');
    expect(init.method).toBe('GET');
  });

  it('list() passes query params', async () => {
    const fetch = mockFetch({ body: { product_templates: [] } });
    const client = new ShineOn(testConfig());
    await client.productTemplates.list({ per_page: 25 });
    const url = fetch.mock.calls[0][0] as string;
    expect(url).toContain('/v1/product_templates');
    expect(url).toContain('per_page=25');
  });

  it('listV2() → GET /v2/product_templates', async () => {
    const listResponse = { product_templates: [baseTemplate] };
    const fetch = mockFetch({ body: listResponse });
    const client = new ShineOn(testConfig());
    const result = await client.productTemplates.listV2();
    expect(result).toEqual(listResponse);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v2/product_templates');
    expect(init.method).toBe('GET');
  });

  it('listV2() passes search param', async () => {
    const fetch = mockFetch({ body: { product_templates: [] } });
    const client = new ShineOn(testConfig());
    await client.productTemplates.listV2({ search: 'ring' });
    const url = fetch.mock.calls[0][0] as string;
    expect(url).toContain('/v2/product_templates');
    expect(url).toContain('search=ring');
  });

  it('get(id) → GET /v1/product_templates/{id}', async () => {
    const templateResponse = { product_template: baseTemplate };
    const fetch = mockFetch({ body: templateResponse });
    const client = new ShineOn(testConfig());
    const result = await client.productTemplates.get(10);
    expect(result).toEqual(templateResponse);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/product_templates/10');
    expect(init.method).toBe('GET');
  });
});
