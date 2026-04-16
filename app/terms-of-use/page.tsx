import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function TermsOfUsePage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FCFCFC]">
      <Navbar />
      <main className="w-full flex-1">
        <div className="mx-auto flex sm:w-4/7 flex-col px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-0 lg:pt-28">
          <div className="flex flex-col items-center text-center">
            <h1 className="mb-3 font-pixelify text-5xl font-bold -tracking-[3px] text-[#000000] sm:text-7xl">
              terms of use
            </h1>
            <p className="max-w-2xl text-[#919191]">
              The ground rules for using Nap responsibly, keeping your account{" "}
              <span className="text-[#000000]">secure</span>, and respecting the platform.
            </p>
          </div>

          <div className="mt-12 w-full space-y-8 text-[#5B5B5B]">
            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Agreement and scope</h2>
              <p className="mt-3 text-sm leading-7">
                These Terms of Use govern your access to and use of Nap, including related website
                pages, CLI features, and connected services. By accessing or using Nap, you agree
                to these terms and any additional policies referenced here. If you do not agree,
                you should discontinue use. These terms are intended to set clear expectations
                around product usage, safety, account responsibilities, and service limitations.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Acceptable use</h2>
              <p className="mt-3 text-sm leading-7">
                You agree to use Nap lawfully and responsibly. You may not use the service to
                violate applicable laws, abuse infrastructure, disrupt other users, attempt
                unauthorized access, or distribute harmful content or malware. Automated scraping,
                credential abuse, reverse engineering for harmful purposes, and behavior intended to
                degrade platform integrity are prohibited. We may investigate misuse and take
                protective action, including temporary or permanent restriction of access.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Accounts</h2>
              <p className="mt-3 text-sm leading-7">
                You are responsible for activity under your account and for maintaining credential
                confidentiality. You should use strong authentication practices and notify us
                promptly if you suspect unauthorized access. Account sharing may be restricted by
                plan type or security requirements. You remain accountable for commands, requests,
                and related activity executed through your authenticated session.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Content and inputs</h2>
              <p className="mt-3 text-sm leading-7">
                You are responsible for the legality and appropriateness of materials you submit to
                Nap, including prompts, files, and repository context. You represent that you have
                rights to use submitted content and that such use does not violate third-party
                rights. We do not claim ownership of your underlying content, but we may process it
                as required to deliver features, support operations, and maintain security.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Availability</h2>
              <p className="mt-3 text-sm leading-7">
                Nap is provided on an evolving basis. We may update, improve, limit, or temporarily
                suspend portions of the service for maintenance, reliability, or security reasons.
                While we aim for high availability, uninterrupted service is not guaranteed. Planned
                and emergency changes may affect behavior, latency, or feature access.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Disclaimers and liability</h2>
              <p className="mt-3 text-sm leading-7">
                To the extent permitted by law, Nap is provided as-is and as-available without
                warranties of merchantability, fitness for a particular purpose, or non-infringement.
                We are not liable for indirect, incidental, special, consequential, or punitive
                damages arising from your use of the service. You should independently review and
                validate critical outputs before production use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#111111]">Changes and contact</h2>
              <p className="mt-3 text-sm leading-7">
                We may revise these terms as the product and legal requirements evolve. Updated
                versions are effective when published, unless a different effective date is stated.
                Continued use of Nap after updates indicates acceptance of the revised terms. If you
                have questions about these terms or account-related concerns, please contact our
                support channels.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
