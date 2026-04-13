import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function DataUsagePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FCFCFC]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-16 md:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8B8B8B]">
          Data Usage
        </p>
        <h1 className="mt-3 font-pixelify text-5xl text-black sm:text-6xl">Data Usage</h1>
        <p className="mt-4 max-w-3xl text-[#707070] leading-7">
          Napster uses operational data to power agent workflows, improve product
          quality, and keep the platform secure and reliable.
        </p>

        <div className="mt-10 rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8">
          <div className="space-y-6 text-[#5F5F5F] leading-7">
            <section>
              <h2 className="text-lg font-semibold text-black">Product analytics</h2>
              <p className="mt-2">
                Aggregated usage patterns help us understand feature adoption,
                improve onboarding, and prioritize fixes.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-black">Security monitoring</h2>
              <p className="mt-2">
                Diagnostic events and system activity are reviewed to detect abuse,
                protect infrastructure, and investigate incidents.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-black">Retention</h2>
              <p className="mt-2">
                Data is retained only as long as needed for service operation,
                compliance, support, and reasonable product improvement workflows.
              </p>
            </section>
          </div>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex w-fit items-center rounded-full border border-black/10 px-5 py-3 text-sm text-[#2E2E2E] transition hover:border-black/20 hover:bg-black/[0.03]"
        >
          Back to overview
        </Link>
      </main>
      <Footer />
    </div>
  );
}
