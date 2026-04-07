import Link from "next/link";
import { Wix_Madefor_Text } from "next/font/google";

const wixMadeforText = Wix_Madefor_Text({
    subsets: ["latin"],
    weight: ["400", "500", "600"],
});

export default function Footer() {
    return (
        <footer className={`w-full px-5 py-2 text-gray-300 sm:px-5 lg:px-10 tracking-[-0.015em] text-xs ${wixMadeforText.className} flex flex-col items-center justify-center`}>
            <p className="text-[0.1px] text-white">
                Nap Code is an advanced AI-powered agent orchestration platform built for developers who want to code faster, smarter, and at scale using parallel AI agents and deep codebase understanding. Designed as a next-generation alternative to traditional coding tools, Nap Code enables seamless multi file edits, intelligent refactoring, and real-time collaboration between multiple AI models working together on your code. With support for parallel agents, Nap allows developers to run multiple AI-driven tasks simultaneously across different parts of a project, dramatically improving productivity and reducing development time. Whether you are managing large-scale applications or building new projects from scratch, Nap Code provides entire codebase knowledge and context awareness, ensuring that every change made by an agent is consistent, accurate, and aligned with the structure of your project.
                Nap Code stands out by integrating terminal and code workflows into a single unified interface, allowing developers to execute commands, modify files, and deploy updates without switching environments. Its powerful agent system enables automated refactoring, debugging, and feature generation, making it an ideal solution for modern software development teams and individual developers alike. With built-in GitHub integration and automatic pushes, Nap ensures that your changes are continuously synced, version controlled, and ready for collaboration. Developers can rely on Nap to handle repetitive tasks, optimize code quality, and maintain clean architecture across multiple files and modules.
                The platform is optimized for performance and scalability, leveraging local execution and intelligent orchestration to provide faster response times and secure development workflows. By combining multiple AI models, parallel agents, and deep contextual awareness, Nap Code transforms how developers interact with their code, enabling a more efficient and automated coding experience. Whether you are focused on rapid prototyping, complex refactoring, or continuous integration, Nap Code empowers you to build, iterate, and ship code faster than ever before. For developers seeking a powerful AI coding platform with multi file editing, parallel execution, and full codebase context, Nap Code is the ultimate tool to accelerate development and redefine productivity in modern programming.
            </p>
            <div className="mx-auto hidden w-full max-w-5xl flex-col items-center whitespace-nowrap justify-center gap-2 text-xs text-gray-400 py-2 text-center tracking-[-0.015em] sm:flex">
                <p className="text-center">
                    For anything specific about Nap or any other issues, email us at{" "}
                    <a className="underline underline-offset-2 text-black hover:text-gray-500" href="mailto:issues@nap-code.com">issues@nap-code.com</a>
                    {" "}. Check us out on social media on{" "}
                    <Link className="underline underline-offset-2 text-black hover:text-gray-500" href="https://x.com/napverse" target="_blank">X</Link>
                    {" "} &amp;{" "}
                    <Link className="underline underline-offset-2 text-black hover:text-gray-500" href="https://www.youtube.com/@napHQ" target="_blank">YouTube</Link>.
                    Enjoy coding and building projects. Creare est vivere!
                </p>
            </div>
            <div className="mx-auto px-2 flex w-full max-w-5xl flex-col items-center justify-between gap-2 text-xs text-gray-400 sm:flex-row border-t border-gray-200 py-2 tracking-[-0.015em]">
                <span className="whitespace-nowrap">Copyright © 2026 Nap Inc. All Rights Reserved.</span>
                <div className="hidden flex-wrap items-center justify-center gap-2 sm:flex sm:justify-end">
                    <Link className="whitespace-nowrap transition-colors hover:text-black" href="/download">Download</Link>
                    <span className="inline-flex items-center leading-none ">|</span>
                    <Link className="whitespace-nowrap transition-colors hover:text-black" href="/privacy">Privacy Policy</Link>
                    <span className="inline-flex items-center leading-none ">|</span>
                    <Link className="whitespace-nowrap transition-colors hover:text-black" href="/tc">Terms Of Use</Link>
                    <span className="inline-flex items-center leading-none ">|</span>
                    <Link className="whitespace-nowrap transition-colors hover:text-black" href="/data-usage">Data Usage</Link>
                </div>
                <span className="hidden sm:inline">8 Off Western Road, 400068, Mumbai, India.</span>
            </div>
        </footer>
    );
}
