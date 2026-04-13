import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FCFCFC]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-16 md:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8B8B8B]">
          Privacy Policy
        </p>
        <h1 className="mt-3 font-pixelify text-5xl text-black sm:text-6xl">Privacy Policy</h1>
        <p className="mt-4 max-w-3xl text-[#707070] leading-7">
          Napster only collects the information needed to operate the product,
          improve reliability, and support your account. We do not sell personal
          data, and we keep access limited to operational and support use cases.
        </p>

        <div className="mt-10 rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8">
          <div className="space-y-6 text-[#5F5F5F] leading-7">
            <section>
              <h2 className="text-lg font-semibold text-black">What we collect</h2>
              <p className="mt-2">
                Basic account details, product usage signals, and technical logs
                that help us keep Napster stable and secure.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-black">How we use it</h2>
              <p className="mt-2">
                We use collected information to run the service, diagnose issues,
                protect the platform, and improve the developer experience.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-black">Your control</h2>
              <p className="mt-2">
                You can reach out to request account-related help or clarification
                on stored information and retention practices.
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
