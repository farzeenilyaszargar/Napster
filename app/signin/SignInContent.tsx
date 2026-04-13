'use client'

import { useEffect, useMemo, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { createClient } from '@/lib/supabase/client'

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
        const supabase = createClient()
        supabase.auth.getSession().then(({ data }) => {
            if (data.session) {
                setSuppressQueryError(true)
                setError(null)
                setSuccess('Login successful.')
            }
        })
    }, [desktopMode, nextPath, queryError])

    const handleSignIn = async (provider: Provider) => {
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
        <div className="min-h-screen bg-black text-white">
            <main className="relative flex min-h-[calc(100vh-56px)] flex-col items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_32%,rgba(56,56,56,0.16)_0%,rgba(0,0,0,0)_100%)]" />
                <div className="absolute left-[8%] top-[16%] -z-10 h-64 w-64 rounded-full bg-[#0B0B0B] blur-3xl" />
                <div className="absolute bottom-[16%] right-[10%] -z-10 h-72 w-72 rounded-full bg-[#111111] blur-3xl" />

                <div className="w-full max-w-[420px] transition-all duration-700 animate-in fade-in slide-in-from-bottom-6">
                    <div className="overflow-hidden rounded-[28px] border border-[#1C1C1C] bg-[#050505]/95 p-6 shadow-[0_24px_90px_rgba(0,0,0,0.5)] backdrop-blur-2xl sm:p-8">
                        <div className="flex flex-col items-center text-center">
                            <div className="my-4 font-pixelify font-medium text-4xl tracking-[0.24em] text-[#cacaca]">
                                Welcome Back To Nap
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            {providers.map((provider) => (
                                <button
                                    key={provider.id}
                                    type="button"
                                    onClick={() => handleSignIn(provider.id)}
                                    disabled={!!activeProvider}
                                    className="group relative flex w-full items-center justify-center gap-3 rounded-2xl border border-[#1F1F1F] bg-[#0D0D0D] px-5 py-3.5 text-md font-semibold text-[#A0A0A0] shadow-sm transition-all hover:border-[#2C2C2C] hover:bg-[#131313] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#4A4A4A]/20 border-t-[#8C8C8C]" />
                                        </div>
                                    )}
                                </button>
                            ))}
                            <div className="flex items-center gap-3 py-1 text-sm font-semibold uppercase tracking-[0.2em] text-[#5C5C5C]">
                                <span className="h-px flex-1 bg-[#1E1E1E]" />
                                <span>or</span>
                                <span className="h-px flex-1 bg-[#1E1E1E]" />
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
                                    className="w-full rounded-xl border border-[#1F1F1F] bg-[#0B0B0B] px-4 py-3 text-md text-[#D0D0D0] outline-none transition placeholder:text-[#4F4F4F] focus:border-[#3A3A3A] focus:ring-2 focus:ring-[#1B1B1B]"
                                />
                                <button
                                    type="button"
                                    onClick={handleEmailSignIn}
                                    disabled={emailStep === 'sending'}
                                    className="inline-flex items-center justify-center rounded-xl border border-[#202020] bg-[#ffffff] px-4 py-2.5 text-md font-semibold text-[#0f0f0f] transition hover:bg-[#c7c7c7] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {emailStep === 'sending' ? 'Sending...' : 'Continue'}
                                </button>
                            </div>
                            {(emailStep === 'sent' || emailStep === 'verifying') && (
                                <div className="mt-4 flex flex-col gap-3">
                                    <p className="text-sm text-[#727272]">Enter the 6-digit code sent to your email.</p>
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
                                                className="h-11 w-11 rounded-xl border border-[#1F1F1F] bg-[#0B0B0B] text-center text-base font-semibold text-[#D0D0D0] shadow-sm outline-none transition focus:border-[#3A3A3A] focus:ring-2 focus:ring-[#1B1B1B]"
                                            />
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={emailStep === 'verifying'}
                                        className="inline-flex items-center justify-center rounded-xl border border-[#202020] bg-[#131313] px-4 py-2.5 text-sm font-semibold text-[#CFCFCF] transition hover:bg-[#181818] disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {emailStep === 'verifying' ? 'Verifying...' : 'Verify'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {(error || (!suppressQueryError && queryError)) && (
                            <div className="mt-6 animate-in fade-in zoom-in-95 duration-300">
                                <div className="rounded-xl border border-red-500/15 bg-red-500/8 px-4 py-3 text-center">
                                    <p className="text-sm font-medium text-red-300">{error || queryError}</p>
                                </div>
                            </div>
                        )}
                        {success && (
                            <div className="mt-6 animate-in fade-in zoom-in-95 duration-300">
                                <div className="rounded-xl border border-emerald-500/15 bg-emerald-500/8 px-4 py-3 text-center">
                                    <p className="text-sm font-medium text-emerald-300">{success}</p>
                                </div>
                            </div>
                        )}
                        <div className="mt-6 border-t border-[#141414] pt-5">
                            <p className="text-center text-xs text-[#5F5F5F]">
                                By signing in, you agree to our{' '}
                                <Link href="/terms-of-use" className="font-medium text-[#8B8B8B] transition-colors underline decoration-[#2A2A2A] underline-offset-4 hover:text-[#BEBEBE] hover:decoration-[#4A4A4A]">Terms</Link>
                                {' '}and{' '}
                                <Link href="/privacy-policy" className="font-medium text-[#8B8B8B] transition-colors underline decoration-[#2A2A2A] underline-offset-4 hover:text-[#BEBEBE] hover:decoration-[#4A4A4A]">Privacy Policy</Link>.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 text-center animate-in fade-in slide-in-from-top-4 duration-1000 delay-300 fill-mode-both">
                        <p className="text-sm text-[#6E6E6E]">
                            {desktopMode
                                ? 'After sign in, this browser tab will guide you back to the app.'
                                : <>Don&apos;t have an account? No problem. <br />Signing in creates one automatically.</>}
                        </p>
                    </div>
                </div>
            </main>
        </div>
    )
}
