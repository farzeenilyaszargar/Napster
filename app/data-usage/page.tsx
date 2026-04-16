import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function DataUsagePage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FCFCFC]">
      <Navbar />
      <main className="w-full flex-1">
        <div className="mx-auto flex sm:w-4/7 flex-col px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-0 lg:pt-28">
          <div className="flex flex-col items-center text-center">
            <h1 className="mb-3 font-pixelify text-5xl font-bold -tracking-[3px] text-[#000000] sm:text-7xl">
              data usage
            </h1>
            <p className="max-w-2xl text-[#919191]">
              A quick look at how Nap uses operational data to{" "}
              <span className="text-[#000000]">improve quality, security, and reliability</span>.
            </p>
          </div>

          <div className="mt-12 w-full space-y-8 text-[#5B5B5B]">
            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Overview</h2>
              <p className="mt-3 text-sm leading-7">
                This Data Usage page describes how Nap uses operational and product data to deliver
                core functionality, improve system quality, and keep the platform secure. We aim to
                keep this section practical and transparent so teams understand what signals are used
                and why they matter. Data usage decisions are based on product necessity, security
                obligations, support needs, and responsible service improvement. We avoid collecting
                information that does not support these goals.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Product analytics</h2>
              <p className="mt-3 text-sm leading-7">
                Aggregated usage patterns help us understand adoption, usability friction, and
                feature value over time. For example, we may analyze completion rates for common
                flows, where users drop during setup, or which commands frequently fail because of
                environment mismatch. This allows us to prioritize fixes and improve onboarding.
                We prefer aggregate reporting over user-level profiling whenever possible.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Performance and reliability</h2>
              <p className="mt-3 text-sm leading-7">
                To keep Nap stable, we use telemetry related to error frequency, request latency,
                service availability, queue processing, and operational health. These signals help
                us identify degraded behavior quickly, reduce incident duration, and validate
                reliability improvements after deployments. Diagnostic data is also used to reproduce
                and resolve bugs reported by users and internal monitoring systems.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Security monitoring</h2>
              <p className="mt-3 text-sm leading-7">
                Security-relevant events and service activity are reviewed to detect abuse patterns,
                unauthorized access attempts, and indicators of compromise. This includes access
                anomalies, suspicious traffic signatures, and behavior inconsistent with normal
                account usage. We use these signals to enforce platform protections, respond to
                incidents, and improve preventive controls.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Support and troubleshooting</h2>
              <p className="mt-3 text-sm leading-7">
                Support workflows may use account context and relevant operational logs to investigate
                user-reported issues. Our support goal is to access the minimum data required to
                resolve the ticket and restore normal operation. Access to support tooling is
                controlled, and data handling is limited to operational needs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Retention and minimization</h2>
              <p className="mt-3 text-sm leading-7">
                Data is retained only as long as needed for service operation, compliance,
                security, support, and reasonable product improvement workflows. Retention duration
                may differ across telemetry classes. We regularly review data classes and remove
                or reduce collection where it is no longer justified.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">How this connects to your privacy</h2>
              <p className="mt-3 text-sm leading-7">
                Data usage is one part of our broader privacy approach. For details about lawful
                processing, subprocessors, user rights, and contact options, refer to the Privacy
                Policy page. Together, these documents explain both what we collect and how we
                use it in practice.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
