import type { HttpClient } from '../http-client.js';
import type {
  ListProductTemplatesV1Params,
  ListProductTemplatesV2Params,
  ProductTemplateListResponse,
  ProductTemplateResponse,
} from '../types/index.js';

export class ProductTemplates {
  constructor(private readonly http: HttpClient) {}

  /** GET /v1/product_templates */
  async list(params?: ListProductTemplatesV1Params): Promise<ProductTemplateListResponse> {
    return this.http.get<ProductTemplateListResponse>(
      '/v1/product_templates',
      params as Record<string, unknown>,
    );
  }

  /** GET /v2/product_templates */
  async listV2(params?: ListProductTemplatesV2Params): Promise<ProductTemplateListResponse> {
    return this.http.get<ProductTemplateListResponse>(
      '/v2/product_templates',
      params as Record<string, unknown>,
    );
  }

  /** GET /v1/product_templates/{id} */
  async get(id: number | string): Promise<ProductTemplateResponse> {
    return this.http.get<ProductTemplateResponse>(`/v1/product_templates/${id}`);
  }
}
