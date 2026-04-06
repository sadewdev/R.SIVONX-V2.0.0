"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { ClaimForm } from "@/components/ClaimForm";
import Link from "next/link";
import { LogOut, User, Fingerprint, Crown, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("claimedUser");
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("claimedUser");
    setCurrentUser(null);
    setShowForm(false);
  };

  if (!isMounted) return null;

  return (
    <main className="flex min-h-screen flex-col bg-[#030303] relative overflow-hidden font-sans text-zinc-100 selection:bg-zinc-800 selection:text-white">

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-screen"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      <div className="fixed inset-0 pointer-events-none z-0 opacity-20 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 left-0 scale-150 transform-gpu opacity-30">
          <g stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none">
            <circle cx="400" cy="400" r="200" />
            <circle cx="400" cy="400" r="300" />
            <circle cx="400" cy="400" r="400" />
            <path d="M0,400 L800,400" />
            <path d="M400,0 L400,800" />
            <path d="M117,117 L683,683" />
            <path d="M117,683 L683,117" />
          </g>
        </svg>
      </div>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-white/5 to-transparent blur-[150px] rounded-full pointer-events-none z-0"></div>

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full flex justify-center py-10 z-20 relative"
      >
        <h1 className="text-xl font-serif tracking-[0.4em] text-white font-medium uppercase">
          R.Sivonx
        </h1>
      </motion.header>

      <section className="flex flex-col items-center justify-center min-h-[85vh] px-6 z-10 text-center relative">
        <div className="max-w-5xl flex flex-col items-center gap-10">

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {currentUser ? (
              <div className="px-6 py-2.5 rounded-full border border-green-500/30 bg-green-500/5 backdrop-blur-md text-green-400 text-xs font-semibold tracking-widest uppercase flex items-center gap-3 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                VERIFIED AS @{currentUser}
              </div>
            ) : (
              <div className="px-6 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-zinc-300 text-xs font-medium tracking-[0.3em] uppercase">
                Private Beta Access
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-6xl md:text-8xl font-bold tracking-tighter text-white leading-[1.1]">
              Redefining <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-500 italic font-serif pr-4">
                Exclusivity.
              </span>
            </h2>
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
              Enter the R.SIVONX ecosystem. A meticulously crafted digital environment reserved for visionaries and industry leaders.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="w-full max-w-md mx-auto mt-6"
          >
            {currentUser ? (
              <div className="flex flex-col gap-4">
                <Button
                  as={Link}
                  href={`/@${currentUser}`}
                  radius="full"
                  size="lg"
                  className="bg-white text-black font-semibold h-14 w-full flex gap-3 items-center hover:scale-[1.03] transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] text-base"
                >
                  <User className="w-5 h-5" />
                  Access VIP Terminal
                </Button>
                <Button
                  onPress={handleLogout}
                  radius="full"
                  variant="bordered"
                  size="lg"
                  className="border-white/10 text-zinc-400 font-medium h-14 w-full flex gap-3 items-center hover:bg-white/5 hover:text-white transition-all duration-300 text-base backdrop-blur-sm"
                >
                  <LogOut className="w-5 h-5" />
                  Disconnect Session
                </Button>
              </div>
            ) : showForm ? (
              <div className="w-full">
                <ClaimForm />
                <button
                  onClick={() => setShowForm(false)}
                  className="mt-8 text-xs text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em] font-medium"
                >
                  Return to Gateway
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <Button
                  radius="full"
                  size="lg"
                  onPress={() => setShowForm(true)}
                  className="bg-white text-black font-semibold h-14 w-full hover:scale-[1.03] transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)] text-base"
                >
                  Request Invitation
                </Button>
                <Button
                  radius="full"
                  variant="bordered"
                  size="lg"
                  className="border-white/10 text-zinc-300 font-medium h-14 w-full hover:bg-white/5 transition-all duration-300 text-base backdrop-blur-sm"
                >
                  Discover the Architecture
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="w-full px-6 py-32 z-10 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {[
              { icon: Crown, title: "Absolute Purity", desc: "A sanctuary free from digital noise. Minimalist design powered by cutting-edge performance architecture." },
              { icon: Shield, title: "Fortified Assets", desc: "Military-grade encryption securing your digital footprint and proprietary handles within the network." },
              { icon: Fingerprint, title: "Singular Identity", desc: "One handle. Infinite possibilities. Your R.SIVONX tag is your universal key to our future infrastructure." }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: idx * 0.2 }}
              >
                <Card className="bg-white/[0.02] backdrop-blur-xl border border-white/5 shadow-2xl rounded-3xl overflow-hidden hover:bg-white/[0.04] transition-colors duration-500 group h-full">
                  <CardBody className="p-10 flex flex-col gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-black flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-colors shadow-inner">
                      <feature.icon className="w-6 h-6 text-zinc-100" />
                    </div>
                    <h3 className="text-2xl font-semibold text-white tracking-tight">{feature.title}</h3>
                    <p className="text-zinc-500 leading-relaxed font-light text-base">
                      {feature.desc}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}

          </div>
        </div>
      </section>

      <footer className="w-full py-12 border-t border-white/5 flex flex-col items-center justify-center z-10 relative bg-black/50 backdrop-blur-md">
        <h2 className="text-sm font-serif tracking-[0.5em] text-zinc-500 mb-4 uppercase">R.Sivonx</h2>
        <div className="w-px h-8 bg-white/10 mb-4"></div>
        <p className="text-[10px] text-zinc-600 font-mono tracking-widest uppercase">
          &copy; {new Date().getFullYear()} R.SIVONX CORPORATION. ALL RIGHTS RESERVED.
        </p>
      </footer>

    </main>
  );
}