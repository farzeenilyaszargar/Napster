import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-[#FCFCFC]">
      <Navbar />
      <main className="w-full flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-0 lg:pt-28">
          <div className="flex flex-col items-center text-center">
            <h1 className="mb-3 font-pixelify text-5xl font-bold -tracking-[3px] text-[#000000] sm:text-7xl">
              privacy policy
            </h1>
            <p className="max-w-2xl text-[#919191]">
              How Nap handles the information needed to{" "}
              <span className="text-[#000000]">operate, support, and improve</span> the product.
            </p>
          </div>

          <div className="mt-12 flex w-full justify-center">
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl border bg-[#0F0F0F] text-white">
              <div className="space-y-8 p-7 sm:p-9">
                <section>
                  <h2 className="text-xl font-semibold text-white">What we collect</h2>
                  <p className="mt-3 text-sm leading-7 text-[#B8B8B8]">
                    Basic account details, product usage signals, and technical logs that help us
                    keep Napster stable and secure.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-white">How we use it</h2>
                  <p className="mt-3 text-sm leading-7 text-[#B8B8B8]">
                    We use collected information to run the service, diagnose issues, protect the
                    platform, and improve the developer experience.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-white">Your control</h2>
                  <p className="mt-3 text-sm leading-7 text-[#B8B8B8]">
                    You can reach out to request account-related help or clarification on stored
                    information and retention practices.
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
