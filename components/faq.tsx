import Image from "next/image";

export default function FAQ() {
    const faqs = [
        {
            question: "Is this app free?",
            answer:
                "Yes, it’s free for everyone, and AI is included. Start right away without a card.",
        },
        {
            question: "Are there worktrees in this?",
            answer:
                "Yes. Create worktrees to keep changes isolated and switch contexts fast.",
        },
        {
            question: "What are parallel agents and how do I use them here?",
            answer:
                "Parallel agents let you split work across tasks at the same time. Assign a goal to each agent and review results before merging.",
        },
        {
            question: "How do commits work in this app?",
            answer:
                "Review changes, stage what you want, and commit per task or branch for clean history.",
        },
    ];

    return (
        <div className="flex justify-center items-center w-full overflow-hidden mt-12 sm:mt-20">
            <div className="w-full max-w-4xl px-4 py-6 sm:px-10 sm:py-10 space-y-5 sm:space-y-6">
                <h2 className="text-2xl sm:text-3xl py-5 sm:py-7 font-normal m-5 sm:text-center text-black">Frequently Asked Questions</h2>
                <div className="space-y-6 sm:space-y-7 m-5">
                    {faqs.map((faq, index) => (
                        <div key={index} className="text-left">
                            <p className="text-base sm:text-lg font-medium text-black">{faq.question}</p>
                            <div className="mt-2 flex items-start gap-3 text-gray-600">
                                <Image
                                    src="/down-left.png"
                                    alt=""
                                    width={12}
                                    height={12}
                                    className="-scale-x-100 mt-1 h-3 w-3 shrink-0"
                                />
                                <p className="text-sm sm:text-base leading-relaxed">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
