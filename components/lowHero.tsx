import CopyCommandBar from "@/components/copyCommandBar";
import Image from "next/image";
import Link from "next/link";

export default function LowHero() {
    return (
        <div className="flex flex-col items-center justify-center py-30">
            <h2 className="font-pixelify font-bold text-6xl text-[#828282]">try. <span className="text-[#3F3F3F]">now.</span></h2>
            <div className="flex flex-col justify-between mt-10 gap-5 ">
                <CopyCommandBar text="npm -i napster" />
                <Link href="#features" className=" flex justify-center items-center gap-2">Find out how it works
                <Image src="/right-arrow.svg" alt="right arrow" width={15} height={15} className="rounded-lg" />

                </Link>
            </div>
        </div>
    );
}
