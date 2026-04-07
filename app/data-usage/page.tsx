import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function DataUsagePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-16 md:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-white/45">
          Data Usage
        </p>
        <h1 className="font-pixelify text-6xl text-white">Data Usage</h1>
        <p className="mt-4 max-w-3xl text-white/68">
          Napster uses operational data to power agent workflows, improve product
          quality, and keep the platform secure and reliable.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <div className="space-y-6 text-white/78">
            <section>
              <h2 className="text-lg font-semibold text-white">Product analytics</h2>
              <p className="mt-2">
                Aggregated usage patterns help us understand feature adoption,
                improve onboarding, and prioritize fixes.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-white">Security monitoring</h2>
              <p className="mt-2">
                Diagnostic events and system activity are reviewed to detect abuse,
                protect infrastructure, and investigate incidents.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-white">Retention</h2>
              <p className="mt-2">
                Data is retained only as long as needed for service operation,
                compliance, support, and reasonable product improvement workflows.
              </p>
            </section>
          </div>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex w-fit items-center rounded-full border border-white/12 px-5 py-3 text-sm text-white transition hover:border-white/24 hover:bg-white/[0.06]"
        >
          Back to overview
        </Link>
      </main>
      <Footer />
    </div>
  );
}
