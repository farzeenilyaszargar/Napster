import type { ProxyConfig } from './config'
import { verifyServiceToken, type ServiceTokenClaims } from './token'

export function extractBearerToken(request: Request) {
  const authorization = request.headers.get('authorization') || request.headers.get('Authorization')
  if (authorization) {
    const [scheme, value] = authorization.trim().split(/\s+/, 2)
    if (scheme.toLowerCase() === 'bearer' && value?.trim()) {
      return value.trim()
    }
  }

  const apiKey = request.headers.get('x-api-key') || request.headers.get('X-API-Key')
  if (apiKey?.trim()) {
    return apiKey.trim()
  }

  return null
}

export type TokenValidationResult =
  | {
      ok: true
      token: string
      claims: ServiceTokenClaims
    }
  | {
      ok: false
      code: 'invalid_token' | 'token_expired' | 'token_revoked'
      reason: string
    }

export function validateServiceToken(request: Request, config: ProxyConfig): TokenValidationResult {
  const token = extractBearerToken(request)
  if (!token) {
    return {
      ok: false,
      code: 'invalid_token',
      reason: 'Missing Authorization bearer token or x-api-key',
    }
  }

  const validation = verifyServiceToken(token, config)
  if (!validation.ok) {
    return validation
  }

  return {
    ok: true,
    token,
    claims: validation.claims,
  }
}
