import { canRun, createClient } from './setup.js';
import type { ShineOn } from '../../src/index.js';

describe.skipIf(!canRun)('ProductTemplates (integration)', () => {
  let client: ShineOn;

  beforeAll(() => {
    client = createClient();
  });

  it('lists templates V1 with pagination meta', async () => {
    const result = await client.productTemplates.list({ per_page: 5 });
    expect(result).toHaveProperty('product_templates');
    expect(result).toHaveProperty('meta');
    expect(result.meta).toHaveProperty('total');
    expect(Array.isArray(result.product_templates)).toBe(true);
  });

  it('lists templates V2', async () => {
    const result = await client.productTemplates.listV2({ per_page: 5 });
    expect(result).toHaveProperty('product_templates');
    expect(Array.isArray(result.product_templates)).toBe(true);
  });

  it('gets a template by ID', async () => {
    const list = await client.productTemplates.list({ per_page: 1 });
    if (list.product_templates.length === 0) return;
    const id = list.product_templates[0].id;
    const result = await client.productTemplates.get(id);
    expect(result).toHaveProperty('id');
    expect(result.id).toBe(id);
  });
});
