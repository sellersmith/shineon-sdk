import { HttpClient } from './http-client.js';
import { Orders } from './resources/orders.js';
import { SKUs } from './resources/skus.js';
import { ProductTemplates } from './resources/product-templates.js';
import { Renders } from './resources/renders.js';
import type { ShineOnConfig } from './types/common.js';

export class ShineOn {
  public readonly orders: Orders;
  public readonly skus: SKUs;
  public readonly productTemplates: ProductTemplates;
  public readonly renders: Renders;

  constructor(config: ShineOnConfig) {
    const http = new HttpClient(config);
    this.orders = new Orders(http);
    this.skus = new SKUs(http);
    this.productTemplates = new ProductTemplates(http);
    this.renders = new Renders(http);
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
