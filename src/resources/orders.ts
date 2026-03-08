import type { HttpClient } from '../http-client.js';
import type {
  CreateOrderV1Params,
  CreateOrderV2Params,
  ListOrdersParams,
  OrderListResponse,
  OrderResponse,
  UpdateOrderParams,
} from '../types/index.js';

export class Orders {
  constructor(private readonly http: HttpClient) {}

  /** POST /v1/orders */
  async create(params: CreateOrderV1Params): Promise<OrderResponse> {
    return this.http.post<OrderResponse>('/v1/orders', params);
  }

  /** POST /v2/orders */
  async createV2(params: CreateOrderV2Params): Promise<OrderResponse> {
    return this.http.post<OrderResponse>('/v2/orders', params);
  }

  /** GET /v1/orders */
  async list(params?: ListOrdersParams): Promise<OrderListResponse> {
    return this.http.get<OrderListResponse>('/v1/orders', params as Record<string, unknown>);
  }

  /** GET /v1/orders/{id} */
  async get(id: number | string): Promise<OrderResponse> {
    return this.http.get<OrderResponse>(`/v1/orders/${id}`);
  }

  /** PUT /v1/orders/{id} */
  async update(id: number | string, params: UpdateOrderParams): Promise<OrderResponse> {
    return this.http.put<OrderResponse>(`/v1/orders/${id}`, params);
  }

  /** POST /v1/orders/{id}/hold */
  async hold(id: number | string): Promise<OrderResponse> {
    return this.http.post<OrderResponse>(`/v1/orders/${id}/hold`);
  }

  /** POST /v1/orders/{id}/ready */
  async ready(id: number | string): Promise<OrderResponse> {
    return this.http.post<OrderResponse>(`/v1/orders/${id}/ready`);
  }

  /** POST /v1/orders/{id}/cancel — returns 202 Accepted */
  async cancel(id: number | string): Promise<void> {
    await this.http.post<void>(`/v1/orders/${id}/cancel`);
  }
}
