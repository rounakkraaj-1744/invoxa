"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    Plus,
    Search,
    Download,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionsDropdown } from "@/components/dashboard/ActionsDropdown";

const invoices = [
    { id: "INV-1042", client: "Acme Corp", items: 3, amount: "$3,200.00", issued: "Mar 1, 2026", due: "Mar 31, 2026", status: "paid" as const },
    { id: "INV-1041", client: "Quantum Labs", items: 2, amount: "$1,800.00", issued: "Feb 28, 2026", due: "Mar 30, 2026", status: "sent" as const },
    { id: "INV-1040", client: "Nova Design", items: 5, amount: "$4,500.00", issued: "Feb 25, 2026", due: "Mar 15, 2026", status: "overdue" as const },
    { id: "INV-1039", client: "Stellar Inc", items: 1, amount: "$2,100.00", issued: "Feb 20, 2026", due: "Mar 20, 2026", status: "sent" as const },
    { id: "INV-1038", client: "Pixel Studio", items: 4, amount: "$950.00", issued: "Feb 18, 2026", due: "Mar 18, 2026", status: "draft" as const },
    { id: "INV-1037", client: "Orbit Systems", items: 2, amount: "$5,600.00", issued: "Feb 15, 2026", due: "Mar 15, 2026", status: "paid" as const },
    { id: "INV-1036", client: "Apex Digital", items: 3, amount: "$1,200.00", issued: "Feb 12, 2026", due: "Mar 12, 2026", status: "paid" as const },
];

export default function InvoicesPage() {
    const [activeFilter, setActiveFilter] = useState("All");
    const filters = ["All", "Draft", "Sent", "Paid", "Overdue"];

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <DashboardHeader title="Invoices" />

            <main className="p-6 space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Invoices</h1>
                    <div className="flex gap-4">
                        <Button variant="ghost" className="border-border-default gap-2 text-xs font-bold uppercase tracking-widest text-text-tertiary hover:text-white">
                            <Download size={14} />
                            Export CSV
                        </Button>
                        <Button className="bg-accent text-black hover:bg-accent/90 gap-2 h-11 px-6 shadow-glow font-bold text-xs uppercase tracking-widest">
                            <Plus size={18} />
                            New Invoice
                        </Button>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex p-1 bg-surface/30 border border-border-default rounded-lg">
                        {filters.map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={cn(
                                    "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                                    f === activeFilter ? "bg-accent text-black" : "text-text-tertiary hover:text-white"
                                )}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
                        <input
                            placeholder="Search invoices..."
                            className="w-full bg-surface/30 border border-border-default/50 rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
                        />
                    </div>
                </div>

                {/* Invoices Table */}
                <div className="bg-background border border-border-default rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-default bg-surface/10">
                                    <th className="px-6 py-5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Invoice</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Client</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Items</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Issued</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Due</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-default/50">
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-surface/10 transition-colors group">
                                        <td className="px-6 py-5 text-sm font-mono text-text-tertiary group-hover:text-foreground transition-colors">{invoice.id}</td>
                                        <td className="px-8 py-5 text-sm font-bold text-white tracking-tight">{invoice.client}</td>
                                        <td className="px-8 py-5 text-sm text-text-tertiary font-mono">{invoice.items}</td>
                                        <td className="px-8 py-5 text-sm font-mono font-bold text-white tracking-tighter">{invoice.amount}</td>
                                        <td className="px-8 py-5 text-sm text-text-tertiary">{invoice.issued}</td>
                                        <td className="px-8 py-5 text-sm text-text-tertiary">{invoice.due}</td>
                                        <td className="px-8 py-5">
                                            <Badge variant={invoice.status} className="px-3 py-1 text-[10px]">
                                                {invoice.status}
                                            </Badge>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <ActionsDropdown invoiceId={invoice.id} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
