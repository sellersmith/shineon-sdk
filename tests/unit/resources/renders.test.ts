import { describe, it, expect, vi, afterEach } from 'vitest';
import { ShineOn } from '../../../src/index.js';
import { mockFetch, testConfig } from '../../helpers/mock-fetch.js';

const baseRender = {
  id: 55,
  src: 'https://cdn.shineon.com/renders/55.png',
  width: 800,
  height: 800,
  created_at: '2024-01-01T00:00:00Z',
};

describe('Renders', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('get(id) → GET /v1/renders/{id}', async () => {
    const renderResponse = { render: baseRender };
    const fetch = mockFetch({ body: renderResponse });
    const client = new ShineOn(testConfig());
    const result = await client.renders.get(55);
    expect(result).toEqual(renderResponse);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/renders/55');
    expect(init.method).toBe('GET');
  });

  it('make(id, params) → POST /v1/renders/{id}/make with body', async () => {
    const renderResponse = { render: baseRender };
    const fetch = mockFetch({ body: renderResponse });
    const client = new ShineOn(testConfig());
    const params = { src: 'https://example.com/image.png', output_width: 600, output_format: 'jpg' };
    const result = await client.renders.make(55, params);
    expect(result).toEqual(renderResponse);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/renders/55/make');
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify(params));
  });

  it('make() passes random param', async () => {
    const renderResponse = { render: baseRender };
    const fetch = mockFetch({ body: renderResponse });
    const client = new ShineOn(testConfig());
    const params = { random: 1 };
    await client.renders.make(55, params);
    const [, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(init.body).toBe(JSON.stringify(params));
  });
});
