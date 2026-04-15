import { validateServiceToken } from '@/lib/napster-proxy/auth'
import { CircuitBreaker } from '@/lib/napster-proxy/circuit-breaker'
import { getProxyConfig } from '@/lib/napster-proxy/config'
import { jsonError } from '@/lib/napster-proxy/errors'
import { resolveUpstreamModel } from '@/lib/napster-proxy/models'
import {
  createRequestContext,
  incrementMetric,
  logEvent,
  observeLatency,
} from '@/lib/napster-proxy/observability'
import { consumeRateLimit } from '@/lib/napster-proxy/rate-limit'

export const runtime = 'nodejs'

type ChatCompletionsBody = {
  model?: string
  stream?: boolean
  messages?: unknown
  napProperties?: unknown
  [key: string]: unknown
}

let sharedCircuitBreaker: CircuitBreaker | null = null
let sharedCircuitSignature = ''

function getCircuitBreaker(config: ReturnType<typeof getProxyConfig>) {
  const signature = `${config.circuitFailureThreshold}:${config.circuitOpenMs}`
  if (!sharedCircuitBreaker || sharedCircuitSignature !== signature) {
    sharedCircuitBreaker = new CircuitBreaker(config.circuitFailureThreshold, config.circuitOpenMs)
    sharedCircuitSignature = signature
  }
  return sharedCircuitBreaker
}

function mapTokenErrorToMessage(code: 'invalid_token' | 'token_expired' | 'token_revoked') {
  if (code === 'token_expired') {
    return 'Service token expired. Re-bootstrap is required.'
  }
  if (code === 'token_revoked') {
    return 'Service token has been revoked.'
  }
  return 'Service token is invalid.'
}

function selectErrorType(code: string) {
  if (code === 'invalid_token' || code === 'token_expired' || code === 'token_revoked') {
    return 'authentication_error' as const
  }
  if (code === 'model_forbidden') {
    return 'permission_error' as const
  }
  if (code === 'rate_limited') {
    return 'rate_limit_error' as const
  }
  if (code === 'invalid_request') {
    return 'invalid_request_error' as const
  }
  return 'api_error' as const
}

