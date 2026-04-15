import { getProxyConfig } from '@/lib/napster-proxy/config'
import { jsonError, jsonWithRequestId } from '@/lib/napster-proxy/errors'
import {
  createRequestContext,
  incrementMetric,
  logEvent,
  observeLatency,
} from '@/lib/napster-proxy/observability'
import { consumeRateLimit } from '@/lib/napster-proxy/rate-limit'
import { issueServiceToken } from '@/lib/napster-proxy/token'

export const runtime = 'nodejs'

type BootstrapRequestBody = {
  client?: string
  version?: string
  platform?: string
  arch?: string
  fingerprint?: string
}

function normalizeString(value: unknown, maxLen: number) {
  if (typeof value !== 'string') {
    return undefined
  }
  const trimmed = value.trim()
  if (!trimmed) {
    return undefined
  }
  return trimmed.slice(0, maxLen)
}

export async function POST(request: Request) {
  const startedAt = Date.now()
  const context = createRequestContext(request, 'cli.bootstrap')
  const config = getProxyConfig()

  if (!config.enabled) {
    incrementMetric('napster_bootstrap_denied_total', { reason: 'service_disabled' })
    return jsonError({
      status: 503,
      code: 'service_disabled',
      message: 'Service bootstrap is temporarily disabled.',
      type: 'server_error',
      requestId: context.requestId,
    })
  }

  if (!config.tokenSecrets[config.activeTokenKid]) {
    incrementMetric('napster_bootstrap_denied_total', { reason: 'missing_signing_key' })
    return jsonError({
      status: 500,
      code: 'server_misconfigured',
      message: 'Server signing key is not configured.',
      type: 'server_error',
      requestId: context.requestId,
    })
  }

  const rateLimit = consumeRateLimit({
    key: `bootstrap:${context.ip}`,
    limit: config.bootstrapRateLimitPerMinute,
  })

  if (!rateLimit.allowed) {
    incrementMetric('napster_bootstrap_denied_total', { reason: 'rate_limited' })
    logEvent('warn', context, 'bootstrap.rate_limited', {
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    })
    return jsonError({
      status: 429,
      code: 'rate_limited',
      message: 'Too many bootstrap requests. Please retry shortly.',
      type: 'rate_limit_error',
      requestId: context.requestId,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    })
  }

  let body: BootstrapRequestBody
  try {
    body = (await request.json()) as BootstrapRequestBody
  } catch {
    incrementMetric('napster_bootstrap_denied_total', { reason: 'invalid_json' })
    return jsonError({
      status: 400,
      code: 'invalid_request',
      message: 'Invalid JSON body.',
      type: 'invalid_request_error',
      requestId: context.requestId,
    })
  }

  const client = normalizeString(body.client, 128)
  if (!client) {
    incrementMetric('napster_bootstrap_denied_total', { reason: 'missing_client' })
    return jsonError({
      status: 400,
      code: 'invalid_request',
      message: 'Field "client" is required.',
      type: 'invalid_request_error',
      requestId: context.requestId,
    })
  }

  if (!config.allowedBootstrapClients.has(client)) {
    incrementMetric('napster_bootstrap_denied_total', { reason: 'client_forbidden' })
    logEvent('warn', context, 'bootstrap.client_forbidden', { client })
    return jsonError({
      status: 403,
      code: 'client_forbidden',
      message: `Client "${client}" is not allowed to bootstrap.`,
      type: 'permission_error',
      requestId: context.requestId,
    })
  }

  const token = issueServiceToken(
    {
      client,
      version: normalizeString(body.version, 128),
      platform: normalizeString(body.platform, 64),
      arch: normalizeString(body.arch, 64),
      fingerprint: normalizeString(body.fingerprint, 256),
    },
    config
  )

  const durationMs = Date.now() - startedAt
  incrementMetric('napster_bootstrap_success_total', { client })
  observeLatency('napster_bootstrap_duration_ms', durationMs, { client })
  logEvent('info', context, 'bootstrap.issued', {
    client,
    tokenKid: config.activeTokenKid,
    expiresAt: token.expiresAt,
    ttlSeconds: token.expiresIn,
    durationMs,
  })

  return jsonWithRequestId(
    {
      accessToken: token.token,
      token: token.token,
      expiresIn: token.expiresIn,
      expiresAt: token.expiresAt,
    },
    200,
    context.requestId
  )
}
