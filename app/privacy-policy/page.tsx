import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FCFCFC]">
      <Navbar />
      <main className="w-full flex-1">
        <div className="mx-auto flex sm:w-4/7 flex-col px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-0 lg:pt-28">
          <div className="flex flex-col items-center text-center">
            <h1 className="mb-3 font-pixelify text-5xl font-bold -tracking-[3px] text-[#000000] sm:text-7xl">
              privacy policy
            </h1>
            <p className="max-w-2xl text-[#919191]">
              How Nap handles the information needed to{" "}
              <span className="text-[#000000]">operate, support, and improve</span> the product.
            </p>
          </div>

          <div className="mt-12 w-full space-y-8 text-[#5B5B5B]">
            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Overview</h2>
              <p className="mt-3 text-sm leading-7">
                This Privacy Policy explains how Nap collects, uses, stores, and protects
                information when you use our website, CLI, and related services. We designed this
                policy to be plain, practical, and easy to read. Our goal is to collect only what
                we need to provide a stable product, secure user accounts, and improve your
                developer experience over time. We do not treat user data as a product for sale,
                and we do not sell personal information to third parties for advertising or
                profiling. By using Nap, you agree to the data handling practices described here.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">What we collect</h2>
              <p className="mt-3 text-sm leading-7">
                We collect information in three broad categories. First, account and identity data
                such as email address, authentication identifiers, and basic profile details needed
                to create and secure your account. Second, operational and usage data such as
                feature interactions, command metadata, error traces, and performance diagnostics so
                we can understand system health and reliability. Third, support and communication
                data you provide directly, including messages sent through support channels. We
                avoid collecting unnecessary sensitive data, and we limit processing to legitimate
                product and security purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">How we use it</h2>
              <p className="mt-3 text-sm leading-7">
                We use collected data to deliver the service you requested, including authentication
                flows, session management, product functionality, billing and account operations,
                and customer support. We also use technical diagnostics to detect bugs, improve
                latency, and maintain uptime. Security-related data is used to prevent abuse,
                investigate suspicious behavior, and protect infrastructure. Aggregated or
                de-identified usage patterns may be analyzed to prioritize roadmap decisions and
                improve onboarding and documentation. We do not use your personal data for unrelated
                purposes that conflict with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Sharing and subprocessors</h2>
              <p className="mt-3 text-sm leading-7">
                We may share data with trusted service providers only when needed to operate Nap,
                such as hosting, authentication, transactional email, payment processing, analytics,
                and support tooling. These providers act as processors under contractual controls and
                are expected to protect data appropriately. We do not authorize these providers to
                sell your data or use it for unrelated advertising. We may also disclose information
                if required by law, legal process, or a valid governmental request, and when needed
                to enforce our terms or protect users and the service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Retention and security</h2>
              <p className="mt-3 text-sm leading-7">
                We retain information only as long as necessary for service delivery, support,
                legal compliance, security, and legitimate operational needs. Retention periods may
                vary by data type and context. We use layered security practices that may include
                access controls, encryption in transit, secret management, logging, and incident
                response procedures. No system is perfectly secure, but we continuously improve our
                controls to reduce risk and respond quickly to issues.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Your choices and contact</h2>
              <p className="mt-3 text-sm leading-7">
                You can contact us for account-related questions, support, or privacy requests. If
                applicable law provides rights such as access, correction, deletion, or objection,
                we will review and respond within a reasonable timeframe. We may need to verify your
                identity before acting on certain requests. If we make material updates to this
                policy, we will publish the revised version with an updated effective date and, when
                appropriate, provide product notice. Continued use of Nap after updates indicates
                acceptance of the revised policy.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
