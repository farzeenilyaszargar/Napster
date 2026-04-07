import Image from "next/image";

export default function Trust() {
  return (
    <div className="w-screen flex flex-col items-center justify-center py-16 gap-20">
      <p className="text-xl text-gray-500">Developers from these companies use Napster</p>
      <div className="w-5/7 grid grid-cols-5 gap-x-20 grayscale contrast-1000 brightness-0 opacity-70 ">
        <Image src="/trust1.svg" alt="Trust 1" width={150} height={150} className="h-full w-full object-contain "/>
        <Image src="/trust2.png" alt="Trust 2" width={150} height={150} className="h-full w-full object-contain "/>
        <Image src="/trust3.png" alt="Trust 3" width={150} height={150} className="h-full w-full object-contain"/>
        <Image src="/trust4.png" alt="Trust 4" width={150} height={150} className="h-full w-full object-contain"/>
        <Image src="/trust5.png" alt="Trust 4" width={150} height={150} className="h-full w-full object-contain"/>

      </div>
    </div>
  );
}