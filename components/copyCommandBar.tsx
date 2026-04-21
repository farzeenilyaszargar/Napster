"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type CopyCommandBarProps = {
    className?: string;
    text: string;
};

const CLIPBOARD_TIMEOUT_MS = 180;

async function copyText(text: string) {
    if (window.isSecureContext && navigator.clipboard?.writeText) {
        let timeoutId: number | null = null;

        try {
            await Promise.race([
                navigator.clipboard.writeText(text),
                new Promise<never>((_, reject) => {
                    timeoutId = window.setTimeout(() => {
                        reject(new Error("Clipboard write timed out"));
                    }, CLIPBOARD_TIMEOUT_MS);
                }),
            ]);
            return;
        } catch {
            // Fall back to execCommand for browsers that block clipboard APIs.
        } finally {
            if (timeoutId !== null) {
                window.clearTimeout(timeoutId);
            }
        }
    }

    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    textArea.setSelectionRange(0, textArea.value.length);
    const copied = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (!copied) {
        throw new Error("Copy failed");
    }
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
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
        }

        setCopied(true);

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
            className={`flex items-center justify-center gap-2 rounded-2xl border bg-black p-2 px-7 text-white transition hover:opacity-90 ${className}`}
            aria-label={`Copy command: ${text}`}
        >
            <span>{text}</span>
            <span className="flex items-center gap-2">
                {
                    copied ? 
                    <Image
                        src="/tick.png"
                        alt="Copied"
                        width={16}
                        height={17}
                        className="invert"
                        style={{ height: "auto" }}
                        aria-hidden="true"
                    />
                    :
                    <Image
                        src="/copy.svg"
                        alt="Copy"
                        width={15}
                        height={15}
                        className="invert"
                        style={{ height: "auto" }}
                        aria-hidden="true"
                    />
                }
                
            </span>
        </button>
    );
}
