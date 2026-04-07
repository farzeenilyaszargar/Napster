import Link from "next/link";

export default function Footer() {
    return (
        <footer className="flex w-full flex-col gap-4 px-6 py-8 text-sm text-[#787878] sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-20">
            <p>Copyright © 2025 napster. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-2">
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
            <p>8 Off Western Road, 400068, Mumbai, India.</p>
        </footer>
    );
}
