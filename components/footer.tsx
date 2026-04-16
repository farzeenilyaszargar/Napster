import Link from "next/link";

export default function Footer() {
    return (
        <footer className="flex sm:w-5/7 gap-4 my-2 py-3 text-xs text-[#787878] justify-between items-center font-ubuntu ">
            <p>Copyright © 2026 Nap. All Rights Reserved.</p>
            <div className=" flex-wrap items-center gap-2 hidden sm:flex">
                <Link href="/privacy-policy" className="transition hover:text-[#9A9A9A]">
                    Privacy Policy
                </Link>
                <p>|</p>
                <Link href="/terms-of-use" className="transition hover:text-[#9A9A9A]">
                    Terms of Use
                </Link>
                <p>|</p>
                <Link href="/data-usage" className="transition hover:text-[#9A9A9A]">
                    Data Usage
                </Link>
            </div>
            <p className="hidden sm:block">8 Off Western Road, 400068, Mumbai, India.</p>
        </footer>
    );
}
