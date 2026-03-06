"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    RefreshCcw,
    Plus,
    Calendar,
    Clock,
    MoreHorizontal,
    Play,
    Pause,
    ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";

const recurringSchedules = [
    {
        id: "REC-001",
        client: "Acme Corp",
        amount: "$3,200.00",
        interval: "Monthly",
        nextRun: "Apr 12, 2026",
        status: "active",
        lastRun: "Mar 12, 2026"
    },
    {
        id: "REC-002",
        client: "Globex Inc",
        amount: "$1,500.00",
        interval: "Weekly",
        nextRun: "Mar 19, 2026",
        status: "active",
        lastRun: "Mar 12, 2026"
    },
    {
        id: "REC-003",
        client: "Soylent Corp",
        amount: "$850.00",
        interval: "Monthly",
        nextRun: "Apr 05, 2026",
        status: "paused",
        lastRun: "Mar 05, 2026"
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function RecurringPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <DashboardHeader title="Recurring Invoices" />
            <main className="p-6 space-y-8 bg-background radial-glow min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Subscriptions</h1>
                        <p className="text-sm text-text-tertiary">Manage your automated recurring billing schedules.</p>
                    </div>
                    <Button className="bg-accent text-black hover:bg-accent/90 h-11 px-6 font-bold shadow-glow-sm gap-2">
                        <Plus size={18} />
                        <span>Create Schedule</span>
                    </Button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Active Schedules", value: "12", icon: RefreshCcw, color: "text-accent" },
                        { label: "Rev. this Month", value: "$4,230.00", icon: ArrowUpRight, color: "text-success" },
                        { label: "Scheduled Today", value: "0", icon: Calendar, color: "text-text-tertiary" },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-surface/20 border-border-default overflow-hidden relative group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <stat.icon size={48} className={stat.color} />
                            </div>
                            <CardContent className="p-6">
                                <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-2">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Schedules List */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="space-y-4"
                >
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-sm font-bold text-text-tertiary uppercase tracking-widest">Active Schedules</h2>
                        <div className="flex gap-2">
                            <button className="text-xs text-text-tertiary hover:text-white transition-colors">Sort by date</button>
                            <span className="text-border-default">|</span>
                            <button className="text-xs text-text-tertiary hover:text-white transition-colors">Filter</button>
                        </div>
                    </div>

                    {recurringSchedules.map((schedule) => (
                        <motion.div key={schedule.id} variants={item}>
                            <Card className="bg-surface/20 border-border-default hover:border-border-active transition-all group overflow-hidden">
                                <CardContent className="p-0">
                                    <div className="flex flex-col md:flex-row md:items-center">
                                        {/* Status Bar (Mobile Only) */}
                                        <div className={`h-1 md:w-1 md:h-20 shrink-0 ${schedule.status === 'active' ? 'bg-success' : 'bg-text-tertiary'}`} />

                                        <div className="p-6 flex-1 grid grid-cols-1 md:grid-cols-5 gap-6 items-center w-full">
                                            {/* Client Info */}
                                            <div className="md:col-span-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-elevated border border-border-default flex items-center justify-center font-bold text-text-secondary">
                                                        {schedule.client[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white">{schedule.client}</h4>
                                                        <p className="text-[10px] text-text-tertiary font-bold tracking-widest uppercase">{schedule.id}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Billing Details */}
                                            <div>
                                                <p className="text-[10px] text-text-tertiary font-bold tracking-widest uppercase mb-1">Billing</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-bold text-white font-mono">{schedule.amount}</span>
                                                    <span className="text-[10px] bg-elevated text-text-secondary px-1.5 py-0.5 rounded uppercase font-bold tracking-tighter border border-border-default">
                                                        {schedule.interval}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Next Run */}
                                            <div>
                                                <p className="text-[10px] text-text-tertiary font-bold tracking-widest uppercase mb-1">Next Run</p>
                                                <div className="flex items-center gap-2 text-text-secondary">
                                                    <Clock size={14} className="text-accent" />
                                                    <span className="text-sm font-medium">{schedule.nextRun}</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex justify-end gap-2">
                                                <button className="p-2 hover:bg-elevated rounded-md border border-border-default text-text-secondary hover:text-white transition-all">
                                                    {schedule.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                                                </button>
                                                <button className="p-2 hover:bg-elevated rounded-md border border-border-default text-text-secondary hover:text-white transition-all">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Help Section */}
                <Card className="bg-accent/5 border-dashed border-accent/20">
                    <CardContent className="p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center text-accent shrink-0">
                            <Clock size={32} />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white mb-2">Automation that grows with you</h3>
                            <p className="text-sm text-text-secondary max-w-xl">
                                Recurring invoices are sent automatically on the scheduled date. You'll receive a notification for each successfully generated invoice.
                            </p>
                        </div>
                        <Button variant="ghost" className="border-accent/20 text-accent hover:bg-accent/10">Learn more</Button>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
