import CopyCommandBar from "@/components/copyCommandBar";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Image from "next/image";

export default function IssuesPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between">
      <Navbar />
      <div className="flex flex-col items-center justify-center px-5 py-20 sm:px-30 sm:py-0">
        <h2 className="mb-3 text-center font-pixelify text-6xl font-bold -tracking-[3px] text-[#000000] sm:text-8xl">
          issues
        </h2>
        <p className="max-w-xl text-center text-[#919191]">
          if your experiencing any <span className="text-[#000000]">issues</span>, please let us know.
        </p>
      </div>
      <div className="w-full sm:w-1/2 px-5 pb-20 sm:px-8 lg:px-0">
        <div className="flex flex-col justify-between gap-2 lg:flex-row">
          {/* first box */}
          <div className="flex flex-col border rounded-2xl bg-[#0F0F0F] text-white overflow-hidden w-full justify-between">
            <div className="p-7 gap-5">
              <h3 className="text-xl">Mail Us</h3>
              <p className="text-sm text-[#B8B8B8]">Copy the email address below and send us an email.</p>
            </div>
            <div className="relative">
              <Image src="/i1.png" alt="npm" width={100} height={100} className=" w-full z-0" />
              <CopyCommandBar
                text="issues@nap-code.com"
                className="absolute top-[50%] left-[50%] z-10 w-[calc(100%-2rem)] max-w-xs -translate-x-1/2 -translate-y-1/2 border-0 px-4 text-sm sm:w-4/5 sm:max-w-none sm:px-7 sm:text-base"
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
