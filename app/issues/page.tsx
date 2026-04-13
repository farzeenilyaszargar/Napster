import CopyCommandBar from "@/components/copyCommandBar";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Image from "next/image";

export default function IssuesPage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar />
      <main className="w-full flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-0 lg:pt-28">
          <div className="flex flex-col items-center text-center">
            <h2 className="mb-3 font-pixelify text-6xl font-bold -tracking-[3px] text-[#000000] sm:text-8xl">
              issues
            </h2>
            <p className="max-w-xl text-[#919191]">
              if your experiencing any <span className="text-[#000000]">issues</span>, please let us know.
            </p>
          </div>

          <div className="mt-12 w-full max-w-3xl">
            <h2 className="py-5 text-xl font-medium sm:text-2xl">We&apos;re here to help.</h2>
            <div className="flex flex-col gap-2 lg:flex-row">
              <div className="flex w-full flex-col justify-between overflow-hidden rounded-2xl border bg-[#0F0F0F] text-white">
                <div className="gap-5 p-7">
                  <h3 className="text-xl">Mail Us</h3>
                  <p className="text-sm text-[#B8B8B8]">Copy the email address below and send us an email.</p>
                </div>
                <div className="relative">
                  <Image src="/i1.png" alt="npm" width={100} height={100} className="w-full z-0" />
                  <CopyCommandBar
                    text="issues@nap-code.com"
                    className="absolute top-[50%] left-[50%] z-10 w-[calc(100%-2rem)] max-w-xs -translate-x-1/2 -translate-y-1/2 border-0 px-4 text-sm sm:w-4/5 sm:max-w-none sm:px-7 sm:text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
