import { canRun, createClient } from './setup.js';
import type { ShineOn } from '../../src/index.js';

describe.skipIf(!canRun)('SKUs (integration)', () => {
  let client: ShineOn;

  beforeAll(() => {
    client = createClient();
  });

  it('lists SKUs', async () => {
    const result = await client.skus.list();
    expect(result).toHaveProperty('skus');
    expect(Array.isArray(result.skus)).toBe(true);
    if (result.skus.length > 0) {
      const sku = result.skus[0];
      expect(sku).toHaveProperty('sku');
      expect(sku).toHaveProperty('title');
      expect(sku).toHaveProperty('base_cost');
    }
  });

  it('gets a SKU by ID', async () => {
    const list = await client.skus.list();
    if (list.skus.length === 0) return;
    const skuId = list.skus[0].sku;
    const result = await client.skus.get(skuId);
    expect(result).toHaveProperty('sku');
    expect(result.sku.sku).toBe(skuId);
  });
});
