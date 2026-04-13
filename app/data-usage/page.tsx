import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function DataUsagePage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FCFCFC]">
      <Navbar />
      <main className="w-full flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-0 lg:pt-28">
          <div className="flex flex-col items-center text-center">
            <h1 className="mb-3 font-pixelify text-5xl font-bold -tracking-[3px] text-[#000000] sm:text-7xl">
              data usage
            </h1>
            <p className="max-w-2xl text-[#919191]">
              A quick look at how Nap uses operational data to{" "}
              <span className="text-[#000000]">improve quality, security, and reliability</span>.
            </p>
          </div>

          <div className="mt-12 flex w-full justify-center">
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl border bg-[#0F0F0F] text-white">
              <div className="space-y-8 p-7 sm:p-9">
                <section>
                  <h2 className="text-xl font-semibold text-white">Product analytics</h2>
                  <p className="mt-3 text-sm leading-7 text-[#B8B8B8]">
                    Aggregated usage patterns help us understand feature adoption, improve
                    onboarding, and prioritize fixes.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-white">Security monitoring</h2>
                  <p className="mt-3 text-sm leading-7 text-[#B8B8B8]">
                    Diagnostic events and system activity are reviewed to detect abuse, protect
                    infrastructure, and investigate incidents.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-white">Retention</h2>
                  <p className="mt-3 text-sm leading-7 text-[#B8B8B8]">
                    Data is retained only as long as needed for service operation, compliance,
                    support, and reasonable product improvement workflows.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
