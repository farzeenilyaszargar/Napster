import CopyCommandBar from "@/components/copyCommandBar";
import Image from "next/image";
import SmoothScrollLink from "@/components/smoothScrollLink";

export default function LowHero() {
    return (
        <div className="flex flex-col items-center justify-center py-30">
            <h2 className="font-pixelify font-bold text-6xl text-[#828282]">try. <span className="text-[#3F3F3F]">now.</span></h2>
            <div className="flex flex-col justify-between mt-10 gap-5 ">
                <CopyCommandBar text="npm -i napster" />
                <SmoothScrollLink targetId="features" className=" flex justify-center items-center gap-1">Find out how it works
                <Image src="/right-arroww.png" alt="right arrow" width={20} height={20} className="rounded-lg invert" />

                </SmoothScrollLink>
            </div>
        </div>
    );
}
