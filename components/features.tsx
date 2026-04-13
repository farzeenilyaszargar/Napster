"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const features = [
    {
        title: "Multi-Agent Orchestration",
        description:
            "Run multiple napster agents in parallel using tmux",
        image: "/f1.png",
    },
    {
        title: "MCP's",
        description: "Connect MCP's and control them via napster",
        image: "/f2.png",
    },
    {
        title: "Semantic search",
        description: "Code indexing for larger repos with Vector DB",
        image: "/f3.png",
    },
    {
        title: "Security",
        description:
            "Find bugs and underlying security breaches in the codebase",
        image: "/f4.png",
    },
];

const duplicatedFeatures = [...features, ...features];

export default function Features() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitionEnabled, setIsTransitionEnabled] = useState(true);
    const [cardsPerView, setCardsPerView] = useState(3);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setActiveIndex((currentIndex) => currentIndex + 1);
        }, 3200);

        return () => window.clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const updateCardsPerView = () => {
            setCardsPerView(window.innerWidth < 640 ? 1 : 3);
        };

        updateCardsPerView();
        window.addEventListener("resize", updateCardsPerView);

        return () => window.removeEventListener("resize", updateCardsPerView);
    }, []);

    useEffect(() => {
        if (activeIndex < features.length) {
            return;
        }

        const resetTimeoutId = window.setTimeout(() => {
            setIsTransitionEnabled(false);
            setActiveIndex(0);

            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(() => {
                    setIsTransitionEnabled(true);
                });
            });
        }, 700);

        return () => window.clearTimeout(resetTimeoutId);
    }, [activeIndex]);

    const visibleDotIndex = activeIndex % features.length;

    return (
        <section id="features" className="mt-10 flex w-full sm:px-0 px-5 sm:w-5/7 scroll-mt-24 justify-center py-20 font-ubuntu">
            <div className="w-full">
                <h2 className="mb-15 text-left text-lg sm:text-2xl font-bold text-[#808080]">
                    <span className="text-[#2F2F2F]">Features.</span> From the
                    developers, to the developers.
                </h2>
                <div className="overflow-hidden">
                    <div
                        className="flex gap-4 "
                        style={{
                            transform: `translateX(calc(-${activeIndex} * ((100% + 1rem) / ${cardsPerView})))`,
                            transition: isTransitionEnabled
                                ? "transform 700ms ease"
                                : "none",
                        }}
                    >
                        {duplicatedFeatures.map((feature, index) => (
                            <article
                                key={`${feature.title}-${index}`}
                                className="shrink-0 overflow-hidden flex flex-col justify-between rounded-3xl bg-[#0F0F0F]"
                                style={{ width: `calc((100% - ${(cardsPerView - 1)}rem) / ${cardsPerView})` }}
                            >
                                <div className="p-6 pb-0">
                                    <h3 className="text-xl font-bold text-[#595959]">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-3 text-lg text-[#8F8F8F]">
                                        {feature.description}
                                    </p>
                                </div>
                                <div className="relative mt-6 aspect-[4/3] w-full">
                                    <Image
                                        src={feature.image}
                                        alt={feature.title}
                                        fill
                                        sizes="(max-width: 639px) 100vw, (max-width: 1024px) 33vw, 30vw"
                                        className="object-cover object-right-bottom"
                                    />
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
                <div className="mt-6 flex items-center justify-center gap-2">
                    {features.map((feature, index) => (
                        <span
                            key={feature.title}
                            className={`h-2 rounded-xl transition-all duration-300 ${
                                index === visibleDotIndex
                                    ? "w-6 bg-[#7A7A7A]"
                                    : "w-2 bg-[#2A2A2A]"
                            }`}
                            aria-hidden="true"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
