import { DEFAULT_MODEL_MAP, type ModelMap } from './models'

function parseInteger(
  value: string | undefined,
  fallback: number,
  bounds?: { min?: number; max?: number }
) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) {
    return fallback
  }

  const rounded = Math.floor(parsed)
  if (bounds?.min !== undefined && rounded < bounds.min) {
    return bounds.min
  }
  if (bounds?.max !== undefined && rounded > bounds.max) {
    return bounds.max
  }

  return rounded
}

function parseList(value: string | undefined) {
  if (!value) {
    return []
  }
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseTokenSecrets() {
  const json = process.env.NAPSTER_SERVICE_TOKEN_KEYS_JSON
  if (json) {
    try {
      const parsed = JSON.parse(json) as Record<string, unknown>
      const normalized: Record<string, string> = {}
      for (const [kid, secret] of Object.entries(parsed)) {
        if (typeof secret === 'string' && secret.trim()) {
          normalized[kid] = secret.trim()
        }
      }
      return normalized
    } catch {
      return {}
    }
  }

  const fallbackSecret =
    process.env.NAPSTER_SERVICE_TOKEN_SECRET || process.env.NAPSTER_PROXY_SIGNING_SECRET
  if (!fallbackSecret) {
    return {}
  }

  const kid = process.env.NAPSTER_SERVICE_TOKEN_ACTIVE_KID || 'v1'
  return {
    [kid]: fallbackSecret,
  }
}

function parseModelMap() {
  const json = process.env.NAPSTER_MODEL_MAP_JSON
  if (!json) {
    return DEFAULT_MODEL_MAP
  }

  try {
    const parsed = JSON.parse(json) as Record<string, unknown>
    const normalized: ModelMap = {}
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'string' && value.trim()) {
        normalized[key] = value.trim()
      }
    }
    return Object.keys(normalized).length > 0 ? normalized : DEFAULT_MODEL_MAP
  } catch {
    return DEFAULT_MODEL_MAP
  }
}

export type ProxyConfig = {
  enabled: boolean
  tokenIssuer: string
  tokenAudience: string
  tokenTtlSeconds: number
  tokenClockSkewSeconds: number
  activeTokenKid: string
  tokenSecrets: Record<string, string>
  revokedJtis: Set<string>
  allowedBootstrapClients: Set<string>
  bootstrapRateLimitPerMinute: number
  proxyRateLimitPerMinute: number
  maxRequestBodyBytes: number
  upstreamBaseUrl: string
  upstreamApiKey: string | null
  upstreamTimeoutMs: number
  circuitFailureThreshold: number
  circuitOpenMs: number
  modelMap: ModelMap
}

export function getProxyConfig(): ProxyConfig {
  const activeTokenKid = process.env.NAPSTER_SERVICE_TOKEN_ACTIVE_KID || 'v1'
  const tokenSecrets = parseTokenSecrets()

  return {
    enabled: process.env.NAPSTER_PROXY_DISABLED !== '1',
    tokenIssuer: process.env.NAPSTER_SERVICE_TOKEN_ISSUER || 'napster-api',
    tokenAudience: process.env.NAPSTER_SERVICE_TOKEN_AUDIENCE || 'model-proxy',
    tokenTtlSeconds: parseInteger(process.env.NAPSTER_SERVICE_TOKEN_TTL_SECONDS, 3600, {
      min: 60,
      max: 24 * 60 * 60,
    }),
    tokenClockSkewSeconds: parseInteger(process.env.NAPSTER_SERVICE_TOKEN_CLOCK_SKEW_SECONDS, 60, {
      min: 0,
      max: 600,
    }),
    activeTokenKid,
    tokenSecrets,
    revokedJtis: new Set(parseList(process.env.NAPSTER_REVOKED_TOKEN_JTIS)),
    allowedBootstrapClients: new Set(
      parseList(process.env.NAPSTER_ALLOWED_BOOTSTRAP_CLIENTS).length > 0
        ? parseList(process.env.NAPSTER_ALLOWED_BOOTSTRAP_CLIENTS)
        : ['napster-cli']
    ),
    bootstrapRateLimitPerMinute: parseInteger(
      process.env.NAPSTER_BOOTSTRAP_RATE_LIMIT_PER_MINUTE,
      30,
      { min: 1, max: 6000 }
    ),
    proxyRateLimitPerMinute: parseInteger(process.env.NAPSTER_PROXY_RATE_LIMIT_PER_MINUTE, 120, {
      min: 1,
      max: 12000,
    }),
    maxRequestBodyBytes: parseInteger(process.env.NAPSTER_PROXY_MAX_BODY_BYTES, 2_000_000, {
      min: 1000,
      max: 20_000_000,
    }),
    upstreamBaseUrl: (process.env.NAPSTER_XAI_API_BASE || 'https://api.x.ai/v1/').replace(
      /\/+$/,
      '/'
    ),
    upstreamApiKey: (process.env.NAPSTER_XAI_API_KEY || process.env.XAI_API_KEY || '').trim() || null,
    upstreamTimeoutMs: parseInteger(process.env.NAPSTER_PROXY_UPSTREAM_TIMEOUT_MS, 45_000, {
      min: 1000,
      max: 180_000,
    }),
    circuitFailureThreshold: parseInteger(
      process.env.NAPSTER_PROXY_CIRCUIT_FAILURE_THRESHOLD,
      5,
      { min: 1, max: 100 }
    ),
    circuitOpenMs: parseInteger(process.env.NAPSTER_PROXY_CIRCUIT_OPEN_MS, 30_000, {
      min: 1000,
      max: 300_000,
    }),
    modelMap: parseModelMap(),
  }
}
