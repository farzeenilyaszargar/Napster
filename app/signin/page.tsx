import { Suspense } from 'react'

import Footer from '@/components/footer'
import Navbar from '@/components/navbar'

import SignInContent from './SignInContent'

function SignInFallback() {
    return (
        <main className="w-full flex-1">
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(40%_30%_at_15%_15%,rgba(0,0,0,0.04)_0%,rgba(255,255,255,0)_100%),radial-gradient(34%_26%_at_85%_22%,rgba(0,0,0,0.05)_0%,rgba(255,255,255,0)_100%)]" />
                <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-0 lg:pt-24">
                    <div className="flex flex-col justify-center">
                        <div className="inline-flex w-fit items-center rounded-full border border-black/10 bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.22em] text-[#7A7A7A]">
                            Secure access
                        </div>
                        <h1 className="mt-5 font-pixelify text-5xl font-bold -tracking-[3px] text-black sm:text-7xl">
                            sign in
                        </h1>
                        <p className="mt-4 max-w-xl text-sm leading-7 text-[#7B7B7B] sm:text-base">
                            Loading your secure workspace access with the same quiet, focused flow as the rest
                            of Nap.
                        </p>
                    </div>

                    <div className="rounded-[32px] border border-black/8 bg-white/88 p-6 shadow-[0_28px_80px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:p-8">
                        <div className="animate-pulse">
                            <div className="h-4 w-24 rounded-full bg-black/6" />
                            <div className="mt-4 h-12 rounded-2xl bg-black/6" />
                            <div className="mt-3 h-3 w-full rounded-full bg-black/5" />
                            <div className="mt-8 h-12 rounded-2xl bg-black/6" />
                            <div className="mt-3 h-12 rounded-2xl bg-black/6" />
                            <div className="mt-6 h-10 rounded-2xl bg-black/6" />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

export default function SignInPage() {
    return (
        <div className="flex min-h-screen flex-col items-center bg-[#FCFCFC]">
            <Navbar />
            <Suspense fallback={<SignInFallback />}>
                <SignInContent />
            </Suspense>
            <Footer />
        </div>
    )
}
