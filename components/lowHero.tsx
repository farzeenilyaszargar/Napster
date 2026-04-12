import CopyCommandBar from "@/components/copyCommandBar";
import Image from "next/image";
import SmoothScrollLink from "@/components/smoothScrollLink";

export default function LowHero() {
    return (
        <div className="flex flex-col items-center justify-center py-30">
            <h2 className="font-pixelify font-bold text-5xl text-[#828282]">try. <span className="text-[#3F3F3F]">now.</span></h2>
            <div className="flex flex-col justify-between mt-10 gap-5 ">
                <CopyCommandBar text="npm -i napster" />
                <SmoothScrollLink targetId="features" className=" flex justify-center items-center gap-1">Find out how it works
                <Image src="/right-arroww.png" alt="right arrow" width={20} height={20} className="rounded-lg invert" />

                </SmoothScrollLink>
            </div>
            <p className="text-[#000000] text-[0.1px]">
                Nap is a powerful AI CLI tool designed for developers who want speed, automation, and intelligent coding assistance directly from the terminal. Built as a next-generation alternative to tools like Codex CLI and Claude Code, Nap delivers a faster, smarter, and more streamlined developer experience. Whether you are building applications, debugging code, generating scripts, or automating workflows, Nap CLI acts as your all-in-one AI coding assistant.

                With Nap CLI, developers can generate code instantly, refactor existing projects, and create production-ready solutions without leaving the command line. This AI-powered CLI tool is optimized for modern development environments, making it ideal for JavaScript, Python, backend development, DevOps automation, and full-stack workflows. Nap integrates seamlessly into your workflow, reducing context switching and dramatically improving productivity.

                One of the key advantages of Nap is its speed and simplicity. Unlike other AI coding tools, Nap CLI is lightweight, fast, and designed for real-time execution. You can run commands like code generation, test creation, API scaffolding, and bug fixing directly from your terminal. This makes Nap one of the best CLI tools for developers who value efficiency and minimal setup.

                Nap also focuses heavily on developer experience. It provides clean outputs, structured code suggestions, and intelligent context awareness. Whether you are working on a startup project, scaling a SaaS application, or contributing to open source, Nap CLI helps you write better code faster. Its advanced AI capabilities allow it to understand your project structure and generate highly relevant solutions.

                From an SEO perspective, Nap CLI stands out as a top AI developer tool, AI coding assistant, CLI automation tool, and developer productivity tool. It is designed for engineers searching for faster coding solutions, AI-powered command line tools, and modern development automation platforms. If you are looking for the best AI CLI tool for coding, Nap is the ultimate choice.

                In a world where developer speed matters more than ever, Nap CLI gives you a competitive edge. It transforms your terminal into an intelligent coding environment, helping you build, ship, and scale faster than ever before. If you want a powerful, fast, and reliable AI CLI tool, Nap is the future of coding.
    
            </p>
        </div>
    );
}
