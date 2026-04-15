import { NextResponse } from 'next/server'

type ErrorType =
  | 'invalid_request_error'
  | 'authentication_error'
  | 'permission_error'
  | 'server_error'
  | 'rate_limit_error'
  | 'api_error'

type ErrorOptions = {
  status: number
  code: string
  message: string
  type?: ErrorType
  requestId: string
  retryAfterSeconds?: number
}

export function jsonError({
  status,
  code,
  message,
  requestId,
  retryAfterSeconds,
  type = 'api_error',
}: ErrorOptions) {
  const headers = new Headers({
    'x-request-id': requestId,
    'content-type': 'application/json',
  })

  if (retryAfterSeconds && retryAfterSeconds > 0) {
    headers.set('retry-after', String(retryAfterSeconds))
  }

  return NextResponse.json(
    {
      error: {
        message,
        type,
        code,
        param: null,
      },
    },
    {
      status,
      headers,
    }
  )
}

export function jsonWithRequestId<T>(payload: T, status: number, requestId: string) {
  return NextResponse.json(payload, {
    status,
    headers: {
      'x-request-id': requestId,
    },
  })
}
