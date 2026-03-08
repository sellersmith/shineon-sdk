import type { HttpClient } from '../http-client.js';
import type { SkuListResponse, SkuResponse } from '../types/index.js';

export class SKUs {
  constructor(private readonly http: HttpClient) {}

  /** GET /v1/skus */
  async list(): Promise<SkuListResponse> {
    return this.http.get<SkuListResponse>('/v1/skus');
  }

  /** GET /v1/skus/{skuId} */
  async get(skuId: string): Promise<SkuResponse> {
    return this.http.get<SkuResponse>(`/v1/skus/${skuId}`);
  }
}
