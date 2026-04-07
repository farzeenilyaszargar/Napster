"use client";

import { useState } from "react";

const faqs = [
    {
        question: "Can I run multiple napster agents at a time?",
        answer:
            "Yes. Napster is built for parallel workflows, so you can run multiple agents at the same time across different tasks or parts of your codebase.",
    },
    {
        question: "What models does napster support?",
        answer:
            "Napster is designed to work with multiple AI models, giving you flexibility to choose the setup that best fits your workflow.",
    },
    {
        question: "How to install napster?",
        answer:
            "You can install Napster with the command shown on the site: curl -fsSL https://napster.sh/install.sh | bash",
    },
    {
        question: "Does napster supports worktrees?",
        answer:
            "Yes. Napster supports worktrees, making it easier to isolate changes, test ideas, and keep parallel work organized.",
    },
    {
        question: "Can I run it remotely using SSH?",
        answer:
            "Yes. You can run Napster remotely over SSH as long as your environment and repository are available on the target machine.",
    },
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="mt-12 flex w-5/7 justify-center sm:mt-20">
            <div className="w-full px-4 py-6 sm:px-10 sm:py-10 font-ubuntu">
                <h2 className="m-5 py-5 text-2xl font-bold text-[#424242] sm:py-7 sm:text-left sm:text-3xl">
                    Faqs
                </h2>
                <div className="m-5">
                    {faqs.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <div
                                key={faq.question}
                                className={index === faqs.length - 1 ? "" : "border-b border-[#282828]"}
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpenIndex(isOpen ? null : index)}
                                    aria-expanded={isOpen}
                                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                                >
                                    <span className="text-base font-normal text-[#424242] sm:text-lg">
                                        {faq.question}
                                    </span>
                                    <span
                                        aria-hidden="true"
                                        className="shrink-0 text-2xl leading-none font-normal text-[#424242]"
                                    >
                                        {isOpen ? "-" : "+"}
                                    </span>
                                </button>
                                {isOpen ? (
                                    <p className="pb-5 pr-10 text-sm font-normal leading-relaxed text-[#727272] sm:text-base">
                                        {faq.answer}
                                    </p>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
