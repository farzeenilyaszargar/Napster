# napster.sh (Website + API Surface)

This repository now includes backend routes for Napster CLI service-managed LLM access.

## Implemented backend routes

- `POST /cli/bootstrap`
- `POST /model-proxy/v1/chat/completions`
- `GET /model-proxy/v1/models`

These routes are designed so a fresh machine can install `napster-cli` and start chatting without local API key setup.

## Required environment variables

- `NAPSTER_SERVICE_TOKEN_SECRET`
  - HMAC signing secret for bootstrap tokens (required unless `NAPSTER_SERVICE_TOKEN_KEYS_JSON` is used).
- `NAPSTER_XAI_API_KEY` (or `XAI_API_KEY`)
  - Upstream xAI secret used server-side only.

## Recommended environment variables

- `NAPSTER_SERVICE_TOKEN_ACTIVE_KID` (default: `v1`)
- `NAPSTER_SERVICE_TOKEN_KEYS_JSON`
  - JSON object for key rotation, e.g. `{"v1":"old-secret","v2":"new-secret"}`
- `NAPSTER_SERVICE_TOKEN_TTL_SECONDS` (default: `3600`)
- `NAPSTER_REVOKED_TOKEN_JTIS`
  - Comma-separated revoked token IDs (`jti`) for emergency revocation.
- `NAPSTER_MODEL_MAP_JSON`
  - JSON selected-model -> upstream-model map. Defaults:
    - `grok-code-fast-1`
    - `grok-4-1-fast-reasoning`
    - `grok-4-1-fast-non-reasoning`
    - `grok-4-1-fast`
- `NAPSTER_BOOTSTRAP_RATE_LIMIT_PER_MINUTE` (default: `30`)
- `NAPSTER_PROXY_RATE_LIMIT_PER_MINUTE` (default: `120`)
- `NAPSTER_PROXY_UPSTREAM_TIMEOUT_MS` (default: `45000`)
- `NAPSTER_PROXY_CIRCUIT_FAILURE_THRESHOLD` (default: `5`)
- `NAPSTER_PROXY_CIRCUIT_OPEN_MS` (default: `30000`)
- `NAPSTER_ALLOWED_BOOTSTRAP_CLIENTS` (default: `napster-cli`)
- `NAPSTER_PROXY_DISABLED=1` to disable bootstrap/proxy in incidents.

## Security behavior

- Upstream provider secret is never returned to clients.
- Bootstrap returns short-lived scoped service tokens.
- Token validation checks signature, issuer, audience, expiry, and revocation (`jti` list).
- Proxy enforces model allowlist and explicit selected -> upstream mapping.
- Request IDs are returned via `x-request-id` header.

## Structured error codes

Proxy returns OpenAI-compatible error payloads with service codes:

- `invalid_token`
- `token_expired`
- `model_forbidden`
- `upstream_timeout`
- `upstream_auth_blocked`
- `rate_limited`

## Local verification flow (fresh machine simulation)

1. Start server with required env vars.
2. Bootstrap token:

```bash
curl -sS -X POST http://localhost:3000/cli/bootstrap \
  -H 'content-type: application/json' \
  -d '{
    "client":"napster-cli",
    "version":"0.0.0",
    "platform":"darwin",
    "arch":"arm64",
    "fingerprint":"fresh-device-test"
  }'
```

3. Use returned token with model proxy:

```bash
curl -sS -X POST http://localhost:3000/model-proxy/v1/chat/completions \
  -H "authorization: Bearer <TOKEN>" \
  -H 'content-type: application/json' \
  -d '{
    "model":"grok-4-1-fast",
    "messages":[{"role":"user","content":"hello"}],
    "stream":false
  }'
```

4. Confirm:

- request succeeds with no local user API key
- response includes `x-request-id`
- selected model maps to expected upstream model in server logs
