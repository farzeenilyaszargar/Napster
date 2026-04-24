"use client";

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
                {copied ? (
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <rect x="7" y="7" width="9" height="9" rx="2" />
                        <rect x="4" y="4" width="9" height="9" rx="2" />
                    </svg>
                )}
            </span>
        </button>
    );
}