export async function POST(request: Request) {
  const startedAt = Date.now()
  const context = createRequestContext(request, 'model-proxy.chat.completions')
  const config = getProxyConfig()
  const circuitBreaker = getCircuitBreaker(config)

  if (!config.enabled) {
    incrementMetric('napster_proxy_denied_total', { route: 'chat_completions', reason: 'service_disabled' })
    return jsonError({
      status: 503,
      code: 'service_disabled',
      message: 'Model proxy service is temporarily disabled.',
      type: 'server_error',
      requestId: context.requestId,
    })
  }

  if (!config.upstreamApiKey) {
    incrementMetric('napster_proxy_denied_total', {
      route: 'chat_completions',
      reason: 'missing_upstream_key',
    })
    return jsonError({
      status: 500,
      code: 'server_misconfigured',
      message: 'Upstream provider credentials are not configured.',
      type: 'server_error',
      requestId: context.requestId,
    })
  }

  const tokenValidation = validateServiceToken(request, config)
  if (!tokenValidation.ok) {
    incrementMetric('napster_proxy_denied_total', {
      route: 'chat_completions',
      reason: tokenValidation.code,
    })
    logEvent('warn', context, 'proxy.token_invalid', {
      reason: tokenValidation.reason,
      tokenCode: tokenValidation.code,
    })
    return jsonError({
      status: 401,
      code: tokenValidation.code,
      message: mapTokenErrorToMessage(tokenValidation.code),
      type: selectErrorType(tokenValidation.code),
      requestId: context.requestId,
    })
  }

  const scope = tokenValidation.claims.scope || []
  if (!scope.includes('model-proxy:chat.completions')) {
    incrementMetric('napster_proxy_denied_total', {
      route: 'chat_completions',
      reason: 'insufficient_scope',
    })
    return jsonError({
      status: 403,
      code: 'model_forbidden',
      message: 'Service token is not allowed to call chat completions.',
      type: 'permission_error',
      requestId: context.requestId,
    })
  }

  const rateLimit = consumeRateLimit({
    key: `proxy-chat:${context.ip}:${tokenValidation.claims.sub}`,
    limit: config.proxyRateLimitPerMinute,
  })

  if (!rateLimit.allowed) {
    incrementMetric('napster_proxy_denied_total', { route: 'chat_completions', reason: 'rate_limited' })
    return jsonError({
      status: 429,
      code: 'rate_limited',
      message: 'Rate limit exceeded. Please retry shortly.',
      type: 'rate_limit_error',
      requestId: context.requestId,
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    })
  }

  const contentLength = Number(request.headers.get('content-length') || 0)
  if (Number.isFinite(contentLength) && contentLength > config.maxRequestBodyBytes) {
    incrementMetric('napster_proxy_denied_total', {
      route: 'chat_completions',
      reason: 'body_too_large',
    })
    return jsonError({
      status: 413,
      code: 'invalid_request',
      message: 'Request body exceeds max allowed size.',
      type: 'invalid_request_error',
      requestId: context.requestId,
    })
  }

  let body: ChatCompletionsBody
  try {
    body = (await request.json()) as ChatCompletionsBody
  } catch {
    incrementMetric('napster_proxy_denied_total', { route: 'chat_completions', reason: 'invalid_json' })
    return jsonError({
      status: 400,
      code: 'invalid_request',
      message: 'Request body must be valid JSON.',
      type: 'invalid_request_error',
      requestId: context.requestId,
    })
  }

  const resolvedModel = resolveUpstreamModel(body.model, config.modelMap)
  if (!resolvedModel) {
    incrementMetric('napster_proxy_denied_total', {
      route: 'chat_completions',
      reason: 'model_forbidden',
    })
    return jsonError({
      status: 403,
      code: 'model_forbidden',
      message: 'Selected model is not allowed by service policy.',
      type: 'permission_error',
      requestId: context.requestId,
    })
  }

  if (
    tokenValidation.claims.models.length > 0 &&
    !tokenValidation.claims.models.includes(resolvedModel.selectedModel)
  ) {
    incrementMetric('napster_proxy_denied_total', {
      route: 'chat_completions',
      reason: 'model_claim_mismatch',
    })
    return jsonError({
      status: 403,
      code: 'model_forbidden',
      message: 'Selected model is not allowed by token scope.',
      type: 'permission_error',
      requestId: context.requestId,
    })
  }

  if (!circuitBreaker.canRequest()) {
    incrementMetric('napster_proxy_denied_total', {
      route: 'chat_completions',
      reason: 'circuit_open',
    })
    logEvent('warn', context, 'proxy.circuit_open', {
      selectedModel: resolvedModel.selectedModel,
      upstreamModel: resolvedModel.upstreamModel,
    })
    return jsonError({
      status: 503,
      code: 'upstream_unavailable',
      message: 'LLM service is temporarily unavailable. Please retry shortly.',
      type: 'server_error',
      requestId: context.requestId,
      retryAfterSeconds: Math.max(1, Math.ceil(config.circuitOpenMs / 1000)),
    })
  }

  const forwardBody: ChatCompletionsBody = { ...body }
  delete forwardBody.napProperties
  forwardBody.model = resolvedModel.upstreamModel

  const timeoutController = new AbortController()
  const timeoutHandle = setTimeout(() => {
    timeoutController.abort('upstream_timeout')
  }, config.upstreamTimeoutMs)

  try {
    const upstreamResponse = await fetch(new URL('chat/completions', config.upstreamBaseUrl), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.upstreamApiKey}`,
        'Content-Type': 'application/json',
        Accept: request.headers.get('accept') || 'application/json',
        'User-Agent': request.headers.get('user-agent') || 'napster-proxy/1.0',
      },
      body: JSON.stringify(forwardBody),
      signal: timeoutController.signal,
    })

    clearTimeout(timeoutHandle)

    if (!upstreamResponse.ok) {
      circuitBreaker.onFailure()
      const durationMs = Date.now() - startedAt
      const upstreamStatus = upstreamResponse.status

      logEvent('warn', context, 'proxy.upstream_error', {
        selectedModel: resolvedModel.selectedModel,
        upstreamModel: resolvedModel.upstreamModel,
        upstreamStatus,
        durationMs,
      })

      incrementMetric('napster_proxy_upstream_error_total', {
        route: 'chat_completions',
        status: String(upstreamStatus),
      })

      if (upstreamStatus === 401 || upstreamStatus === 403) {
        return jsonError({
          status: 502,
          code: 'upstream_auth_blocked',
          message: 'Upstream provider authentication is blocked.',
          requestId: context.requestId,
          type: 'server_error',
        })
      }

      if (upstreamStatus === 429) {
        return jsonError({
          status: 429,
          code: 'rate_limited',
          message: 'Service is currently rate limited.',
          requestId: context.requestId,
          type: 'rate_limit_error',
          retryAfterSeconds: Number(upstreamResponse.headers.get('retry-after') || 1),
        })
      }

      if (upstreamStatus === 408 || upstreamStatus === 504) {
        return jsonError({
          status: 504,
          code: 'upstream_timeout',
          message: 'Upstream provider timed out.',
          requestId: context.requestId,
          type: 'server_error',
        })
      }

      return jsonError({
        status: upstreamStatus >= 500 ? 502 : 400,
        code: 'upstream_error',
        message: 'Upstream provider request failed.',
        requestId: context.requestId,
        type: upstreamStatus >= 500 ? 'server_error' : 'invalid_request_error',
      })
    }

    circuitBreaker.onSuccess()
    const durationMs = Date.now() - startedAt
    incrementMetric('napster_proxy_success_total', { route: 'chat_completions' })
    observeLatency('napster_proxy_chat_duration_ms', durationMs, {
      model: resolvedModel.selectedModel,
    })
    logEvent('info', context, 'proxy.success', {
      selectedModel: resolvedModel.selectedModel,
      upstreamModel: resolvedModel.upstreamModel,
      upstreamStatus: upstreamResponse.status,
      durationMs,
    })

    const passthroughHeaders = new Headers()
    const responseContentType = upstreamResponse.headers.get('content-type')
    if (responseContentType) {
      passthroughHeaders.set('content-type', responseContentType)
    }
    const cacheControl = upstreamResponse.headers.get('cache-control')
    if (cacheControl) {
      passthroughHeaders.set('cache-control', cacheControl)
    }
    passthroughHeaders.set('x-request-id', context.requestId)

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: passthroughHeaders,
    })
  } catch (error) {
    clearTimeout(timeoutHandle)
    circuitBreaker.onFailure()

    const durationMs = Date.now() - startedAt
    const isAbort = error instanceof Error && error.name === 'AbortError'
    incrementMetric('napster_proxy_upstream_error_total', {
      route: 'chat_completions',
      status: isAbort ? 'timeout' : 'network_error',
    })
    logEvent('error', context, 'proxy.upstream_exception', {
      selectedModel: resolvedModel.selectedModel,
      upstreamModel: resolvedModel.upstreamModel,
      durationMs,
      error: error instanceof Error ? error.message : 'unknown_error',
    })

    if (isAbort) {
      return jsonError({
        status: 504,
        code: 'upstream_timeout',
        message: 'Upstream provider timed out.',
        requestId: context.requestId,
        type: 'server_error',
      })
    }

    return jsonError({
      status: 502,
      code: 'upstream_unavailable',
      message: 'Failed to reach upstream provider.',
      requestId: context.requestId,
      type: 'server_error',
    })
  }
}
