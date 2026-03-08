import { canRun, createClient } from './setup.js';
import type { ShineOn } from '../../src/index.js';

describe.skipIf(!canRun)('Renders (integration)', () => {
  let client: ShineOn;

  beforeAll(() => {
    client = createClient();
  });

  it('gets a render by ID', async () => {
    const skus = await client.skus.list();
    const skuWithRender = skus.skus.find((s) => s.renders.length > 0);
    if (!skuWithRender) return;
    const renderId = skuWithRender.renders[0].id;
    const result = await client.renders.get(renderId);
    expect(result).toHaveProperty('render');
    expect(result.render.id).toBe(renderId);
  });

  it('makes a render with random source', async () => {
    const skus = await client.skus.list();
    const skuWithRender = skus.skus.find((s) => s.renders.length > 0);
    if (!skuWithRender) return;
    const renderId = skuWithRender.renders[0].id;
    const result = await client.renders.make(renderId, { random: 1 });
    expect(result).toHaveProperty('render');
    expect(result.render).toHaveProperty('src');
  });
});
