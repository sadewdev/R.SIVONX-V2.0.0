"use client";

import { use, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, BadgeCheck, UserPlus, UserMinus, Share, Calendar, Edit3, X, Check } from "lucide-react";
import Link from "next/link";
import { Input, Form, Label, Spinner } from "@heroui/react";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";

export default function ProfilePage({ params }: { params: Promise<{ handle: string }> }) {
    const resolvedParams = use(params);
    const rawHandle = resolvedParams.handle;
    const username = rawHandle.replace("%40", "").replace("@", "");

    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    const [currentUser, setCurrentUser] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editBio, setEditBio] = useState("");
    const [saving, setSaving] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const loggedInUser = localStorage.getItem("claimedUser");
        if (loggedInUser) setCurrentUser(loggedInUser);

        fetchProfileData();
    }, [username]);

    const fetchProfileData = async () => {
        const { data: user } = await supabase
            .from("waitlist")
            .select("*")
            .eq("username", username)
            .maybeSingle();

        if (!user) {
            setNotFound(true);
            return;
        }

        setProfile(user);
        setEditName(user.display_name || user.username);
        setEditBio(user.bio || "");

        const { count: followers } = await supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("following_handle", username);

        const { count: following } = await supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("follower_handle", username);

        setFollowersCount(followers || 0);
        setFollowingCount(following || 0);

        const loggedInUser = localStorage.getItem("claimedUser");
        if (loggedInUser && loggedInUser !== username) {
            const { data: followStatus } = await supabase
                .from("follows")
                .select("*")
                .eq("follower_handle", loggedInUser)
                .eq("following_handle", username)
                .maybeSingle();

            setIsFollowing(!!followStatus);
        }
        setLoading(false);
    };

    const handleFollowToggle = async () => {
        if (!currentUser) return alert("Please authenticate to follow users.");

        if (isFollowing) {
            await supabase
                .from("follows")
                .delete()
                .eq("follower_handle", currentUser)
                .eq("following_handle", username);
            setFollowersCount((prev) => prev - 1);
        } else {
            await supabase
                .from("follows")
                .insert([{ follower_handle: currentUser, following_handle: username }]);
            setFollowersCount((prev) => prev + 1);
        }
        setIsFollowing(!isFollowing);
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        await supabase
            .from("waitlist")
            .update({ display_name: editName, bio: editBio })
            .eq("username", username);

        setProfile({ ...profile, display_name: editName, bio: editBio });
        setIsEditing(false);
        setSaving(false);
    };

    const handleShare = () => {
        const profileUrl = `https://r.sivonx.space/@${username}`;
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (notFound) {
        return (
            <main className="flex min-h-screen flex-col items-center justify-center bg-[#050505] text-center">
                <h1 className="text-4xl font-bold text-white mb-3">Profile Not Found</h1>
                <Link href="/">
                    <Button radius="full" size="lg" className="bg-white text-black mt-4 font-semibold hover:scale-105 transition-transform">
                        Return to Gateway
                    </Button>
                </Link>
            </main>
        );
    }

    if (loading || !profile) {
        return (
            <div className="min-h-screen bg-[#030303] flex items-center justify-center">
                <Spinner color="current" className="text-white" size="lg" />
            </div>
        );
    }

    const joinDate = new Date(profile.created_at);
    const isOwner = currentUser === username;

    return (
        <main className="flex min-h-screen flex-col items-center bg-[#030303] relative overflow-hidden font-sans text-zinc-100 selection:bg-zinc-800 selection:text-white pb-24">

            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 mix-blend-screen"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-white/5 to-transparent blur-[150px] rounded-full pointer-events-none z-0"></div>

            <nav className="w-full max-w-4xl mx-auto px-6 py-8 z-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-xs font-semibold tracking-[0.2em] uppercase">
                    <ArrowLeft className="w-4 h-4" />
                    Return to Gateway
                </Link>
            </nav>

            <div className="z-10 w-full max-w-4xl px-4 sm:px-6 mt-2">
                <div className="relative bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl backdrop-blur-xl">

                    <div className="h-48 md:h-64 w-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black relative border-b border-white/5 overflow-hidden">
                        <div className="absolute inset-0 opacity-30 mix-blend-overlay"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 to-transparent"></div>
                    </div>

                    <div className="px-6 sm:px-10 pb-12 relative">

                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16 sm:-mt-20 mb-8">

                            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#0a0a0a] p-2 relative z-10 shadow-2xl">
                                <div className="w-full h-full rounded-full bg-gradient-to-br from-zinc-700 to-zinc-950 flex items-center justify-center text-5xl sm:text-6xl font-serif text-white shadow-inner border border-white/10">
                                    {username[0].toUpperCase()}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 z-10">
                                <Button
                                    onPress={handleShare}
                                    radius="full"
                                    variant="bordered"
                                    className={`border-white/10 h-12 w-12 min-w-0 px-0 flex items-center justify-center backdrop-blur-md transition-all duration-300 ${copied ? "bg-green-500/20 text-green-400 border-green-500/30" : "text-zinc-300 hover:bg-white/5 hover:text-white"}`}
                                >
                                    {copied ? <Check className="w-5 h-5" /> : <Share className="w-5 h-5" />}
                                </Button>

                                {isOwner ? (
                                    <Button onPress={() => setIsEditing(!isEditing)} radius="full" className="bg-white/5 text-white font-semibold h-12 px-8 hover:bg-white/10 border border-white/10 transition-colors">
                                        <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                                    </Button>
                                ) : (
                                    <Button onPress={handleFollowToggle} radius="full" className={`${isFollowing ? "bg-white/5 text-white border border-white/20" : "bg-white text-black"} font-semibold h-12 px-8 hover:scale-[1.02] transition-all duration-300 flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.15)]`}>
                                        {isFollowing ? <UserMinus className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {isEditing ? (
                            <Form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }} className="flex flex-col gap-6 bg-white/[0.02] p-8 rounded-[1.5rem] border border-white/5 backdrop-blur-md w-full animate-in fade-in zoom-in-95 duration-300">

                                <div className="flex flex-col gap-2.5 w-full">
                                    <Label htmlFor="editName" className="text-sm font-medium text-zinc-400 ml-1">Display Name</Label>
                                    <Input
                                        id="editName"
                                        variant="bordered"
                                        size="lg"
                                        radius="lg"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        classNames={{
                                            inputWrapper: "h-14 bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04] focus-within:!border-white/40 focus-within:!bg-white/[0.02] shadow-none transition-all duration-300",
                                            input: "text-zinc-100 placeholder:text-zinc-600 text-base font-medium",
                                        }}
                                    />
                                </div>

                                <div className="flex flex-col gap-2.5 w-full">
                                    <Label htmlFor="editBio" className="text-sm font-medium text-zinc-400 ml-1">Biography</Label>
                                    <Textarea
                                        id="editBio"
                                        variant="bordered"
                                        size="lg"
                                        radius="lg"
                                        minRows={3}
                                        value={editBio}
                                        onChange={(e) => setEditBio(e.target.value)}
                                        classNames={{
                                            inputWrapper: "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04] focus-within:!border-white/40 focus-within:!bg-white/[0.02] shadow-none transition-all duration-300 py-3",
                                            input: "text-zinc-100 placeholder:text-zinc-600 text-base font-medium resize-none leading-relaxed",
                                        }}
                                    />
                                </div>

                                <div className="flex gap-4 justify-end w-full mt-4 pt-4 border-t border-white/5">
                                    <Button
                                        onPress={() => setIsEditing(false)}
                                        variant="light"
                                        radius="full"
                                        className="text-zinc-400 hover:text-white h-12 px-6 font-medium"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        isLoading={saving}
                                        radius="full"
                                        className="bg-white text-black font-semibold h-12 px-8 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-[1.02] transition-transform"
                                    >
                                        <Check className="w-4 h-4 mr-2" /> Save Parameters
                                    </Button>
                                </div>
                            </Form>
                        ) : (
                            <div className="flex flex-col gap-6 animate-in fade-in duration-500">

                                <div>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                                            {profile.display_name || username}
                                        </h1>
                                        {profile.is_verified && (
                                            <BadgeCheck className="w-7 h-7 fill-blue-500 text-[#0a0a0a]" />
                                        )}
                                    </div>
                                    <p className="text-zinc-500 text-lg font-medium">@{profile.username}</p>
                                </div>

                                {profile.bio && (
                                    <p className="text-zinc-300 leading-relaxed max-w-2xl font-light text-base sm:text-lg">
                                        {profile.bio}
                                    </p>
                                )}

                                <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 font-medium tracking-wide">
                                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                        <Calendar className="w-4 h-4" />
                                        <span>Joined {joinDate.toLocaleString('en-US', { month: 'long' })} {joinDate.getFullYear()}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 mt-4 pt-6 border-t border-white/5">
                                    <div className="flex gap-2 items-baseline cursor-pointer group">
                                        <span className="text-white font-semibold text-2xl group-hover:text-zinc-300 transition-colors">{followingCount}</span>
                                        <span className="text-zinc-500 text-sm font-medium tracking-wide uppercase">Following</span>
                                    </div>
                                    <div className="flex gap-2 items-baseline cursor-pointer group">
                                        <span className="text-white font-semibold text-2xl group-hover:text-zinc-300 transition-colors">{followersCount}</span>
                                        <span className="text-zinc-500 text-sm font-medium tracking-wide uppercase">Followers</span>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}