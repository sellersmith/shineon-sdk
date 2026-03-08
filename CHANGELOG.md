# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 1.0.0 (2026-03-08)

### Added

- **Orders API** — `create` (V1), `createV2` (V2), `list`, `get`, `update`, `hold`, `ready`, `cancel`
- **SKUs API** — `list`, `get`
- **Product Templates API** — `list` (V1), `listV2` (V2 with search), `get`
- **Renders API** — `get`, `make`
- `ShineOnError` with `status`, `message`, and `responseBody` fields
- Automatic 429 retry with exponential backoff (configurable `maxRetries`)
- CJS/ESM dual build via tsup
- Full TypeScript types exported from package root
- Zero runtime dependencies
- Node 18+ support using native `fetch`
