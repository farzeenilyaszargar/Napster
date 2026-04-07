import Image from "next/image";
import Link from "next/link";

export default function LowHero() {
    return (
        <div className="flex flex-col items-center justify-center py-30">
            <h2 className="font-pixelify font-bold text-6xl text-[#828282]">try. <span className="text-[#3F3F3F]">now.</span></h2>
            <div className="flex flex-col justify-between mt-10 gap-5 ">
                <div className="border p-2 px-7 rounded-full flex bg-white text-black ">npm -i napster
                    <Image src="/copy.svg" alt="copy" width={15} height={15} className="ml-2 rounded-lg" />
                </div>
                <Link href={"#"} className=" flex justify-center items-center gap-2">Find out how it works
                <Image src="/right-arrow.svg" alt="right arrow" width={15} height={15} className="rounded-lg" />

                </Link>
            </div>
        </div>
    );
}