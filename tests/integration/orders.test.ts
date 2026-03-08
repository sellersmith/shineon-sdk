import { canRun, createClient } from './setup.js';
import { ShineOn } from '../../src/index.js';

describe.skipIf(!canRun)('Orders (integration)', () => {
  let client: ShineOn;
  let testOrderId: number | null = null;

  beforeAll(() => {
    client = createClient();
  });

  it('creates a test order (V1, on_hold)', async () => {
    const skus = await client.skus.list();
    if (skus.skus.length === 0) return;
    const sku = skus.skus[0].sku;

    const result = await client.orders.create({
      order: {
        source_id: `integration-test-${Date.now()}`,
        shipment_notification_url: 'https://example.com/webhook',
        test: true,
        ready: 0, // on_hold so we can manipulate state
        line_items: [
          {
            store_line_item_id: `li-${Date.now()}`,
            sku,
            quantity: 1,
          },
        ],
        shipping_address: {
          name: 'Integration Test',
          address1: '123 Test St',
          city: 'New York',
          zip: '10001',
          country_code: 'US',
        },
      },
    });

    expect(result).toHaveProperty('order');
    expect(result.order.status).toBe('on_hold');
    testOrderId = result.order.id;
  });

  it('lists orders', async () => {
    const result = await client.orders.list({ limit: 5 });
    expect(result).toHaveProperty('orders');
    expect(Array.isArray(result.orders)).toBe(true);
  });

  it('gets order by ID', async () => {
    if (!testOrderId) return;
    const result = await client.orders.get(testOrderId);
    expect(result).toHaveProperty('order');
    expect(result.order.id).toBe(testOrderId);
  });

  it('sets order to ready', async () => {
    if (!testOrderId) return;
    const result = await client.orders.ready(testOrderId);
    expect(result).toHaveProperty('order');
    expect(result.order.status).toBe('awaiting_payment');
  });

  it('puts order back on hold', async () => {
    if (!testOrderId) return;
    const result = await client.orders.hold(testOrderId);
    expect(result).toHaveProperty('order');
    expect(result.order.status).toBe('on_hold');
  });

  it('cancels test order', async () => {
    if (!testOrderId) return;
    await expect(client.orders.cancel(testOrderId)).resolves.toBeUndefined();
  });

  it('returns 401 for invalid token', async () => {
    const badClient = new ShineOn({ token: 'invalid-token' });
    await expect(badClient.orders.list()).rejects.toMatchObject({ status: 401 });
  });
});
