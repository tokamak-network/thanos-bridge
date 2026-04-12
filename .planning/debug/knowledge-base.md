# GSD Debug Knowledge Base

Resolved debug sessions. Used by `gsd-debugger` to surface known-pattern hypotheses at the start of new investigations.

---

## withdraw-network-switch-balance-zero — Docker standalone mode doesn't auto-load .env files, causing wrong RPC URLs and chain IDs
- **Date:** 2026-04-13
- **Error patterns:** network switch fails, balance zero, wrong native token symbol, wagmi wrong chain ID, next.js standalone mode environment variables
- **Root cause:** Standalone Next.js mode does not auto-load .env files. Environment variables must be explicitly passed via docker run -e flags. The Dockerfile was copying .env which masked this issue, causing fallback to dev values instead of runtime overrides.
- **Fix:** (1) Removed .env* COPY from Dockerfile to force runtime env var passing, (2) Explicitly pass RPC URLs from environment variables to http() transports in wagmi.config.ts with fallback chain defaults
- **Files changed:** src/config/wagmi.config.ts, Dockerfile
---
