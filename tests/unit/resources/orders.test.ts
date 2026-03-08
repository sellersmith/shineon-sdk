import { describe, it, expect, vi, afterEach } from 'vitest';
import { ShineOn } from '../../../src/index.js';
import { mockFetch, testConfig } from '../../helpers/mock-fetch.js';

const baseOrderResponse = {
  order: {
    id: 1,
    source_id: 'test-123',
    store_order_id: 'shop-1',
    status: 'on_hold' as const,
    on_hold_reason: null,
    shipment_notification_url: 'https://example.com/webhook',
    shipping_method: 'standard-us',
    email: null,
    note: null,
    test: false,
    line_items: [],
    shipping_address: {
      name: 'Test User',
      address1: '123 St',
      city: 'NY',
      zip: '10001',
      country_code: 'US',
    },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
};

describe('Orders', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('create() → POST /v1/orders with body', async () => {
    const fetch = mockFetch({ body: baseOrderResponse });
    const client = new ShineOn(testConfig());
    const params = {
      order: {
        source_id: 'test-123',
        shipment_notification_url: 'https://example.com/webhook',
        line_items: [{ store_line_item_id: 'li-1', sku: 'SO-20023', quantity: 1 }],
        shipping_address: { name: 'Test', address1: '123 St', city: 'NY', zip: '10001', country_code: 'US' },
      },
    };
    const result = await client.orders.create(params);
    expect(result).toEqual(baseOrderResponse);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/orders');
    expect(init.method).toBe('POST');
    expect(init.body).toBe(JSON.stringify(params));
  });

  it('createV2() → POST /v2/orders with body', async () => {
    const fetch = mockFetch({ body: baseOrderResponse });
    const client = new ShineOn(testConfig());
    const params = {
      order: {
        source_id: 'test-v2',
        shipment_notification_url: 'https://example.com/webhook',
        line_items: [{ store_line_item_id: 'li-2', sku: 'SO-20023', quantity: 1 }],
        shipping_address: { name: 'Test', address1: '123 St', city: 'NY', zip: '10001', country_code: 'US' },
      },
    };
    const result = await client.orders.createV2(params);
    expect(result).toEqual(baseOrderResponse);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v2/orders');
    expect(init.method).toBe('POST');
  });

  it('list() → GET /v1/orders', async () => {
    const listResponse = { orders: [baseOrderResponse.order] };
    const fetch = mockFetch({ body: listResponse });
    const client = new ShineOn(testConfig());
    const result = await client.orders.list();
    expect(result).toEqual(listResponse);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/orders');
    expect(init.method).toBe('GET');
  });

  it('list() serializes query params', async () => {
    const fetch = mockFetch({ body: { orders: [] } });
    const client = new ShineOn(testConfig());
    await client.orders.list({ status: 'shipped', limit: 100 });
    const url = fetch.mock.calls[0][0] as string;
    expect(url).toContain('/v1/orders');
    expect(url).toContain('status=shipped');
    expect(url).toContain('limit=100');
  });

  it('get(id) → GET /v1/orders/{id}', async () => {
    const fetch = mockFetch({ body: baseOrderResponse });
    const client = new ShineOn(testConfig());
    const result = await client.orders.get(42);
    expect(result).toEqual(baseOrderResponse);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/orders/42');
    expect(init.method).toBe('GET');
  });

  it('update(id, params) → PUT /v1/orders/{id}', async () => {
    const fetch = mockFetch({ body: baseOrderResponse });
    const client = new ShineOn(testConfig());
    const updateParams = { order: { note: 'updated note' } };
    const result = await client.orders.update(42, updateParams);
    expect(result).toEqual(baseOrderResponse);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/orders/42');
    expect(init.method).toBe('PUT');
    expect(init.body).toBe(JSON.stringify(updateParams));
  });

  it('hold(id) → POST /v1/orders/{id}/hold', async () => {
    const fetch = mockFetch({ body: baseOrderResponse });
    const client = new ShineOn(testConfig());
    const result = await client.orders.hold(42);
    expect(result).toEqual(baseOrderResponse);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/orders/42/hold');
    expect(init.method).toBe('POST');
  });

  it('ready(id) → POST /v1/orders/{id}/ready', async () => {
    const fetch = mockFetch({ body: baseOrderResponse });
    const client = new ShineOn(testConfig());
    const result = await client.orders.ready(42);
    expect(result).toEqual(baseOrderResponse);
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/orders/42/ready');
    expect(init.method).toBe('POST');
  });

  it('cancel(id) → POST /v1/orders/{id}/cancel — 202 void', async () => {
    const fetch = mockFetch({ status: 202, body: null });
    const client = new ShineOn(testConfig());
    await expect(client.orders.cancel(42)).resolves.toBeUndefined();
    const [url, init] = fetch.mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/v1/orders/42/cancel');
    expect(init.method).toBe('POST');
  });
});
