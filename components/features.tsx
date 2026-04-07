import Image from "next/image";

export default function Features() {
  return (
    <div className="w-screen flex flex-col items-center justify-center py-30 gap-20">
      <div className="border flex w-5/7 rounded-xl p-5 gap-10">
        <div className="p-10">
            <h2 className="text-3xl font-medium pb-5">Feature 1</h2>
            <p className="text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <Image src="/main.webp" alt="Feature 1" width={600} height={500} className="h-full w-auto rounded-2xl"/>
      </div>
      <div className="border flex w-5/7 rounded-xl p-10 gap-10">
        <Image src="/main.webp" alt="Feature 2" width={600} height={500} className="h-full w-auto rounded-2xl"/>
        <div className="p-10">
            <h2 className="text-3xl font-medium pb-5">Feature 2</h2>
            <p className="text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
      </div>
      <div className="border flex w-5/7 rounded-xl p-10 gap-10">
        <div className="p-10">
            <h2 className="text-3xl font-medium pb-5">Feature 3</h2>
            <p className="text-xl">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <Image src="/main.webp" alt="Feature 3" width={600} height={500} className="h-full w-auto rounded-2xl" />
      </div>
    </div>
  );
}
