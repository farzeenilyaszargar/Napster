import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  return (
    <>
    <header className={`w-full bg-white/70 backdrop-blur-md transition-transform duration-300 sticky top-0 left-0 right-0 z-20 sm:fixed`}>
                <div className="mx-auto flex h-12 w-full max-w-6xl items-center justify-start px-4 lg:px-15">
                    <Link href="/" className="flex justify-center items-center">
                        <Image src="/logo.png" alt="Nap" width={22} height={22} className="h-2.5 w-auto rounded-md sm:h-3.5" />
                    </Link>

                    <div className="ml-auto hidden items-center gap-6 sm:flex">
                        <nav className="flex items-center gap-6">
                            
                        </nav>
                        
                    </div>
                </div>

                    
            </header>

            
                    
        </>
  );
}
