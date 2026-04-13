import { Suspense } from 'react'

import Footer from '@/components/footer'
import Navbar from '@/components/navbar'

import SignInContent from './SignInContent'

function SignInFallback() {
    return (
        <main className="flex w-full flex-1 items-center justify-center px-5 py-16 sm:px-8">
            <div className="w-full max-w-[460px] text-center">
                <h1 className="mb-4 font-pixelify text-5xl font-bold -tracking-[3px] text-black sm:text-6xl">
                    Welcome to Nap
                </h1>
                <div className="rounded-[32px] border border-black/8 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8">
                    <div className="animate-pulse space-y-4">
                        <div className="mx-auto h-4 w-24 rounded-full bg-black/6" />
                        <div className="h-12 rounded-2xl bg-black/6" />
                        <div className="h-3 rounded-full bg-black/5" />
                        <div className="h-12 rounded-2xl bg-black/6" />
                        <div className="h-12 rounded-2xl bg-black/6" />
                    </div>
                </div>
            </div>
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
