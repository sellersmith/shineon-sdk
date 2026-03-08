import { describe, it, expect, beforeAll } from 'vitest';
import { canRun, createClient } from './setup.js';
import type { ShineOn } from '../../src/index.js';

describe.skipIf(!canRun)('WhoAmI (integration)', () => {
  let client: ShineOn;
  beforeAll(() => { client = createClient(); });

  it('returns partner info', async () => {
    const result = await client.whoami();
    expect(result).toBeDefined();
    expect(typeof result).toBe('object');
  });
});
