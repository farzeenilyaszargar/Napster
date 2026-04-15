import { validateServiceToken } from '@/lib/napster-proxy/auth'
import { getProxyConfig } from '@/lib/napster-proxy/config'
import { jsonError, jsonWithRequestId } from '@/lib/napster-proxy/errors'
import { listAllowedModels } from '@/lib/napster-proxy/models'
import { createRequestContext, incrementMetric, logEvent } from '@/lib/napster-proxy/observability'
import { consumeRateLimit } from '@/lib/napster-proxy/rate-limit'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const context = createRequestContext(request, 'model-proxy.models')
  const config = getProxyConfig()

  if (!config.enabled) {
    incrementMetric('napster_proxy_denied_total', { route: 'models', reason: 'service_disabled' })
    return jsonError({
      status: 503,
      code: 'service_disabled',
      message: 'Model proxy service is temporarily disabled.',
      requestId: context.requestId,
      type: 'server_error',
    })
  }

  const tokenValidation = validateServiceToken(request, config)
  if (!tokenValidation.ok) {
    const code = tokenValidation.code === 'token_expired' ? 'token_expired' : 'invalid_token'
    incrementMetric('napster_proxy_denied_total', { route: 'models', reason: code })
    return jsonError({
      status: code === 'token_expired' ? 401 : 401,
      code,
      message:
        code === 'token_expired'
          ? 'Service token has expired. Please bootstrap a new session token.'
          : 'Service token is invalid.',
      type: 'authentication_error',
      requestId: context.requestId,
    })
  }

  const rateLimit = consumeRateLimit({
    key: `proxy-models:${context.ip}:${tokenValidation.claims.sub}`,
    limit: config.proxyRateLimitPerMinute,
  })

  if (!rateLimit.allowed) {
    incrementMetric('napster_proxy_denied_total', { route: 'models', reason: 'rate_limited' })
    return jsonError({
      status: 429,
      code: 'rate_limited',
      message: 'Too many requests. Please retry shortly.',
      type: 'rate_limit_error',
      requestId: context.requestId,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    })
  }

  const models = listAllowedModels(config.modelMap).map((modelId) => ({
    id: modelId,
    object: 'model',
    created: 0,
    owned_by: 'napster-service',
  }))

  incrementMetric('napster_proxy_success_total', { route: 'models' })
  logEvent('info', context, 'proxy.models.served', {
    subject: tokenValidation.claims.sub,
    modelsCount: models.length,
  })

  return jsonWithRequestId(
    {
      object: 'list',
      data: models,
    },
    200,
    context.requestId
  )
}
