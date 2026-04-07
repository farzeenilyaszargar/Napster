import CopyCommandBar from "@/components/copyCommandBar";

export default function LowerHero() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-40 gap-5">
      <h2 className="text-7xl">Try Napster Now.</h2>
      <div className="font-mono text-lg bg-gray-200 mt-10 flex items-center rounded">
        <CopyCommandBar text="curl -fsSL https://napster.sh/install.sh" className="flex items-center" />
      </div>
    </div>
  );
}
