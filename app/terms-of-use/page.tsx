import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function TermsOfUsePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-16 md:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-white/45">
          Terms of Use
        </p>
        <h1 className="font-pixelify text-6xl text-white">Terms of Use</h1>
        <p className="mt-4 max-w-3xl text-white/68">
          By using Napster, you agree to use the product responsibly, keep your
          account secure, and follow any applicable laws or platform rules.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <div className="space-y-6 text-white/78">
            <section>
              <h2 className="text-lg font-semibold text-white">Acceptable use</h2>
              <p className="mt-2">
                Do not use Napster to violate laws, abuse systems, or interfere
                with service integrity for other users.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-white">Accounts</h2>
              <p className="mt-2">
                You are responsible for activity under your account and for
                maintaining the confidentiality of your credentials.
              </p>
            </section>
            <section>
              <h2 className="text-lg font-semibold text-white">Availability</h2>
              <p className="mt-2">
                We may update, improve, or temporarily suspend parts of the
                service as the product evolves.
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
