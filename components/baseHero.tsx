import CopyCommandBar from "@/components/copyCommandBar";
import SmoothScrollLink from "@/components/smoothScrollLink";
import Image from "next/image";

export default function BaseHero() {
    return (
        <>
        <div className="flex flex-col justify-center items-center px-30 ">

            {/* <div className="flex flex-row items-center justify-start gap-3 -mb-5">
                <p className="text-[#999999] text-sm sm:text-lg">See whats new in v0.0.16</p>
                <Image src="/right-arrow.svg" alt="right arrow" width={15} height={15} className="rounded-lg w-2.5 sm:w-3" />
            </div> */}
            <h2 className="text-6xl sm:text-8xl font-bold text-center mb-3 font-pixelify text-[#000000] -tracking-[3px]">nap</h2>
            <p className="text-[#919191]">An agentic interface that <span className="text-[#000000]">understands, plans, executes,<br></br> and iterates</span> directly against your codebase <span className="text-[#000000]">terminally.</span></p>

            
        </div>

    </>
    );
}
