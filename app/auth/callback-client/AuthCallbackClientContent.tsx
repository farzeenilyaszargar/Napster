'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { createClient, getClientConfigError } from '@/lib/supabase/client'

export default function AuthCallbackClientContent() {
    const searchParams = useSearchParams()
    const configError = getClientConfigError()
    const configMessage = configError ? 'Sign in is temporarily unavailable. Please try again later.' : null
    const [message, setMessage] = useState('Finishing sign in...')
    const [error, setError] = useState<string | null>(null)

    const nextPath = useMemo(() => searchParams.get('next') || '/', [searchParams])
    const queryError = useMemo(
        () => searchParams.get('error_description') || searchParams.get('error'),
        [searchParams]
    )

    useEffect(() => {
        if (queryError || configError) {
            return
        }

        const supabase = createClient()

        const finishSignIn = async () => {
            const code = searchParams.get('code')
            if (code) {
                const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
                if (exchangeError) {
                    setError(exchangeError.message)
                    setMessage('Unable to complete sign in.')
                    return
                }
            }

            setMessage('Sign in complete. Redirecting...')
            window.location.replace(nextPath)
        }

        finishSignIn()
    }, [configError, nextPath, queryError, searchParams])

    const displayError = queryError || error || configMessage
    const displayMessage = displayError ? 'Unable to complete sign in.' : message

    return (
        <main className="flex min-h-screen items-center justify-center bg-black px-6 py-12 text-white">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                <h1 className="font-pixelify text-3xl text-white">napster</h1>
                <p className="mt-4 text-white/72">{displayMessage}</p>
                {displayError && (
                    <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {displayError}
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
