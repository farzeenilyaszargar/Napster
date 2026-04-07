import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Link from "next/link";

export default function InstallPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-16 md:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-white/45">Install</p>
        <h1 className="font-pixelify text-6xl text-white">Get Napster Running</h1>
        <p className="mt-4 max-w-2xl text-white/68">
          Start with the package install, then open the project directory and run
          the app in development.
        </p>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm">
          <p className="text-sm uppercase tracking-[0.24em] text-white/45">Command</p>
          <code className="mt-3 block rounded-2xl border border-white/10 bg-black/60 px-4 py-4 text-base text-white">
            npm -i napster
          </code>
          <p className="mt-6 text-sm uppercase tracking-[0.24em] text-white/45">Next</p>
          <code className="mt-3 block rounded-2xl border border-white/10 bg-black/60 px-4 py-4 text-base text-white">
            npm run dev
          </code>
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
