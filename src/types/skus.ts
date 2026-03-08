/** Artwork positioning and dimension info for a SKU */
export interface SkuArtwork {
  mask_src_url: string;
  optimized_width: number;
  optimized_height: number;
  upload_min_width: number;
  upload_min_height: number;
}

/**
 * SKU capability properties.
 * Values vary by SKU type: standard | artwork | engraving | ring.
 */
export interface SkuProperties {
  /** Number of buyer-uploadable images */
  buyer_uploads?: number;
  /** Number of engraving lines supported */
  engravings?: number;
  /** Metal type (e.g., 'gold', 'silver') */
  metal?: string;
  /** SKU product type (e.g., 'necklace', 'ring') */
  type?: string;
  /** Shape descriptor */
  shape?: string;
  /** Whether the SKU has a size option */
  size_option?: boolean;
}

/** Render reference attached to a SKU */
export interface SkuRender {
  id: number;
  src: string;
}

/** SKU response object */
export interface Sku {
  sku: string;
  title: string;
  product_id: number;
  base_cost: number;
  /** null for standard SKUs that have no artwork area */
  artwork: SkuArtwork | null;
  properties: SkuProperties;
  renders: SkuRender[];
  created_at: string;
  updated_at: string;
}

/** Response wrapper for a single SKU */
export interface SkuResponse {
  sku: Sku;
}

/** Response wrapper for SKU list */
export interface SkuListResponse {
  skus: Sku[];
}
