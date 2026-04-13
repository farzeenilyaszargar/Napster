import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function TermsOfUsePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FCFCFC]">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-16 md:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-[#8B8B8B]">
          Terms of Use
        </p>
        <h1 className="mt-3 font-pixelify text-5xl text-black sm:text-6xl">Terms of Use</h1>
        <p className="mt-4 max-w-3xl text-[#707070] leading-7">
          By using Napster, you agree to use the product responsibly, keep your
          account secure, and follow any applicable laws or platform rules.
        </p>

        <div className="mt-10 rounded-[28px] border border-black/8 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)] sm:p-8">
          <div className="space-y-6 text-[#5F5F5F] leading-7">
            <section>
              <h2 className="text-lg font-semibold text-black">Acceptable use</h2>
              <p className="mt-2">
                Do not use Napster to violate laws, abuse systems, or interfere
                with service integrity for other users.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-black">Accounts</h2>
              <p className="mt-2">
                You are responsible for activity under your account and for
                maintaining the confidentiality of your credentials.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-black">Availability</h2>
              <p className="mt-2">
                We may update, improve, or temporarily suspend parts of the
                service as the product evolves.
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
