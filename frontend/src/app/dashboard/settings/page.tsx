"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { User, Building, Palette, CreditCard, Bell, Shield, LogOut, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "business", label: "Business", icon: Building },
    { id: "branding", label: "Branding", icon: Palette },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
];

export default function Settings() {
    const [activeTab, setActiveTab] = useState("profile");
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || "");
            setEmail(session.user.email || "");
        }
    }, [session]);

    const handleSignOut = async () => {
        await authClient.signOut();
        router.push("/login");
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <DashboardHeader title="Settings" />

            <main className="flex-1 p-6">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all text-sm font-medium",
                                    activeTab === tab.id
                                        ? "bg-accent/10 text-accent border border-accent/20 shadow-[0_0_12px_rgba(245,158,11,0.1)]"
                                        : "text-text-secondary hover:bg-surface hover:text-foreground border border-transparent"
                                )}
                            >
                                <tab.icon size={18} />
                                <span>{tab.label}</span>
                            </button>
                        ))}

                        <div className="pt-8 mt-8 border-t border-border-default">
                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium text-error hover:bg-error/10 transition-all text-left"
                            >
                                <LogOut size={18} />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 space-y-8">
                        {isPending ? (
                            <div className="h-48 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                            </div>
                        ) : activeTab === 'profile' && (
                            <section className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold">Profile Settings</h2>
                                    <p className="text-sm text-text-secondary">Update your personal information and presence.</p>
                                </div>

                                <Card className="bg-surface/30">
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex items-center gap-6 pb-6 border-b border-border-default">
                                            {session?.user?.image ? (
                                                <img
                                                    src={session.user.image}
                                                    alt={session.user.name ?? ""}
                                                    className="w-20 h-20 rounded-full border-2 border-accent/40 object-cover"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 rounded-full bg-accent/20 border-2 border-accent/40 flex items-center justify-center text-2xl font-bold text-accent">
                                                    {session?.user?.name?.[0] || "?"}
                                                </div>
                                            )}
                                            <div>
                                                <Button variant="ghost" size="sm" className="mb-2">Change Avatar</Button>
                                                <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest">JPG, GIF or PNG. 1MB Max.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Full Name</label>
                                                <Input
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    placeholder="Your name"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Email Address</label>
                                                <Input
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="your@email.com"
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Professional Bio</label>
                                            <textarea
                                                className="w-full bg-surface border border-border-default rounded-md p-4 text-sm h-24 focus:ring-accent outline-none focus:border-accent transition-all"
                                                defaultValue="Freelance UI Engineer & SaaS Builder."
                                            />
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <Button className="px-8 shadow-glow">Save Changes</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </section>
                        )}

                        {activeTab === 'business' && (
                            <section className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold">Business Details</h2>
                                    <p className="text-sm text-text-secondary">This information will appear on your invoices.</p>
                                </div>
                                <Card className="bg-surface/30 p-8 flex items-center justify-center h-48 border-dashed border-2">
                                    <p className="text-text-tertiary italic">Business details form implementation...</p>
                                </Card>
                            </section>
                        )}

                        {activeTab === 'branding' && (
                            <section className="space-y-6">
                                <div>
                                    <h2 className="text-xl font-bold">Custom Branding</h2>
                                    <p className="text-sm text-text-secondary">Make every invoice truly yours.</p>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <Card className="p-6 space-y-4">
                                        <h3 className="text-sm font-bold">Accent Color</h3>
                                        <div className="flex gap-2">
                                            {['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#71717A'].map(color => (
                                                <button
                                                    key={color}
                                                    className={cn("w-10 h-10 rounded-full border-2 transition-all scale-100 hover:scale-110", color === '#F59E0B' ? 'border-white ring-2 ring-accent/20' : 'border-transparent')}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </Card>
                                    <Card className="p-6 space-y-4">
                                        <h3 className="text-sm font-bold">Default Template</h3>
                                        <div className="bg-surface rounded border border-border-default h-24 flex items-center justify-center text-xs text-text-tertiary">
                                            Minimalist (Selected)
                                        </div>
                                    </Card>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
