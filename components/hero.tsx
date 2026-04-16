import CopyCommandBar from "@/components/copyCommandBar";
import SmoothScrollLink from "@/components/smoothScrollLink";
import Image from "next/image";

export default function Hero() {
    return (
        <>
        <div className="flex flex-col justify-center items-center mt-25 sm:px-30 px-10 ">

            {/* <div className="flex flex-row items-center justify-start gap-3 -mb-5">
                <p className="text-[#999999] text-sm sm:text-lg">See whats new in v0.0.16</p>
                <Image src="/right-arrow.svg" alt="right arrow" width={15} height={15} className="rounded-lg w-2.5 sm:w-3" />
            </div> */}
            <h2 className="text-5xl sm:text-7xl font-bold sm:text-center text-left mb-3 font-pixelify  -tracking-[3px] text-black">napster</h2>
            <p className="text-[#919191] text-xs sm:text-sm text-center sm:w-1/2">an agentic interface that <span className="text-[#000000]">understands, plans, executes, and iterates</span> directly against your codebase <span className="text-[#000000]">terminally.</span></p>

            <div className="flex flex-col justify-center mt-10 gap-5 ">
                <CopyCommandBar text="npm i -g napster-cli" className="w-full hidden sm:flex" />
                <SmoothScrollLink targetId="features" className=" flex justify-center items-center gap-1 sm:text-lg text-sm">Find out how it works
                <Image src="/right-arroww.png" alt="right arrow" width={20} height={20} className="rounded-lg" />

                </SmoothScrollLink>
            </div>
        </div>
        <video
            className="pointer-events-none sm:mt-15 mt-5 sm:w-5/7 sm:p-0 p-3 rounded-lg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            disablePictureInPicture
        >
            <source src="/demo.mp4" type="video/mp4" />
        </video>
    </>
    );
}
