import { config } from 'dotenv';
import { ShineOn } from '../../src/index.js';

config(); // load .env if present

export const API_TOKEN = process.env.SHINEON_API_TOKEN;

/** True when a token is available — gates all integration tests */
export const canRun = Boolean(API_TOKEN);

/**
 * Create a live ShineOn client for integration tests.
 * Throws if SHINEON_API_TOKEN is not set — tests should guard with canRun first.
 */
export function createClient(): ShineOn {
  if (!API_TOKEN) throw new Error('SHINEON_API_TOKEN not set');
  return new ShineOn({ token: API_TOKEN });
}
