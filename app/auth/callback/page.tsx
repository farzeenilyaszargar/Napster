import { Suspense } from 'react'

import AuthCallbackContent from './AuthCallbackContent'

function AuthCallbackFallback() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-black px-6 py-12 text-white">
            <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 text-center shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                <h1 className="font-pixelify text-3xl text-white">napster</h1>
                <p className="mt-4 text-white/72">Returning to the desktop app...</p>
            </div>
        </main>
    )
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<AuthCallbackFallback />}>
            <AuthCallbackContent />
        </Suspense>
    )
}
