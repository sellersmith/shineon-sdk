import type { PaginationMeta, PaginationLinks } from './common.js';

/**
 * V2 personalization definition on a product template.
 * Describes what customization values the template accepts.
 */
export interface TemplatePersonalization {
  key: string;
  name: string;
  type: 'image_url' | 'text' | 'svg_url' | 'choice';
  required: boolean;
  description: string;
  sample_image_src: string;
  validations: Record<string, unknown>;
}

/** Product template response object */
export interface ProductTemplate {
  id: number;
  title: string;
  sku: string;
  /** Present on V2 responses */
  personalizations?: TemplatePersonalization[];
  created_at: string;
  updated_at: string;
}

/** Query params for GET /v1/product_templates */
export interface ListProductTemplatesV1Params {
  page?: number;
  per_page?: number;
}

/** Query params for GET /v2/product_templates — adds search filter */
export interface ListProductTemplatesV2Params {
  page?: number;
  per_page?: number;
  search?: string;
}

/** Single product template response (returned directly, no wrapper) */
export type ProductTemplateResponse = ProductTemplate;

/** Paginated list response for product templates */
export interface ProductTemplateListResponse {
  product_templates: ProductTemplate[];
  meta: PaginationMeta;
  links: PaginationLinks;
}
