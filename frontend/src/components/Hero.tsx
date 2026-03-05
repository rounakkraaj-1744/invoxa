"use client";

import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";
import { Star, ArrowRight, CheckCircle2, Send, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export const Hero = () => {
    return (
        <section className="relative pt-32 pb-24 overflow-hidden flex flex-col items-center text-center px-4">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)] -z-10" />

            {/* AI Badge */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-[10px] font-bold text-accent uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                    <Star size={12} fill="currentColor" />
                    <span>Now with AI-powered tax detection</span>
                </div>
            </motion.div>

            {/* Headline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="max-w-4xl mx-auto space-y-4 mb-8"
            >
                <h1 className="text-5xl md:text-7xl lg:text-8xl flex flex-col leading-[0.9] tracking-tighter">
                    <span className="font-serif text-foreground italic">Invoice smarter.</span>
                    <span className="font-bold text-accent font-sans">Get paid faster.</span>
                </h1>
                <p className="text-text-secondary text-lg max-w-xl mx-auto leading-relaxed">
                    The modern invoicing platform for freelancers, teams, and developers.
                    Generate, send, and track invoices in seconds — or via API.
                </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-wrap items-center justify-center gap-4 mb-12"
            >
                <Button className="h-14 px-8 text-base bg-accent text-black hover:bg-accent/90 gap-2 shadow-glow font-bold">
                    Start for free <ArrowRight size={18} />
                </Button>
                <Button variant="ghost" className="h-14 px-8 text-base border-border-default hover:bg-surface font-medium">
                    View API Docs
                </Button>
            </motion.div>

            {/* Social Proof */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex items-center justify-center gap-4 mb-20"
            >
                <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className={cn(
                            "w-8 h-8 rounded-full border-2 border-background",
                            i === 1 ? "bg-accent/40" : i === 2 ? "bg-accent/30" : i === 3 ? "bg-accent/20" : i === 4 ? "bg-accent/10" : "bg-accent/50"
                        )} />
                    ))}
                </div>
                <p className="text-xs text-text-tertiary font-medium">Trusted by 12,000+ freelancers and studios</p>
            </motion.div>

            {/* Product Visualization Card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="relative w-full max-w-3xl aspect-[1.6/1] md:aspect-[2/1]"
            >
                {/* Status Floaties */}
                <div className="absolute -top-4 -right-2 md:right-10 z-20">
                    <div className="bg-surface/90 border border-accent/20 backdrop-blur-md px-4 py-2 rounded-lg flex items-center gap-3 shadow-glow-sm">
                        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-accent italic">3 invoices sent today</span>
                    </div>
                </div>

                <div className="absolute -bottom-6 -left-2 md:left-10 z-20">
                    <div className="bg-success/10 border border-success/20 backdrop-blur-md px-4 py-2 rounded-lg flex items-center gap-3">
                        <CheckCircle2 size={16} className="text-success" />
                        <span className="text-[10px] font-bold text-foreground">Invoice #1042 — Paid $3,200</span>
                    </div>
                </div>

                {/* Main Dashboard Card */}
                <div className="w-full h-full bg-background border border-border-default rounded-2xl overflow-hidden shadow-2xl relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-surface/20 to-transparent pointer-events-none" />

                    <div className="p-8 space-y-8">
                        <div className="flex items-center justify-between border-b border-border-default pb-4">
                            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Recent Invoices</h3>
                            <div className="px-3 py-1 bg-accent/10 border border-accent/20 rounded-md text-[9px] font-bold text-accent uppercase tracking-widest">
                                3 Sent today
                            </div>
                        </div>

                        <div className="space-y-4">
                            {[
                                { id: "#1042", client: "Acme Corp", amount: "$3,200", status: "paid" },
                                { id: "#1041", client: "Quantum Labs", amount: "$1,800", status: "sent" },
                                { id: "#1040", client: "Nova Design", amount: "$4,500", status: "overdue" },
                            ].map((row, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-surface/30 border border-border-default/50 rounded-xl">
                                    <div className="flex items-center gap-8">
                                        <span className="text-xs font-mono text-text-tertiary">{row.id}</span>
                                        <span className="text-sm font-bold text-foreground min-w-[120px]">{row.client}</span>
                                    </div>
                                    <div className="flex items-center gap-8">
                                        <span className="text-sm font-mono font-bold text-foreground">{row.amount}</span>
                                        <Badge variant={row.status as any}>{row.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
};
