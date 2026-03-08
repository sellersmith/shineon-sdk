# @sellersmith/shineon-sdk

[![npm version](https://img.shields.io/npm/v/@sellersmith/shineon-sdk)](https://www.npmjs.com/package/@sellersmith/shineon-sdk)
[![CI](https://github.com/sellersmith/shineon-sdk/actions/workflows/ci.yml/badge.svg)](https://github.com/sellersmith/shineon-sdk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

TypeScript SDK for the [ShineOn](https://shineon.com) fulfillment API. Zero runtime dependencies, CJS/ESM dual build, Node 18+.

## Install

```bash
npm install @sellersmith/shineon-sdk
```

## Quick Start

```typescript
import { ShineOn } from '@sellersmith/shineon-sdk';

const client = new ShineOn({ token: process.env.SHINEON_API_TOKEN! });

// Create an order (V1)
const { order } = await client.orders.create({
  order: {
    source_id: 'store-order-1001',
    shipment_notification_url: 'https://yourstore.com/webhooks/shineon',
    shipping_method: 'standard-us',
    shipping_address: {
      name: 'Jane Smith',
      address1: '123 Main St',
      city: 'Austin',
      zip: '78701',
      country_code: 'US',
    },
    line_items: [
      {
        store_line_item_id: 'item-1',
        sku: 'SNO-NECKLACE-GOLD',
        quantity: 1,
        properties: { 'Engraving Line 1': 'Always & Forever' },
      },
    ],
  },
});

console.log(order.id, order.status); // 98765 'awaiting_payment'
```

## Configuration

```typescript
const client = new ShineOn({
  token: 'your-api-token',     // required
  baseUrl: 'https://api.shineon.com', // optional, default shown
  timeout: 30_000,             // optional, ms (default 30 000)
  maxRetries: 3,               // optional, 429 retry attempts (default 3)
});
```

| Option | Type | Default | Description |
|---|---|---|---|
| `token` | `string` | — | API access token (required) |
| `baseUrl` | `string` | `https://api.shineon.com` | Base URL override |
| `timeout` | `number` | `30000` | Request timeout in milliseconds |
| `maxRetries` | `number` | `3` | Max retry attempts for rate-limited (429) requests |

## API Reference

### Orders

```typescript
client.orders.create(params)        // POST /v1/orders
client.orders.createV2(params)      // POST /v2/orders
client.orders.list(params?)         // GET  /v1/orders
client.orders.get(id)               // GET  /v1/orders/{id}
client.orders.update(id, params)    // PUT  /v1/orders/{id}
client.orders.hold(id)              // POST /v1/orders/{id}/hold
client.orders.ready(id)             // POST /v1/orders/{id}/ready
client.orders.cancel(id)            // POST /v1/orders/{id}/cancel
```

| Method | Params | Returns |
|---|---|---|
| `create(params)` | `CreateOrderV1Params` | `Promise<OrderResponse>` |
| `createV2(params)` | `CreateOrderV2Params` | `Promise<OrderResponse>` |
| `list(params?)` | `ListOrdersParams` (optional) | `Promise<OrderListResponse>` |
| `get(id)` | `number \| string` | `Promise<OrderResponse>` |
| `update(id, params)` | `number \| string`, `UpdateOrderParams` | `Promise<OrderResponse>` |
| `hold(id)` | `number \| string` | `Promise<OrderResponse>` |
| `ready(id)` | `number \| string` | `Promise<OrderResponse>` |
| `cancel(id)` | `number \| string` | `Promise<void>` (202 Accepted) |

**`ListOrdersParams`** — all fields optional:

| Field | Type | Description |
|---|---|---|
| `ids` | `string` | Comma-separated order IDs |
| `source_ids` | `string` | Comma-separated source IDs |
| `source_po_numbers` | `string` | Comma-separated source PO numbers |
| `status` | `OrderStatus` | Filter by status |
| `created_at_min` | `string` | ISO 8601 datetime |
| `created_at_max` | `string` | ISO 8601 datetime |
| `updated_at_min` | `string` | ISO 8601 datetime |
| `updated_at_max` | `string` | ISO 8601 datetime |
| `page` | `number` | Page number |
| `limit` | `number` | Max 250, default 50 |

### SKUs

```typescript
client.skus.list()        // GET /v1/skus
client.skus.get(skuId)    // GET /v1/skus/{skuId}
```

| Method | Params | Returns |
|---|---|---|
| `list()` | — | `Promise<SkuListResponse>` |
| `get(skuId)` | `string` | `Promise<SkuResponse>` |

**SKU properties by type:**

| SKU type | `buyer_uploads` | `engravings` | `size_option` | Notes |
|---|---|---|---|---|
| artwork | `>0` | — | — | Requires `print_url` in order properties |
| engraving | — | `1` or `2` | — | Requires engraving line properties |
| ring | — | optional | `true` | Requires `Size (US)` property |
| standard | — | — | — | No customization required |

### Product Templates

```typescript
client.productTemplates.list(params?)    // GET /v1/product_templates
client.productTemplates.listV2(params?)  // GET /v2/product_templates
client.productTemplates.get(id)          // GET /v1/product_templates/{id}
```

| Method | Params | Returns |
|---|---|---|
| `list(params?)` | `ListProductTemplatesV1Params` (optional) | `Promise<ProductTemplateListResponse>` |
| `listV2(params?)` | `ListProductTemplatesV2Params` (optional) | `Promise<ProductTemplateListResponse>` |
| `get(id)` | `number \| string` | `Promise<ProductTemplateResponse>` |

`ListProductTemplatesV1Params`: `page?`, `per_page?` (default 15)

`ListProductTemplatesV2Params`: `page?`, `per_page?`, `search?` (adds full-text search)

Both list methods return `ProductTemplateListResponse` — a paginated response with `data`, `links`, and `meta` fields.

### Renders

```typescript
client.renders.get(id)            // GET  /v1/renders/{id}
client.renders.make(id, params)   // POST /v1/renders/{id}/make
```

| Method | Params | Returns |
|---|---|---|
| `get(id)` | `number \| string` | `Promise<RenderResponse>` |
| `make(id, params)` | `number \| string`, `MakeRenderParams` | `Promise<RenderResponse>` |

**`MakeRenderParams`** — provide exactly one image source:

| Field | Type | Description |
|---|---|---|
| `src` | `string` | Source image URL (mutually exclusive with `attachment`/`random`) |
| `attachment` | `string` | Base64-encoded source image (mutually exclusive with `src`/`random`) |
| `random` | `number` | Set to `1` to use a random sample image |
| `output_width` | `number` | Output width in pixels |
| `output_format` | `string` | Output format: `'png'`, `'jpg'` |
| `output_quality` | `number` | Quality 1–100 (for lossy formats) |

## V1 vs V2

The key difference is how personalizations are represented on order line items.

**V1** uses a flat `properties` object with named keys:

```typescript
line_items: [{
  store_line_item_id: 'item-1',
  sku: 'SNO-NECKLACE-GOLD',
  quantity: 1,
  properties: {
    'Engraving Line 1': 'Always & Forever',
    engraving_font: 'Script',   // slug alias also accepted
  },
}]
```

**V2** uses a `personalizations` array of key/value pairs:

```typescript
line_items: [{
  store_line_item_id: 'item-1',
  sku: 'SNO-NECKLACE-GOLD',
  quantity: 1,
  personalizations: [
    { key: 'engraving_line_1', value: 'Always & Forever' },
    { key: 'engraving_font',   value: 'Script' },
  ],
}]
```

V2 product templates (`listV2`) include a `personalizations` array that describes each accepted key, its type (`text`, `image_url`, `svg_url`, `choice`), and validations — use this to discover valid keys before creating an order.

## Order Status Flow

```
on_hold  ──ready()──>  awaiting_payment  ──(auto)──>  in_production  ──(auto)──>  shipped
   ^                          |
   └───────hold()─────────────┘

Any non-shipped status  ──cancel()──>  cancelled
```

| Status | Description |
|---|---|
| `on_hold` | Order created with `ready: 0` or put on hold manually |
| `awaiting_payment` | Order accepted and waiting for production slot |
| `in_production` | Order is being manufactured |
| `shipped` | Order has shipped; tracking info available on line items |
| `cancelled` | Order cancelled; `cancel()` returns 202 Accepted |

`update()` is only permitted when status is `on_hold` or `awaiting_payment`.

## Shipping Methods

| Value | Description |
|---|---|
| `standard-us` | Standard US domestic shipping |
| `international` | International shipping |
| *(custom)* | Additional methods available in your partner account |

The type is `'standard-us' \| 'international' \| string` — any string accepted by your ShineOn partner account is valid.

## Error Handling

All API errors throw a `ShineOnError`:

```typescript
import { ShineOn, ShineOnError } from '@sellersmith/shineon-sdk';

try {
  const { order } = await client.orders.get(99999);
} catch (err) {
  if (err instanceof ShineOnError) {
    console.error(err.message);      // e.g. "Order not found"
    console.error(err.status);       // HTTP status: 404
    console.error(err.responseBody); // raw parsed response body
  }
}
```

| `status` | Cause |
|---|---|
| `400` | Validation error — check `responseBody.error` for details |
| `401` | Invalid or missing API token |
| `404` | Resource not found |
| `422` | Unprocessable entity |
| `429` | Rate limit hit — SDK auto-retries up to `maxRetries` times |
| `408` | Request timed out (client-side) |
| `0` | Network error or unknown failure |

## Rate Limiting

When the API returns `429 Too Many Requests`, the SDK automatically retries with exponential backoff:

- Delay uses the `Retry-After` response header if present
- Otherwise: `min(1000 * 2^attempt, 30_000)` ms
- Retries up to `maxRetries` times (default 3)
- After exhausting retries, throws `ShineOnError` with `status: 429`

## Webhook Integration

Set `shipment_notification_url` on each order. ShineOn will POST a `ShipmentNotification` payload to that URL whenever fulfillment status changes.

```typescript
import type { ShipmentNotification } from '@sellersmith/shineon-sdk';

// Express route handler
app.post('/webhooks/shineon', (req, res) => {
  const payload = req.body as ShipmentNotification;

  for (const item of payload.order.line_items) {
    console.log(
      `Item ${item.store_line_item_id} shipped via ${item.tracking_company}: ${item.tracking_number}`
    );
  }

  res.sendStatus(200);
});
```

**`ShipmentNotification` shape:**

```typescript
{
  order: {
    id: number;
    source_id: string;
    store_order_id: string;
    line_items: Array<{
      id: number;
      store_line_item_id: string;
      sku: string;
      quantity: number;
      tracking_company: string;
      tracking_number: string;
    }>;
  };
}
```

## TypeScript Support

All types are exported from the package root:

```typescript
import type {
  ShineOnConfig,
  CreateOrderV1Params,
  CreateOrderV2Params,
  UpdateOrderParams,
  ListOrdersParams,
  OrderResponse,
  OrderListResponse,
  Order,
  OrderStatus,
  ShippingMethod,
  ShippingAddress,
  LineItemProperties,
  Personalization,
  SkuResponse,
  SkuListResponse,
  Sku,
  ProductTemplateResponse,
  ProductTemplateListResponse,
  ProductTemplate,
  TemplatePersonalization,
  RenderResponse,
  MakeRenderParams,
  Render,
  ShipmentNotification,
} from '@sellersmith/shineon-sdk';
```

## License

MIT — see [LICENSE](LICENSE).
