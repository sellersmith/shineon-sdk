import type { OrderPaginationParams } from './common.js';

/** Order status values */
export type OrderStatus =
  | 'on_hold'
  | 'awaiting_payment'
  | 'in_production'
  | 'shipped'
  | 'cancelled';

/**
 * Shipping methods known to the API.
 * Additional methods may be available in your partner account.
 */
export type ShippingMethod = 'standard-us' | 'international' | (string & Record<never, never>);

/** Shipping address for an order */
export interface ShippingAddress {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
  /** ISO 3166-1 alpha-2 country code */
  country_code: string;
  province?: string;
  province_code?: string;
  phone?: string;
  company?: string;
}

/**
 * Line item properties — V1 flat format.
 * Property names accept both slug format (engraving_line_1) and
 * human-readable format (Engraving Line 1).
 */
export interface LineItemProperties {
  print_url?: string;
  'Engraving Line 1'?: string;
  /** slug alias for 'Engraving Line 1' */
  engraving_line_1?: string;
  'Engraving Line 2'?: string;
  /** slug alias for 'Engraving Line 2' */
  engraving_line_2?: string;
  'Engraving Font'?: string;
  /** slug alias for 'Engraving Font' */
  engraving_font?: string;
  'Size (US)'?: number;
  /** slug alias for 'Size (US)' */
  size_us?: number;
  [key: string]: string | number | undefined;
}

/** V2 personalization key/value entry */
export interface Personalization {
  key: string;
  value: string;
}

/** V1 line item for order creation — uses flat properties object */
export interface CreateLineItemV1 {
  store_line_item_id: string;
  /** Required if product_template is not provided */
  sku?: string;
  /** Required if sku is not provided */
  product_template?: string;
  quantity: number;
  properties?: LineItemProperties;
}

/** V2 line item for order creation — uses personalizations array */
export interface CreateLineItemV2 {
  store_line_item_id: string;
  /** Required if product_template is not provided */
  sku?: string;
  /** Required if sku is not provided */
  product_template?: string;
  quantity: number;
  personalizations?: Personalization[];
}

/** V1 order creation request body */
export interface CreateOrderV1Params {
  order: {
    /** Store's unique order identifier */
    source_id: string | number;
    /** URL ShineOn will POST shipment notifications to */
    shipment_notification_url: string;
    shipping_method?: ShippingMethod;
    email?: string;
    note?: string;
    test?: boolean;
    /** 0 = on_hold, 1 = awaiting_payment (default when omitted) */
    ready?: 0 | 1;
    line_items: CreateLineItemV1[];
    shipping_address: ShippingAddress;
  };
}

/** V2 order creation request body — line items use personalizations array */
export interface CreateOrderV2Params {
  order: {
    source_id: string | number;
    shipment_notification_url: string;
    shipping_method?: ShippingMethod;
    email?: string;
    note?: string;
    test?: boolean;
    /** 0 = on_hold, 1 = awaiting_payment (default when omitted) */
    ready?: 0 | 1;
    line_items: CreateLineItemV2[];
    shipping_address: ShippingAddress;
  };
}

/**
 * Update order request body (PUT /v1/orders/{id}).
 * Only allowed when status is on_hold or awaiting_payment.
 * Full payload is required.
 */
export interface UpdateOrderParams {
  order: {
    source_id?: string | number;
    shipment_notification_url?: string;
    shipping_method?: ShippingMethod;
    email?: string;
    note?: string;
    /** 0 = on_hold, 1 = awaiting_payment */
    ready?: 0 | 1;
    line_items?: CreateLineItemV1[];
    shipping_address?: ShippingAddress;
  };
}

/** Query params for GET /v1/orders */
export interface ListOrdersParams extends OrderPaginationParams {
  /** Comma-separated order IDs */
  ids?: string;
  /** Comma-separated source IDs */
  source_ids?: string;
  /** Comma-separated source PO numbers */
  source_po_numbers?: string;
  status?: OrderStatus;
  /** ISO 8601 datetime */
  created_at_min?: string;
  /** ISO 8601 datetime */
  created_at_max?: string;
  /** ISO 8601 datetime */
  updated_at_min?: string;
  /** ISO 8601 datetime */
  updated_at_max?: string;
}

/** Line item in order response */
export interface OrderLineItem {
  id: number;
  store_line_item_id: string;
  sku: string;
  quantity: number;
  properties: LineItemProperties;
  personalizations?: Personalization[];
  tracking_company?: string;
  tracking_number?: string;
}

/** Order response object */
export interface Order {
  id: number;
  source_id: string;
  store_order_id: string;
  status: OrderStatus;
  /** Non-null when order is on hold */
  on_hold_reason: string | null;
  shipment_notification_url: string;
  shipping_method: string;
  email: string | null;
  note: string | null;
  test: boolean;
  line_items: OrderLineItem[];
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
}

/** Response wrapper for a single order */
export interface OrderResponse {
  order: Order;
}

/** Response wrapper for an order list */
export interface OrderListResponse {
  orders: Order[];
}
