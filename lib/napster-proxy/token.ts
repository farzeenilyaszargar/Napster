import crypto from 'node:crypto'

import type { ProxyConfig } from './config'
import { listAllowedModels } from './models'

type JwtHeader = {
  alg: 'HS256'
  typ: 'JWT'
  kid?: string
}

export type ServiceTokenClaims = {
  iss: string
  aud: string
  sub: string
  iat: number
  exp: number
  jti: string
  scope: string[]
  providers: string[]
  models: string[]
  client: string
  version?: string
  platform?: string
  arch?: string
  fingerprintHash?: string
}

type BootstrapMetadata = {
  client: string
  version?: string
  platform?: string
  arch?: string
  fingerprint?: string
}

type VerifyTokenSuccess = {
  ok: true
  claims: ServiceTokenClaims
}

type VerifyTokenFailure = {
  ok: false
  code: 'invalid_token' | 'token_expired' | 'token_revoked'
  reason: string
}

export type VerifyTokenResult = VerifyTokenSuccess | VerifyTokenFailure

function toBase64Url(value: Buffer | string) {
  return Buffer.from(value)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function fromBase64Url(value: string) {
  const withPadding = value + '='.repeat((4 - (value.length % 4 || 4)) % 4)
  return Buffer.from(withPadding.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
}

function safeJsonParse(value: string) {
  try {
    return JSON.parse(value) as Record<string, unknown>
  } catch {
    return null
  }
}

function sign(input: string, secret: string) {
  return toBase64Url(crypto.createHmac('sha256', secret).update(input).digest())
}

function isSignatureEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)
  if (aBuffer.length !== bBuffer.length) {
    return false
  }
  return crypto.timingSafeEqual(aBuffer, bBuffer)
}

function hashFingerprint(value: string | undefined) {
  if (!value) {
    return undefined
  }
  return crypto.createHash('sha256').update(value).digest('hex')
}

export function issueServiceToken(
  metadata: BootstrapMetadata,
  config: ProxyConfig
): { token: string; expiresIn: number; expiresAt: string; claims: ServiceTokenClaims } {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + config.tokenTtlSeconds
  const kid = config.activeTokenKid
  const secret = config.tokenSecrets[kid]

  if (!secret) {
    throw new Error(`Missing signing secret for active token kid "${kid}"`)
  }

  const claims: ServiceTokenClaims = {
    iss: config.tokenIssuer,
    aud: config.tokenAudience,
    sub: `cli:${crypto.randomUUID()}`,
    iat: now,
    exp,
    jti: crypto.randomUUID(),
    scope: ['model-proxy:chat.completions', 'model-proxy:models.read'],
    providers: ['xai'],
    models: listAllowedModels(config.modelMap),
    client: metadata.client,
    version: metadata.version,
    platform: metadata.platform,
    arch: metadata.arch,
    fingerprintHash: hashFingerprint(metadata.fingerprint),
  }

  const header: JwtHeader = {
    alg: 'HS256',
    typ: 'JWT',
    kid,
  }

  const encodedHeader = toBase64Url(JSON.stringify(header))
  const encodedPayload = toBase64Url(JSON.stringify(claims))
  const signature = sign(`${encodedHeader}.${encodedPayload}`, secret)
  const token = `${encodedHeader}.${encodedPayload}.${signature}`

  return {
    token,
    expiresIn: config.tokenTtlSeconds,
    expiresAt: new Date(exp * 1000).toISOString(),
    claims,
  }
}

function getNumberClaim(payload: Record<string, unknown>, key: string): number | null {
  const raw = payload[key]
  if (typeof raw === 'number' && Number.isFinite(raw)) {
    return Math.floor(raw)
  }
  if (typeof raw === 'string' && raw.trim()) {
    const parsed = Number(raw)
    if (Number.isFinite(parsed)) {
      return Math.floor(parsed)
    }
  }
  return null
}

function getStringArrayClaim(payload: Record<string, unknown>, key: string): string[] {
  const raw = payload[key]
  if (!Array.isArray(raw)) {
    return []
  }
  return raw.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
}

export function verifyServiceToken(token: string, config: ProxyConfig): VerifyTokenResult {
  const parts = token.split('.')
  if (parts.length !== 3) {
    return {
      ok: false,
      code: 'invalid_token',
      reason: 'Token must contain three JWT segments',
    }
  }

  const [encodedHeader, encodedPayload, signature] = parts

  const headerJson = fromBase64Url(encodedHeader).toString('utf8')
  const payloadJson = fromBase64Url(encodedPayload).toString('utf8')

  const header = safeJsonParse(headerJson)
  const payload = safeJsonParse(payloadJson)

  if (!header || !payload) {
    return {
      ok: false,
      code: 'invalid_token',
      reason: 'Token payload is not valid JSON',
    }
  }

  const kid =
    typeof header.kid === 'string' && header.kid.trim() ? header.kid.trim() : config.activeTokenKid
  const secretsToTry = kid in config.tokenSecrets ? [config.tokenSecrets[kid]] : Object.values(config.tokenSecrets)

  if (secretsToTry.length === 0) {
    return {
      ok: false,
      code: 'invalid_token',
      reason: 'No server signing secrets are configured',
    }
  }

  const signedInput = `${encodedHeader}.${encodedPayload}`
  const signatureValid = secretsToTry.some((secret) => isSignatureEqual(signature, sign(signedInput, secret)))

  if (!signatureValid) {
    return {
      ok: false,
      code: 'invalid_token',
      reason: 'Token signature mismatch',
    }
  }

  const exp = getNumberClaim(payload, 'exp')
  const iat = getNumberClaim(payload, 'iat')
  const jti = typeof payload.jti === 'string' ? payload.jti : ''
  const iss = typeof payload.iss === 'string' ? payload.iss : ''
  const aud = typeof payload.aud === 'string' ? payload.aud : ''
  const sub = typeof payload.sub === 'string' ? payload.sub : ''
  const client = typeof payload.client === 'string' ? payload.client : ''

  if (!exp || !iat || !jti || !iss || !aud || !sub || !client) {
    return {
      ok: false,
      code: 'invalid_token',
      reason: 'Token is missing mandatory claims',
    }
  }

  if (iss !== config.tokenIssuer || aud !== config.tokenAudience) {
    return {
      ok: false,
      code: 'invalid_token',
      reason: 'Token issuer or audience is invalid',
    }
  }

  if (config.revokedJtis.has(jti)) {
    return {
      ok: false,
      code: 'token_revoked',
      reason: 'Token jti has been revoked',
    }
  }

  const now = Math.floor(Date.now() / 1000)
  if (exp <= now - config.tokenClockSkewSeconds) {
    return {
      ok: false,
      code: 'token_expired',
      reason: 'Token expiry has elapsed',
    }
  }

  const claims: ServiceTokenClaims = {
    iss,
    aud,
    sub,
    iat,
    exp,
    jti,
    scope: getStringArrayClaim(payload, 'scope'),
    providers: getStringArrayClaim(payload, 'providers'),
    models: getStringArrayClaim(payload, 'models'),
    client,
    version: typeof payload.version === 'string' ? payload.version : undefined,
    platform: typeof payload.platform === 'string' ? payload.platform : undefined,
    arch: typeof payload.arch === 'string' ? payload.arch : undefined,
    fingerprintHash:
      typeof payload.fingerprintHash === 'string' ? payload.fingerprintHash : undefined,
  }

  return {
    ok: true,
    claims,
  }
}
