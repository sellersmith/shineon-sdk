/** Render metadata object */
export interface Render {
  id: number;
  /** CDN URL of the rendered image */
  src: string;
  width: number;
  height: number;
  created_at: string;
}

/** Response wrapper for GET /v1/renders/{id} */
export interface RenderResponse {
  render: Render;
}

/** Request body for POST /v1/renders/{id}/make */
export interface MakeRenderParams {
  /** Source image URL (mutually exclusive with attachment/random) */
  src?: string;
  /** Base64-encoded source image (mutually exclusive with src/random) */
  attachment?: string;
  /** Set to 1 to use a random sample image (mutually exclusive with src/attachment) */
  random?: number;
  /** Output width in pixels */
  output_width?: number;
  /** Output image format (e.g., 'png', 'jpg') */
  output_format?: string;
  /** Output quality 1-100 (for lossy formats) */
  output_quality?: number;
}

/** Response wrapper for POST /v1/renders/{id}/make */
export interface MakeRenderResponse {
  render: Render;
}
