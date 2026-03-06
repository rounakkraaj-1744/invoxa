"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    CreditCard,
    ArrowDownLeft,
    ArrowUpRight,
    DollarSign,
    Search,
    Filter,
    Download,
    ExternalLink,
    Wallet
} from "lucide-react";
import { motion } from "framer-motion";

const transactions = [
    {
        id: "TRX-8901",
        invoice: "INV-1042",
        client: "Acme Corp",
        amount: "$3,200.00",
        method: "Stripe",
        date: "Mar 15, 2026",
        status: "succeeded"
    },
    {
        id: "TRX-8902",
        invoice: "INV-1041",
        client: "Globex Inc",
        amount: "$1,500.00",
        method: "Razorpay",
        date: "Mar 14, 2026",
        status: "succeeded"
    },
    {
        id: "TRX-8903",
        invoice: "INV-1040",
        client: "Soylent Corp",
        amount: "$850.00",
        method: "Bank Transfer",
        date: "Mar 12, 2026",
        status: "pending"
    },
    {
        id: "TRX-8904",
        invoice: "INV-1039",
        client: "Initech",
        amount: "$2,100.00",
        method: "Stripe",
        date: "Mar 10, 2026",
        status: "failed"
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
};

const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 }
};

export default function PaymentsPage() {
    return (
        <div className="flex flex-col min-h-screen pb-12">
            <DashboardHeader title="Payments" />
            <main className="p-6 space-y-8 bg-background radial-glow min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Financial Overview</h1>
                        <p className="text-sm text-text-tertiary">Track your payouts, transactions, and available balance.</p>
                    </div>
                </div>

                {/* Primary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Available Balance", value: "$12,450.00", icon: Wallet, color: "text-accent" },
                        { label: "Total Payouts", value: "$84,200.00", icon: ArrowUpRight, color: "text-success" },
                        { label: "Pending Payouts", value: "$3,120.00", icon: Clock, color: "text-text-tertiary" },
                        { label: "Refunds (MTD)", value: "$150.00", icon: ArrowDownLeft, color: "text-error" },
                    ].map((stat, i) => (
                        <Card key={i} className="bg-surface/20 border-border-default hover:bg-surface/30 transition-all border-l-4 border-l-transparent hover:border-l-accent group">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-2 bg-elevated rounded-lg group-hover:scale-110 transition-transform">
                                        <stat.icon size={20} className={stat.color} />
                                    </div>
                                </div>
                                <p className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">{stat.label}</p>
                                <h3 className="text-2xl font-bold text-white font-mono tracking-tight">{stat.value}</h3>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Transaction Controls */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-surface/10 p-4 rounded-xl border border-border-default">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" size={16} />
                        <input
                            type="text"
                            placeholder="Search by client or invoice ID..."
                            className="w-full bg-elevated border border-border-default rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="ghost" className="flex-1 md:flex-none gap-2 border-border-default text-text-secondary h-10">
                            <Filter size={14} />
                            <span>Filters</span>
                        </Button>
                        <Button variant="ghost" className="flex-1 md:flex-none gap-2 border-border-default text-text-secondary h-10">
                            <Download size={14} />
                            <span>Export</span>
                        </Button>
                    </div>
                </div>

                {/* Transactions Table */}
                <Card className="bg-surface/20 border-border-default overflow-hidden">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead className="bg-elevated/50 border-b border-border-default">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest">Transaction ID</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest">Client</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest">Invoice</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest">Amount</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest">Method</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest">Date</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-4 text-[10px] font-black text-text-tertiary uppercase tracking-widest text-right whitespace-nowrap">Receipt</th>
                                    </tr>
                                </thead>
                                <motion.tbody
                                    variants={container}
                                    initial="hidden"
                                    animate="show"
                                    className="divide-y divide-border-default/30"
                                >
                                    {transactions.map((trx) => (
                                        <motion.tr key={trx.id} variants={item} className="hover:bg-accent/5 transition-colors group">
                                            <td className="px-8 py-5">
                                                <span className="text-sm font-mono font-bold text-white group-hover:text-accent transition-colors">#{trx.id}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-elevated border border-border-default flex items-center justify-center text-[10px] font-bold">
                                                        {trx.client[0]}
                                                    </div>
                                                    <span className="text-sm text-text-secondary group-hover:text-white transition-colors">{trx.client}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-mono text-text-tertiary">{trx.invoice}</td>
                                            <td className="px-8 py-5 text-sm font-mono font-black text-white">{trx.amount}</td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-text-secondary text-xs">
                                                    <CreditCard size={14} className="text-text-tertiary" />
                                                    {trx.method}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-xs text-text-tertiary">{trx.date}</td>
                                            <td className="px-8 py-5">
                                                <Badge
                                                    variant={trx.status === 'succeeded' ? 'paid' : trx.status === 'pending' ? 'sent' : 'overdue'}
                                                    className="capitalize text-[10px] px-2 py-0.5"
                                                >
                                                    {trx.status}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <button className="p-2 hover:bg-elevated rounded-lg transition-colors text-text-tertiary hover:text-white">
                                                    <ExternalLink size={14} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </motion.tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Integration Banner */}
                <div className="relative group overflow-hidden rounded-2xl border border-border-default bg-surface/20 p-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="absolute top-0 left-0 w-2 h-full bg-error" />
                    <div className="space-y-2 text-center md:text-left">
                        <h3 className="text-xl font-bold text-white">Stripe account verification required</h3>
                        <p className="text-sm text-text-secondary max-w-lg">
                            To continue receiving payouts, please complete your identification verification on Stripe. Payouts are currently paused.
                        </p>
                    </div>
                    <Button className="bg-error text-white hover:bg-error/90 h-11 px-6 font-bold gap-2">
                        Complete Setup
                    </Button>
                </div>
            </main>
        </div>
    );
}

// Mock Clock icon since I used it but it wasn't in the import list I thought I had
const Clock = ({ size, className }: { size: number, className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
)
