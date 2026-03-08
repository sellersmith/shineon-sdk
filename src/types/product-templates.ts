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

/** Product template metafields */
export interface TemplateMetafields {
  atc_upsell?: string;
  engravings?: string;
  metal?: string;
  type?: string;
  shape?: string;
  size_option?: string;
  [key: string]: string | undefined;
}

/** Artwork spec within a transformation */
export interface TransformationArtwork {
  mask_src_url: string;
  height: number;
  width: number;
  upload_min_height: number;
  upload_min_width: number;
  scope: string;
}

/** Zone positioning within a transformation */
export interface TransformationZone {
  width: number;
  height: number;
  offset_x: string;
  offset_y: string;
}

/** Render transformation on a product template */
export interface Transformation {
  id: number;
  developer_notes?: string[];
  make: unknown;
  artwork: TransformationArtwork;
  created_at: string;
  updated_at: string;
  dark_available: boolean;
  default: boolean;
  default_output_format: string;
  default_output_quality: number;
  default_output_width: number;
  default_position: number;
  width: number;
  height: number;
  method: string;
  zone: TransformationZone | null;
  layers: Record<string, string>;
  label: string;
  published_at: string;
  plain_image: boolean;
}

/** Product template response object */
export interface ProductTemplate {
  id: number;
  title: string;
  /** Template code e.g. "PT-10204" */
  product_template: string;
  parent_id: number;
  parent_label?: string;
  siblings: number[];
  /** @deprecated */
  engraving_sibling_id?: number;
  buyer_uploads: boolean;
  base_cost: number;
  artwork_mask_src: string;
  option1_value: string | null;
  option2_value: string | null;
  option3_value: string | null;
  position: number;
  /** @deprecated */
  optimized_height: number;
  /** @deprecated */
  optimized_width: number;
  upload_min_height: string | number;
  upload_min_width: string | number;
  custom_fields: string[];
  metafields: TemplateMetafields;
  render_ids: number[];
  transformations: Transformation[];
  plan_required: string[];
  tags: string[];
  developer_notes?: string[];
  published_at: string;
  /** Present on V2 responses */
  personalizations?: TemplatePersonalization[];
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
