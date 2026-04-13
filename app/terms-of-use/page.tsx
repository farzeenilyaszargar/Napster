import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function TermsOfUsePage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FCFCFC]">
      <Navbar />
      <main className="w-full flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-0 lg:pt-28">
          <div className="flex flex-col items-center text-center">
            <h1 className="mb-3 font-pixelify text-5xl font-bold -tracking-[3px] text-[#000000] sm:text-7xl">
              terms of use
            </h1>
            <p className="max-w-2xl text-[#919191]">
              The ground rules for using Nap responsibly, keeping your account{" "}
              <span className="text-[#000000]">secure</span>, and respecting the platform.
            </p>
          </div>

          <div className="mt-12 flex w-full justify-center">
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl border bg-[#0F0F0F] text-white">
              <div className="space-y-8 p-7 sm:p-9">
                <section>
                  <h2 className="text-xl font-semibold text-white">Acceptable use</h2>
                  <p className="mt-3 text-sm leading-7 text-[#B8B8B8]">
                    Do not use Napster to violate laws, abuse systems, or interfere with service
                    integrity for other users.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-white">Accounts</h2>
                  <p className="mt-3 text-sm leading-7 text-[#B8B8B8]">
                    You are responsible for activity under your account and for maintaining the
                    confidentiality of your credentials.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-white">Availability</h2>
                  <p className="mt-3 text-sm leading-7 text-[#B8B8B8]">
                    We may update, improve, or temporarily suspend parts of the service as the
                    product evolves.
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
