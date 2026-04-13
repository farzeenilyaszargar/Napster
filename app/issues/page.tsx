import BaseHero from "@/components/baseHero";
import CopyCommandBar from "@/components/copyCommandBar";
import Footer from "@/components/footer";

import Navbar from "@/components/navbar";
import Image from "next/image";
import Link from "next/link";

export default function InstallPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between items-center">
      <Navbar />
      <div className="flex flex-col justify-center items-center px-30 gap-20 -mt-20">
      <div className="flex flex-col justify-center items-center px-30 ">

        {/* <div className="flex flex-row items-center justify-start gap-3 -mb-5">
                <p className="text-[#999999] text-sm sm:text-lg">See whats new in v0.0.16</p>
                <Image src="/right-arrow.svg" alt="right arrow" width={15} height={15} className="rounded-lg w-2.5 sm:w-3" />
            </div> */}
        <h2 className="text-6xl sm:text-8xl font-bold text-center mb-3 font-pixelify text-[#000000] -tracking-[3px]">issues</h2>
        <p className="text-[#919191]">if your experiencing any <span className="text-[#000000]">issues</span>, please let us know.</p>


      </div>
      <div className=" w-2/3">
        <div className="flex lg:flex-row flex-col gap-2 justify-between">
          {/* first box */}
          <div className="flex flex-col border rounded-2xl bg-[#0F0F0F] text-white overflow-hidden w-full justify-between">
            <div className="p-7 gap-5">

              <h3 className="text-xl">Mail Us</h3>
              <p className="text-sm text-[#B8B8B8]">Copy the email address below and send us an email.</p>
            </div>
            <div className="relative">

              <Image src="/i1.png" alt="npm" width={100} height={100} className=" w-full z-0" />
              <CopyCommandBar text="issues@nap-code.com" className="w-2/3 z-10 border-0 absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>

          

        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
