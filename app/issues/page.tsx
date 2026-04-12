import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import Link from "next/link";

const issueItems = [
  "CLI install path still needs clearer onboarding copy.",
  "A few surfaces are placeholders and need production content.",
  "Menu routes are now in place, but page detail can be expanded next.",
];

export default function IssuesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 py-16 md:px-10">
        <p className="text-sm uppercase tracking-[0.28em] text-[#ababab]">Issues</p>
        <h1 className="font-pixelify text-6xl text-[#232323]">Current Issues</h1>
        <p className="mt-4 max-w-2xl text-[#727272]">
          A simple placeholder page for tracking rough edges and what should be
          fixed next.
        </p>

        <div className="mt-10 rounded-3xl border border-black/8 bg-[#fbfbfb] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-sm">
          <ul className="space-y-4">
            {issueItems.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-black/8 bg-white px-4 py-4 text-[#4f4f4f] shadow-[0_10px_30px_rgba(0,0,0,0.04)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <Link
          href="/"
          className="mt-10 inline-flex w-fit items-center rounded-full border border-black/8 bg-white px-5 py-3 text-sm text-[#4f4f4f] transition hover:border-black/12 hover:bg-black/3 hover:text-[#111111]"
        >
          Back to overview
        </Link>
      </main>
      <Footer />
    </div>
  );
}
