import Image from "next/image";
import CopyCommandBar from "@/components/copyCommandBar";
import PixelShimmerText from "@/components/pixelShimmerText";

export default function Hero() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-35 gap-3">
      <PixelShimmerText text="napster" className="text-[150px] font-bold -mb-20" />
      <p>Nap is the best way to code with AI and run multiple agents on your PC.</p>
      <div className="font-mono text-md bg-gray-200 mt-10 flex items-center rounded">
        <CopyCommandBar
          text="curl -fsSL https://napster.sh/install.sh | bash"
        />
      </div>
      <Image src="/main.webp" alt="Terminal" width={800} height={400} className="mt-10 w-5/7 rounded-lg"/>
    </div>
  );
}
