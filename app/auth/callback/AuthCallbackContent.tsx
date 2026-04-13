'use client'

import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

export default function AuthCallbackContent() {
    const searchParams = useSearchParams()

    const targetUrl = useMemo(() => {
        const callback = searchParams.get('callback')
        if (callback) {
            return callback
        }

        const protocol = searchParams.get('protocol')
        const redirect = searchParams.get('redirect')
        if (protocol && redirect) {
            return `${protocol}://${redirect.replace(/^\/+/, '')}`
        }

        if (protocol) {
            return `${protocol}://auth/callback`
        }

        return null
    }, [searchParams])

    const error = useMemo(() => {
        return (
            searchParams.get('error_description') ||
            searchParams.get('error') ||
            (!targetUrl ? 'Missing desktop callback target.' : null)
        )
    }, [searchParams, targetUrl])

    useEffect(() => {
        if (error || !targetUrl) {
            return
        }

        const params = new URLSearchParams(searchParams.toString())
        const callback = params.get('callback')
        const protocol = params.get('protocol')
        const redirect = params.get('redirect')
        if (callback) params.delete('callback')
        if (protocol) params.delete('protocol')
        if (redirect) params.delete('redirect')

        const separator = targetUrl.includes('?') ? '&' : '?'
        const redirectTarget = params.toString()
            ? `${targetUrl}${separator}${params.toString()}`
            : targetUrl

        window.location.replace(redirectTarget)
    }, [error, searchParams, targetUrl])

    return (
        <main className="flex min-h-screen items-center justify-center bg-black px-6 py-12 text-white">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                <h1 className="font-pixelify text-3xl text-white">napster</h1>
                <p className="mt-4 text-white/72">
                    {error ? 'Unable to return to the desktop app.' : 'Returning to the desktop app...'}
                </p>
                {error && (
                    <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {error}
                    </div>
                )}
                <Link
                    href="/signin"
                    className="mt-6 inline-flex rounded-full border border-white/12 px-5 py-3 text-sm text-white transition hover:border-white/24 hover:bg-white/[0.06]"
                >
                    Back to sign in
                </Link>
            </div>
        </main>
    )
}
