"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type CopyCommandBarProps = {
  text: string;
  className?: string;
};

async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";

  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export default function CopyCommandBar({
  text,
  className = "",
}: CopyCommandBarProps) {
  const [status, setStatus] = useState<"idle" | "copied">("idle");
  const [feedbackVersion, setFeedbackVersion] = useState(0);
  const resetTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current);
      }
    };
  }, []);

  const startResetTimer = (delay: number) => {
    if (resetTimeoutRef.current) {
      window.clearTimeout(resetTimeoutRef.current);
    }

    resetTimeoutRef.current = window.setTimeout(() => {
      setStatus("idle");
    }, delay);
  };

  const handleCopy = async () => {
    setStatus("copied");
    setFeedbackVersion((current) => current + 1);
    startResetTimer(700);

    try {
      await writeClipboard(text);
    } catch {}
  };

  const displayText = status === "copied" ? "copied!" : text;

  return (
    <div className={`flex items-center ${className}`}>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={status === "copied" ? "Copied command" : "Copy command"}
        className="relative min-w-0 text-left"
      >
        <span aria-hidden="true" className="invisible block px-2 pl-4 whitespace-nowrap">
          {text}
        </span>
        <p
          aria-live="polite"
          className={`absolute inset-0 flex items-center px-2 pl-4 whitespace-nowrap ${
            status === "copied" ? "text-neutral-700" : "text-black"
          }`}
        >
          <span
            key={`${status}-${feedbackVersion}`}
            className={status === "idle" ? "" : "copy-feedback-pop"}
          >
            {displayText}
          </span>
        </p>
      </button>
      <button
        type="button"
        onClick={handleCopy}
        aria-label={status === "copied" ? "Copied command" : "Copy command"}
        title={status === "copied" ? "Copied" : "Copy command"}
        className={`ml-4 p-4 rounded transition-colors ${
          status === "copied"
            ? "bg-gray-700"
            : "bg-gray-800 hover:bg-gray-700"
        }`}
      >
        <span
          key={`button-${status}-${feedbackVersion}`}
          className={`block ${status === "idle" ? "" : "copy-button-pop"}`}
        >
          <Image
            src={"/copy01.png"}
            alt=""
            width={20}
            height={20}
            className={`invert ${status === "idle" ? "opacity-100" : "opacity-80"}`}
          />
        </span>
      </button>
    </div>
  );
}
