type WindowState = {
  count: number
  resetAtMs: number
}

const rateLimitWindows = new Map<string, WindowState>()
let lastSweepMs = 0

function sweepExpiredWindows(nowMs: number) {
  if (nowMs - lastSweepMs < 15_000) {
    return
  }
  lastSweepMs = nowMs
  for (const [key, state] of rateLimitWindows) {
    if (state.resetAtMs <= nowMs) {
      rateLimitWindows.delete(key)
    }
  }
}

export function consumeRateLimit(params: {
  key: string
  limit: number
  windowMs?: number
}): {
  allowed: boolean
  remaining: number
  retryAfterSeconds: number
} {
  const windowMs = params.windowMs ?? 60_000
  const nowMs = Date.now()
  sweepExpiredWindows(nowMs)

  const existing = rateLimitWindows.get(params.key)
  if (!existing || existing.resetAtMs <= nowMs) {
    rateLimitWindows.set(params.key, {
      count: 1,
      resetAtMs: nowMs + windowMs,
    })
    return {
      allowed: true,
      remaining: Math.max(params.limit - 1, 0),
      retryAfterSeconds: Math.ceil(windowMs / 1000),
    }
  }

  if (existing.count >= params.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAtMs - nowMs) / 1000)),
    }
  }

  existing.count += 1
  return {
    allowed: true,
    remaining: Math.max(params.limit - existing.count, 0),
    retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAtMs - nowMs) / 1000)),
  }
}
