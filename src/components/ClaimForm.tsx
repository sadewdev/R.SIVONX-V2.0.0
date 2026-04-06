"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Spinner, Label } from "@heroui/react";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function ClaimForm() {
    const router = useRouter();
    const [isLogin, setIsLogin] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

    useEffect(() => {
        if (isLogin || username.length < 3) {
            setIsAvailable(null);
            setIsChecking(false);
            return;
        }

        setIsChecking(true);
        const checkUsername = async () => {
            const { data } = await supabase
                .from("waitlist")
                .select("username")
                .eq("username", username.toLowerCase())
                .maybeSingle();

            setIsAvailable(data ? false : true);
            setIsChecking(false);
        };

        const timeoutId = setTimeout(checkUsername, 500);
        return () => clearTimeout(timeoutId);
    }, [username, isLogin]);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        if (isLogin) {
            const { data } = await supabase
                .from("waitlist")
                .select("*")
                .eq("username", username.toLowerCase())
                .eq("password", password)
                .maybeSingle();

            if (data) {
                localStorage.setItem("claimedUser", username.toLowerCase());
                router.push(`/@${username.toLowerCase()}`);
            } else {
                setMessage({ text: "Invalid credentials.", type: "error" });
            }
        } else {
            if (isAvailable === false) {
                setMessage({ text: "Handle is already taken.", type: "error" });
                setLoading(false);
                return;
            }

            const { error } = await supabase
                .from("waitlist")
                .insert([{
                    username: username.toLowerCase(),
                    email: email.toLowerCase(),
                    password: password
                }]);

            if (error) {
                setMessage({ text: "Authentication failed. Try again.", type: "error" });
            } else {
                localStorage.setItem("claimedUser", username.toLowerCase());
                router.push(`/@${username.toLowerCase()}`);
            }
        }
        setLoading(false);
    };

    return (
        <div className="w-full max-w-sm mt-8 mx-auto">
            <div className="flex bg-white/[0.03] rounded-full p-1.5 mb-8 border border-white/10 backdrop-blur-md">
                <button
                    type="button"
                    onClick={() => { setIsLogin(false); setMessage(null); }}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${!isLogin ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"}`}
                >
                    Claim Handle
                </button>
                <button
                    type="button"
                    onClick={() => { setIsLogin(true); setMessage(null); }}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${isLogin ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-white"}`}
                >
                    Access Terminal
                </button>
            </div>

            <Form onSubmit={handleAuth} className="flex flex-col gap-6 text-left w-full">

                <div className="flex flex-col gap-2.5 w-full">
                    <Label htmlFor="username" className="text-sm font-medium text-zinc-400 ml-1">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        placeholder="username"
                        variant="bordered"
                        size="lg"
                        radius="lg"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ""))}
                        isInvalid={!isLogin && isAvailable === false}
                        errorMessage={!isLogin && isAvailable === false ? "This handle is unavailable." : ""}
                        description={!isLogin && isAvailable === true ? "Handle is available!" : ""}
                        startContent={<span className="text-zinc-500 font-medium text-base pr-2 select-none">@</span>}
                        endContent={
                            !isLogin && (
                                <div className="flex items-center">
                                    {isChecking ? <Spinner size="sm" color="current" className="text-zinc-400" /> :
                                        isAvailable === true ? <CheckCircle2 className="w-5 h-5 text-green-500" /> :
                                            isAvailable === false ? <XCircle className="w-5 h-5 text-red-500" /> : null}
                                </div>
                            )
                        }
                        classNames={{
                            inputWrapper: "h-14 bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04] focus-within:!border-white/40 focus-within:!bg-white/[0.02] shadow-none transition-all duration-300",
                            input: "text-zinc-100 placeholder:text-zinc-600 text-base font-medium",
                            description: "text-green-500/80 font-medium ml-1 text-xs",
                            errorMessage: "text-red-500/80 font-medium ml-1 text-xs"
                        }}
                    />
                </div>

                {!isLogin && (
                    <div className="flex flex-col gap-2.5 w-full">
                        <Label htmlFor="email" className="text-sm font-medium text-zinc-400 ml-1">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            variant="bordered"
                            size="lg"
                            radius="lg"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            classNames={{
                                inputWrapper: "h-14 bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04] focus-within:!border-white/40 focus-within:!bg-white/[0.02] shadow-none transition-all duration-300",
                                input: "text-zinc-100 placeholder:text-zinc-600 text-base font-medium",
                            }}
                        />
                    </div>
                )}

                <div className="flex flex-col gap-2.5 w-full">
                    <Label htmlFor="password" className="text-sm font-medium text-zinc-400 ml-1">Secure Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        variant="bordered"
                        size="lg"
                        radius="lg"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        classNames={{
                            inputWrapper: "h-14 bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04] focus-within:!border-white/40 focus-within:!bg-white/[0.02] shadow-none transition-all duration-300",
                            input: "text-zinc-100 placeholder:text-zinc-600 text-base font-medium",
                        }}
                    />
                </div>

                <Button
                    type="submit"
                    isLoading={loading}
                    isDisabled={(!isLogin && (!isAvailable || !email || !password)) || (isLogin && (!username || !password))}
                    size="lg"
                    radius="full"
                    className="h-14 bg-white text-black font-semibold mt-4 hover:scale-[1.02] transition-transform duration-300 w-full shadow-[0_0_30px_rgba(255,255,255,0.15)] text-base"
                >
                    {loading ? "Processing..." : isLogin ? "Authenticate" : "Claim & Register"}
                </Button>

                {message && (
                    <p className={`text-sm text-center font-medium w-full mt-2 ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
                        {message.text}
                    </p>
                )}
            </Form>
        </div>
    );
}