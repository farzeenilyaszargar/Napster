"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type CopyCommandBarProps = {
    className?: string;
    text: string;
};

async function copyText(text: string) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "absolute";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
}

export default function CopyCommandBar({
    className = "",
    text,
}: CopyCommandBarProps) {
    const [copied, setCopied] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                window.clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    const handleCopy = async () => {
        setCopied(true);

        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
        }

        try {
            await copyText(text);

            timeoutRef.current = window.setTimeout(() => {
                setCopied(false);
            }, 1200);
        } catch {
            setCopied(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center justify-center gap-2 rounded-full border bg-white p-2 px-7 text-black transition hover:opacity-90 ${className}`}
            aria-label={`Copy command: ${text}`}
        >
            <span>{copied ? "Copied!" : text}</span>
            <span className="flex items-center gap-2">
                <Image
                    src="/copy.svg"
                    alt=""
                    width={15}
                    height={15}
                    className="rounded-lg"
                    aria-hidden="true"
                />
            </span>
        </button>
    );
}
