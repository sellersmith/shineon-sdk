import { HttpClient } from './http-client.js';
import { Orders } from './resources/orders.js';
import { SKUs } from './resources/skus.js';
import { ProductTemplates } from './resources/product-templates.js';
import { Renders } from './resources/renders.js';
import type { ShineOnConfig, WhoAmIResponse } from './types/common.js';

export class ShineOn {
  private readonly http: HttpClient;
  public readonly orders: Orders;
  public readonly skus: SKUs;
  public readonly productTemplates: ProductTemplates;
  public readonly renders: Renders;

  constructor(config: ShineOnConfig) {
    this.http = new HttpClient(config);
    this.orders = new Orders(this.http);
    this.skus = new SKUs(this.http);
    this.productTemplates = new ProductTemplates(this.http);
    this.renders = new Renders(this.http);
  }

  /** GET /v1/whoami — verify API connectivity and token */
  async whoami(): Promise<WhoAmIResponse> {
    return this.http.get<WhoAmIResponse>('/v1/whoami');
  }
}

// Re-export everything
export { ShineOnError } from './errors.js';
export { HttpClient } from './http-client.js';
export { Orders } from './resources/orders.js';
export { SKUs } from './resources/skus.js';
export { ProductTemplates } from './resources/product-templates.js';
export { Renders } from './resources/renders.js';
export * from './types/index.js';
