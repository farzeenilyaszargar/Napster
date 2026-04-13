'use client'

import { useEffect, useMemo, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { createClient, getClientConfigError } from '@/lib/supabase/client'

type Provider = 'google'

const providers: Array<{
    id: Provider
    label1: string
    label2: string
    icon: string
}> = [
        { id: 'google', label1: 'Continue with Google', label2: 'Google', icon: '/google-icon.svg' },
    ]

export default function SignInContent() {
    const searchParams = useSearchParams()
    const configError = getClientConfigError()
    const configMessage = configError ? 'Sign in is temporarily unavailable. Please try again later.' : null
    const [activeProvider, setActiveProvider] = useState<Provider | null>(null)
    const [emailStep, setEmailStep] = useState<'idle' | 'sending' | 'sent' | 'verifying'>('idle')
    const [email, setEmail] = useState('')
    const [otpDigits, setOtpDigits] = useState(Array(6).fill(''))
    const otpRefs = useRef<Array<HTMLInputElement | null>>([])
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [suppressQueryError, setSuppressQueryError] = useState(false)
    const queryError = searchParams.get('error')
    const desktopMode = searchParams.get('desktop') === '1'

    const nextPath = useMemo(() => {
        const urlRedirectTo = searchParams.get('redirect_to')
        const sessionRedirectTo = typeof window !== 'undefined' ? sessionStorage.getItem('ide_redirect_to') : null
        return urlRedirectTo || sessionRedirectTo || '/'
    }, [searchParams])

    const redirectUrlObject = useMemo(() => {
        const browserOrigin = typeof window !== 'undefined' ? window.location.origin : ''
        const envSiteUrl =
            process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || ''
        let siteUrl = browserOrigin || envSiteUrl
        siteUrl = siteUrl.replace(/\/$/, '')
        if (siteUrl && !/^https?:\/\//i.test(siteUrl)) {
            siteUrl = `https://${siteUrl}`
        }
        if (!siteUrl) {
            siteUrl =
                process.env.NODE_ENV === 'development'
                    ? 'http://localhost:3000'
                    : 'https://www.nap-code.com'
        }

        const redirectUrl = new URL('/auth/callback', siteUrl)

        if (desktopMode) {
            const state = searchParams.get('state')
            const nonce = searchParams.get('nonce')
            const protocol = searchParams.get('protocol')
            const redirect = searchParams.get('redirect')
            const callback = searchParams.get('callback')

            if (state) {
                redirectUrl.searchParams.set('desktop', '1')
                redirectUrl.searchParams.set('state', state)
                if (nonce) redirectUrl.searchParams.set('nonce', nonce)
                if (protocol) redirectUrl.searchParams.set('protocol', protocol)
                if (redirect) redirectUrl.searchParams.set('redirect', redirect)
                if (callback) redirectUrl.searchParams.set('callback', callback)
            }
        } else {
            redirectUrl.searchParams.set('next', nextPath)
        }

        return redirectUrl
    }, [desktopMode, nextPath, searchParams])

    const clientRedirectUrl = useMemo(() => {
        const url = new URL(redirectUrlObject.toString())
        url.pathname = '/auth/callback-client'
        return url
    }, [redirectUrlObject])

    useEffect(() => {
        if (configError) {
            return
        }

        const supabase = createClient()
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                setSuppressQueryError(true)
                setError(null)
                setSuccess(null)
            }
        })
    }, [configError, desktopMode, nextPath, queryError])

    const handleSignIn = async (provider: Provider) => {
        if (configError) {
            setError(configMessage)
            return
        }

        const supabase = createClient()
        setActiveProvider(provider)
        setError(null)
        setSuccess(null)

        if (desktopMode && !searchParams.get('state')) {
            setError('Missing desktop state. Please restart login from the app.')
            setActiveProvider(null)
            return
        }

        const baseOptions = {
            redirectTo: desktopMode ? redirectUrlObject.toString() : clientRedirectUrl.toString(),
            skipBrowserRedirect: false,
        } as const

        const providerOptions =
            provider === 'google'
                ? {
                    ...baseOptions,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    },
                }
                : baseOptions

        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: providerOptions,
        })

        if (error) {
            setError(error.message)
            setActiveProvider(null)
        }
    }

    const handleEmailSignIn = async () => {
        setError(null)
        setSuccess(null)
        setEmailStep('idle')

        if (configError) {
            setError(configMessage)
            return
        }

        const trimmedEmail = email.trim()
        if (!trimmedEmail) {
            setError('Please enter your email address.')
            return
        }

        setEmailStep('sending')

        if (desktopMode && !searchParams.get('state')) {
            setError('Missing desktop state. Please restart login from the app.')
            setEmailStep('idle')
            return
        }

        const response = await fetch('/api/auth/email-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: trimmedEmail,
                redirectTo: desktopMode ? redirectUrlObject.toString() : clientRedirectUrl.toString(),
            }),
        })

        const payload = (await response.json()) as { error?: string }

        if (!response.ok) {
            setError(payload.error || 'Unable to send sign-in email.')
            setEmailStep('idle')
            return
        }

        setOtpDigits(Array(6).fill(''))
        setEmailStep('sent')
    }

    const handleOtpChange = (index: number, value: string) => {
        const digit = value.replace(/\D/g, '').slice(-1)
        const nextDigits = [...otpDigits]
        nextDigits[index] = digit
        setOtpDigits(nextDigits)
        if (digit && index < otpDigits.length - 1) {
            otpRefs.current[index + 1]?.focus()
        }
    }

    const handleOtpKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }
    }

    const handleOtpPaste = (event: ClipboardEvent<HTMLDivElement>) => {
        const paste = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, otpDigits.length)
        if (!paste) return
        event.preventDefault()
        const nextDigits = Array(otpDigits.length).fill('')
        paste.split('').forEach((char, index) => {
            nextDigits[index] = char
        })
        setOtpDigits(nextDigits)
        const nextIndex = Math.min(paste.length, otpDigits.length - 1)
        otpRefs.current[nextIndex]?.focus()
    }

    const handleVerifyOtp = async () => {
        if (configError) {
            setError(configMessage)
            return
        }

        const supabase = createClient()
        setError(null)
        setSuccess(null)

        const token = otpDigits.join('')
        if (token.length !== otpDigits.length) {
            setError('Enter the 6-digit code sent to your email.')
            return
        }

        const trimmedEmail = email.trim()
        if (!trimmedEmail) {
            setError('Please enter your email address.')
            return
        }

        setEmailStep('verifying')

        const { error } = await supabase.auth.verifyOtp({
            email: trimmedEmail,
            token,
            type: 'magiclink',
        })

        if (error) {
            setError(error.message)
            setEmailStep('sent')
            return
        }

        if (desktopMode) {
            window.location.assign(redirectUrlObject.toString())
            return
        }

        setSuccess('Login successful.')
    }

    return (
        <main className="flex w-full flex-1 items-center justify-center px-5 py-16 sm:px-8">
            <div className="w-full max-w-[460px] text-center">
                <h1 className="mb-4 font-pixelify text-5xl font-bold -tracking-[3px] text-black sm:text-6xl">
                    Welcome to nap
                </h1>
                <p className="mb-8 text-sm leading-7 text-[#777777]">
                    Sign in to continue with your workspace.
                </p>

                <div className="rounded-[32px] border border-black/8 bg-white p-6 text-left shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8">
                    <div className="space-y-3">
                        {providers.map((provider) => (
                            <button
                                key={provider.id}
                                type="button"
                                onClick={() => handleSignIn(provider.id)}
                                disabled={!!activeProvider || !!configMessage}
                                className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-black/10 bg-[#FAFAFA] px-5 py-3.5 text-base font-semibold text-[#262626] shadow-sm transition-all hover:border-black/16 hover:bg-white active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative h-6 w-6 transform transition-transform group-hover:scale-110">
                                        <Image
                                            src={provider.icon}
                                            fill
                                            alt={`${provider.label1} logo`}
                                            className="object-contain"
                                        />
                                    </div>
                                    <span className="hidden sm:inline">{provider.label1}</span>
                                    <span className="sm:hidden">{provider.label2}</span>
                                </div>

                                {activeProvider === provider.id && (
                                    <div className="absolute right-4">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/15 border-t-black/60" />
                                    </div>
                                )}
                            </button>
                        ))}

                        <div className="flex items-center gap-3 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-[#9A9A9A]">
                            <span className="h-px flex-1 bg-black/8" />
                            <span>or</span>
                            <span className="h-px flex-1 bg-black/8" />
                        </div>

                        <div className="flex flex-col gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={(event) => {
                                    setEmail(event.target.value)
                                    if (emailStep !== 'idle') {
                                        setEmailStep('idle')
                                        setOtpDigits(Array(6).fill(''))
                                    }
                                }}
                                placeholder="Email address"
                                className="w-full rounded-2xl border border-black/10 bg-[#FAFAFA] px-4 py-3 text-base text-[#1E1E1E] outline-none transition placeholder:text-[#8D8D8D] focus:border-black/20 focus:bg-white"
                            />
                            <button
                                type="button"
                                onClick={handleEmailSignIn}
                                disabled={emailStep === 'sending' || !!configMessage}
                                className="inline-flex items-center justify-center rounded-2xl border border-black bg-black px-4 py-3 text-base font-semibold text-white transition hover:bg-[#1F1F1F] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {emailStep === 'sending' ? 'Sending...' : 'Continue'}
                            </button>
                        </div>

                        {(emailStep === 'sent' || emailStep === 'verifying') && (
                            <div className="mt-4 flex flex-col gap-3">
                                <p className="text-center text-sm text-[#727272]">
                                    Enter the 6-digit code sent to your email.
                                </p>
                                <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                                    {otpDigits.map((digit, index) => (
                                        <input
                                            key={index}
                                            ref={(el) => {
                                                otpRefs.current[index] = el
                                            }}
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(event) => handleOtpChange(index, event.target.value)}
                                            onKeyDown={(event) => handleOtpKeyDown(index, event)}
                                            className="h-11 w-11 rounded-xl border border-black/10 bg-[#FAFAFA] text-center text-base font-semibold text-[#1F1F1F] shadow-sm outline-none transition focus:border-black/20 focus:bg-white"
                                        />
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleVerifyOtp}
                                    disabled={emailStep === 'verifying' || !!configMessage}
                                    className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-[#F3F3F3] px-4 py-3 text-sm font-semibold text-[#242424] transition hover:bg-[#ECECEC] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {emailStep === 'verifying' ? 'Verifying...' : 'Verify'}
                                </button>
                            </div>
                        )}
                    </div>

                    {(configMessage || error || (!suppressQueryError && queryError)) && (
                        <div className="mt-6 animate-in fade-in zoom-in-95 duration-300">
                            <div className="rounded-2xl border border-[#F1C9C9] bg-[#FFF1F1] px-4 py-3 text-center">
                                <p className="text-sm font-medium text-[#B04E4E]">
                                    {configMessage || error || queryError}
                                </p>
                            </div>
                        </div>
                    )}

                    {success && (
                        <div className="mt-6 animate-in fade-in zoom-in-95 duration-300">
                            <div className="rounded-2xl border border-[#CFE5D0] bg-[#F3FAF3] px-4 py-3 text-center">
                                <p className="text-sm font-medium text-[#4E7B50]">{success}</p>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 border-t border-black/8 pt-5">
                        <p className="text-center text-xs leading-6 text-[#777777]">
                            By signing in, you agree to our{' '}
                            <Link
                                href="/terms-of-use"
                                className="font-medium text-[#4D4D4D] underline decoration-black/15 underline-offset-4 transition-colors hover:text-black hover:decoration-black/30"
                            >
                                Terms
                            </Link>
                            {' '}and{' '}
                            <Link
                                href="/privacy-policy"
                                className="font-medium text-[#4D4D4D] underline decoration-black/15 underline-offset-4 transition-colors hover:text-black hover:decoration-black/30"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                        <p className="mt-3 text-center text-xs leading-6 text-[#8A8A8A]">
                            {desktopMode
                                ? 'After sign in, this tab will guide you back into the desktop app.'
                                : "New here? Signing in creates your access automatically."}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    )
}
