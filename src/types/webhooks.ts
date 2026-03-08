/** Line item entry in a shipment notification webhook payload */
export interface ShipmentLineItem {
  id: number;
  store_line_item_id: string;
  sku: string;
  quantity: number;
  tracking_company: string;
  tracking_number: string;
}

/**
 * Shipment notification webhook payload.
 * ShineOn POSTs this to the order's shipment_notification_url
 * whenever fulfillment status changes.
 */
export interface ShipmentNotification {
  order: {
    id: number;
    source_id: string;
    store_order_id: string;
    line_items: ShipmentLineItem[];
  };
}
