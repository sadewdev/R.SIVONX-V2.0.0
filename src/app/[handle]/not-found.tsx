import Link from "next/link";
import { Button } from "@heroui/react";
import { SearchX } from "lucide-react";

export default function NotFound() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-[#050505] p-6 text-center relative overflow-hidden">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-zinc-900/20 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center border border-white/5 mb-6">
                    <SearchX className="w-10 h-10 text-zinc-500" />
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                    Profile Not Found
                </h1>

                <p className="text-zinc-400 max-w-sm mb-8 leading-relaxed">
                    The exclusive handle you are looking for does not exist or has not been claimed yet.
                </p>

                <Link href="/">
                    <Button
                        radius="full"
                        size="lg"
                        className="bg-white text-black font-semibold hover:scale-105 transition-transform"
                    >
                        Claim a Handle
                    </Button>
                </Link>
            </div>
        </main>
    );
}