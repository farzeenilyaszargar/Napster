import { Suspense } from 'react'

import SignInContent from './SignInContent'

function SignInFallback() {
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
                            <p className="text-sm text-[#727272]">Loading sign in...</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default function SignInPage() {
    return (
        <Suspense fallback={<SignInFallback />}>
            <SignInContent />
        </Suspense>
    )
}
