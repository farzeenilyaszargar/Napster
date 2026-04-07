"use client";

import { ReactNode } from "react";

type SmoothScrollLinkProps = {
    children: ReactNode;
    className?: string;
    targetId: string;
};

export default function SmoothScrollLink({
    children,
    className = "",
    targetId,
}: SmoothScrollLinkProps) {
    const handleClick = () => {
        const target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        target.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <button type="button" onClick={handleClick} className={className}>
            {children}
        </button>
    );
}
