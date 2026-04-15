import crypto from 'node:crypto'

type MetricCounterStore = Map<string, number>
type LatencyStore = Map<string, { count: number; totalMs: number; maxMs: number }>

const counters: MetricCounterStore = new Map()
const latencies: LatencyStore = new Map()

export type RequestContext = {
  requestId: string
  ip: string
  userAgent: string
  route: string
}

function tagsKey(metricName: string, tags?: Record<string, string>) {
  if (!tags || Object.keys(tags).length === 0) {
    return metricName
  }
  const tagString = Object.entries(tags)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join(',')
  return `${metricName}{${tagString}}`
}

export function incrementMetric(metricName: string, tags?: Record<string, string>) {
  const key = tagsKey(metricName, tags)
  counters.set(key, (counters.get(key) || 0) + 1)
}

export function observeLatency(metricName: string, durationMs: number, tags?: Record<string, string>) {
  const key = tagsKey(metricName, tags)
  const existing = latencies.get(key)
  if (!existing) {
    latencies.set(key, {
      count: 1,
      totalMs: durationMs,
      maxMs: durationMs,
    })
    return
  }

  existing.count += 1
  existing.totalMs += durationMs
  existing.maxMs = Math.max(existing.maxMs, durationMs)
}

export function createRequestContext(request: Request, route: string): RequestContext {
  const requestId =
    request.headers.get('x-request-id')?.trim() || request.headers.get('x-correlation-id')?.trim() || crypto.randomUUID()
  const forwardedFor = request.headers.get('x-forwarded-for') || ''
  const ip = forwardedFor.split(',')[0]?.trim() || request.headers.get('x-real-ip')?.trim() || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'

  return {
    requestId,
    ip,
    userAgent,
    route,
  }
}

type LogLevel = 'info' | 'warn' | 'error'

export function logEvent(
  level: LogLevel,
  context: RequestContext,
  event: string,
  data?: Record<string, unknown>
) {
  const payload = {
    ts: new Date().toISOString(),
    level,
    route: context.route,
    requestId: context.requestId,
    ip: context.ip,
    event,
    ...(data || {}),
  }

  const line = JSON.stringify(payload)
  if (level === 'error') {
    console.error(line)
    return
  }
  if (level === 'warn') {
    console.warn(line)
    return
  }
  console.info(line)
}

export function getMetricSnapshot() {
  return {
    counters: Object.fromEntries(counters.entries()),
    latencies: Object.fromEntries(
      Array.from(latencies.entries()).map(([key, value]) => [
        key,
        {
          ...value,
          avgMs: value.count > 0 ? Number((value.totalMs / value.count).toFixed(2)) : 0,
        },
      ])
    ),
  }
}
