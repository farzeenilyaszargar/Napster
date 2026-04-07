import CopyCommandBar from "@/components/copyCommandBar";
import SmoothScrollLink from "@/components/smoothScrollLink";
import Image from "next/image";

export default function Hero() {
    return (
        <>
        <div className="flex flex-col justify-center items-left mt-25 ">

            <div className="flex flex-row items-center justify-start gap-3 -mb-5">
                <p className="text-[#999999]">See whats new in v0.0.16</p>
                <Image src="/right-arrow.svg" alt="right arrow" width={15} height={15} className="rounded-lg" />
            </div>
            <h1 className="text-8xl font-bold text-left mt-4 font-pixelify text-[#191919]">napster</h1>
            <p className="text-[#727272]">An agentic interface that <span className="text-[#2F2F2F]">understands, plans, executes,<br></br> and iterates</span> directly against your codebase <span className="text-[#2F2F2F]">terminally.</span></p>

            <div className="flex justify-between mt-5 gap-5 ">
                <CopyCommandBar text="npm -i napster" className="w-full" />
                <SmoothScrollLink targetId="features" className="w-full flex justify-center items-center gap-1 ">Find out how it works
                <Image src="/right-arroww.png" alt="right arrow" width={20} height={20} className="rounded-lg invert" />

                </SmoothScrollLink>
            </div>
        </div>
        <Image src="/hero.png" alt="main" width={800} height={400} className="mt-20 w-5/7 rounded-lg" loading="eager"/>
    </>
    );
}
