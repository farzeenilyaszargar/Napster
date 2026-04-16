import CopyCommandBar from "@/components/copyCommandBar";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Image from "next/image";

export default function InstallPage() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Navbar />
      <main className="w-full flex-1">
        <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 lg:px-0 lg:pt-28">
          <div className="flex flex-col items-center text-center">
            <h2 className="mb-3 font-pixelify text-5xl font-bold -tracking-[3px] text-[#000000] sm:text-7xl">
              install
            </h2>
            <p className="max-w-xl text-[#919191]">
              Go to your <span className="text-[#000000]">terminal</span> and run the following{" "}
              <span className="text-[#000000]">commands</span>
            </p>
          </div>

          <div className="mt-12 w-full">
            <h2 className="py-5 text-xl font-medium sm:text-2xl">Just a click away.</h2>
            <div className="flex flex-col gap-2 lg:flex-row">
              <div className="flex w-full flex-col justify-between overflow-hidden rounded-2xl border bg-[#0F0F0F] text-white">
                <div className="gap-5 p-7">
                  <h3 className="text-xl">Install</h3>
                  <p className="text-sm text-[#B8B8B8]">Install the nap CLI with npm package</p>
                </div>
                <div className="relative">
                  <Image src="/i1.png" alt="npm" width={100} height={100} className="w-full z-0" unoptimized/>
                  <CopyCommandBar
                    text="npm i -g napster-cli"
                    className="absolute top-[50%] left-[50%] z-10 w-4/5 -translate-x-1/2 -translate-y-1/2 border-0"
                  />
                </div>
              </div>

              <div className="flex w-full flex-col justify-between overflow-hidden rounded-2xl border bg-[#0F0F0F] text-white">
                <div className="gap-5 p-7">
                  <h3 className="text-xl">Run</h3>
                  <p className="text-sm text-[#B8B8B8]">
                    Run nap in a terminal to inspect your codebases, edit files, and run commands.
                  </p>
                </div>
                <div className="relative">
                  <Image src="/i2.png" alt="npm" width={100} height={100} className="w-full z-0" unoptimized />
                  <CopyCommandBar
                    text='Run “napster”'
                    className="absolute top-[50%] left-[50%] z-10 w-4/5 -translate-x-1/2 -translate-y-1/2 border-0"
                  />
                </div>
              </div>

              <div className="flex w-full flex-col justify-between overflow-hidden rounded-2xl border bg-[#0F0F0F] text-white">
                <div className="gap-5 p-7">
                  <h3 className="text-xl">Updates</h3>
                  <p className="text-sm text-[#B8B8B8]">For newer versions updated regularly, run:</p>
                </div>
                <div className="relative">
                  <Image src="/i3.png" alt="npm" width={100} height={100} className="w-full z-0" unoptimized/>
                  <CopyCommandBar
                    text="npm update napster-cli"
                    className="absolute top-[50%] left-[50%] z-10 w-4/5 -translate-x-1/2 -translate-y-1/2 border-0"
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
