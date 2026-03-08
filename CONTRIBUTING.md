# Contributing

## Prerequisites

- Node 18+
- npm 9+

## Setup

```bash
git clone https://github.com/sellersmith/shineon-sdk.git
cd shineon-sdk
npm install
cp .env.example .env
# Add your SHINEON_API_TOKEN to .env
```

## Development Commands

```bash
npm run build       # compile to dist/ (CJS + ESM)
npm run typecheck   # TypeScript type check (no emit)
npm run lint        # ESLint
npm test            # all tests (unit + integration)
npm run test:unit   # unit tests only (no token required)
npm run test:integration  # integration tests (requires SHINEON_API_TOKEN)
npm run test:watch  # watch mode
```

## Running Integration Tests

Integration tests hit the live ShineOn API. Set `SHINEON_API_TOKEN` in `.env` before running:

```bash
SHINEON_API_TOKEN=your-token npm run test:integration
```

Integration tests create orders with `test: true` to avoid real fulfillment charges.

## Pull Request Process

1. Fork the repo and create a branch from `main`: `git checkout -b feat/your-feature`
2. Write or update tests for your change
3. Ensure `npm run typecheck`, `npm run lint`, and `npm test` all pass
4. Open a PR against `main` with a clear description of what and why

## Commit Conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add orders.archive() method
fix: handle empty body on 204 responses
docs: update webhook payload example
test: add integration test for SKU list
chore: bump vitest to 3.1.0
```

Types: `feat`, `fix`, `docs`, `test`, `refactor`, `chore`, `perf`.

Breaking changes: append `!` after the type (e.g., `feat!:`) and describe in the commit body with `BREAKING CHANGE:`.
