import type { HttpClient } from '../http-client.js';
import type { MakeRenderParams, RenderResponse } from '../types/index.js';

export class Renders {
  constructor(private readonly http: HttpClient) {}

  /** GET /v1/renders/{id} */
  async get(id: number | string): Promise<RenderResponse> {
    return this.http.get<RenderResponse>(`/v1/renders/${id}`);
  }

  /** POST /v1/renders/{id}/make */
  async make(id: number | string, params: MakeRenderParams): Promise<RenderResponse> {
    return this.http.post<RenderResponse>(`/v1/renders/${id}/make`, params);
  }
}
