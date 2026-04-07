import Link from "next/link";

export default function Footer() {
    return (
        <div className="flex flex-row items-center justify-between w-full text-sm py-3 px-35 pt-10 text-[#787878]">
            <p>Copyright © 2025 napster. All rights reserved.</p>
            <div className="flex gap-2">
                <Link href={"#"}>Privacy Policy</Link> 
                <p>|</p>
                <Link href={"#"}>Terms of Use</Link>
                <p>|</p>
                <Link href={"#"}>Data Usage</Link> 

            </div>
            <p>8 Off Western Road, 400068, Mumbai, India.</p>
        </div>
    );
}