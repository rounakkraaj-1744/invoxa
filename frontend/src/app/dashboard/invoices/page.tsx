"use client"

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
    Plus,
    Search,
    Download,
    Loader2,
    Calendar,
    User as UserIcon,
    FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionsDropdown } from "@/components/dashboard/ActionsDropdown";
import { api } from "@/lib/api";
import { useBusiness } from "@/context/BusinessContext";

interface Invoice {
    id: string;
    number: string;
    status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
    total: number;
    currency: string;
    dueDate: string;
    createdAt: string;
    client: {
        name: string;
        email: string;
    };
    _count?: {
        items: number;
    };
}

export default function InvoicesPage() {
    const { activeBusiness, isLoading: isBusinessLoading } = useBusiness();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    const filters = ["All", "Draft", "Sent", "Paid", "Overdue", "Cancelled"];

    const fetchInvoices = async () => {
        if (!activeBusiness) return;
        setIsLoading(true);
        try {
            const params: any = {};
            if (activeFilter !== "All") params.status = activeFilter.toUpperCase();
            if (searchQuery) params.search = searchQuery;

            const data = await api.get<Invoice[]>("/v1/invoices", { params });
            setInvoices(data);
        } catch (error) {
            console.error("Failed to fetch invoices:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchInvoices();
        }, 300);
        return () => clearTimeout(timer);
    }, [activeBusiness, activeFilter, searchQuery]);

    const formatCurrency = (amount: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <DashboardHeader title="Invoices" />

            <main className="p-6 space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Invoices</h1>
                        <p className="text-sm text-text-tertiary">Monitor and manage your billing cycles.</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="ghost" className="border-border-default gap-2 text-xs font-bold uppercase tracking-widest text-text-tertiary hover:text-white h-11">
                            <Download size={14} />
                            Export CSV
                        </Button>
                        <Link href="/dashboard/invoices/new">
                            <Button className="bg-accent text-black hover:bg-accent/90 gap-2 h-11 px-6 shadow-glow font-bold text-xs uppercase tracking-widest">
                                <Plus size={18} />
                                New Invoice
                            </Button>
                        </Link>
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
                                    "px-4 py-1.5 text-xs font-bold rounded-md transition-all uppercase tracking-widest",
                                    f === activeFilter ? "bg-accent text-black shadow-lg shadow-accent/20" : "text-text-tertiary hover:text-white"
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-surface/30 border border-border-default/50 rounded-lg pl-10 pr-4 py-2 text-sm text-foreground focus:outline-none focus:border-accent transition-all"
                        />
                    </div>
                </div>

                {/* Invoices Table */}
                <div className="bg-background border border-border-default rounded-xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-default bg-surface/10">
                                    <th className="px-6 py-5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Invoice</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Client</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Amount</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Due Date</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-default/50">
                                {isBusinessLoading || isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-3">
                                                <Loader2 className="w-8 h-8 animate-spin text-accent" />
                                                <p className="text-sm text-text-tertiary font-medium">{isBusinessLoading ? 'Syncing workspace...' : 'Loading invoices...'}</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : !activeBusiness ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <p className="text-sm text-text-tertiary">Please select a business to view invoices.</p>
                                        </td>
                                    </tr>
                                ) : invoices.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 bg-surface/30 rounded-full flex items-center justify-center text-text-tertiary border border-border-default">
                                                    <FileText size={32} />
                                                </div>
                                                <div>
                                                    <p className="text-lg font-bold text-white">No invoices found</p>
                                                    <p className="text-sm text-text-tertiary">Try adjusting your filters or create a new invoice.</p>
                                                </div>
                                                <Link href="/dashboard/invoices/new">
                                                    <Button variant="ghost" className="border-border-default">Create First Invoice</Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    invoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-surface/5 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white tracking-tight">{invoice.number}</span>
                                                    <span className="text-[10px] text-text-tertiary">{formatDate(invoice.createdAt)}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white">{invoice.client.name}</span>
                                                    <span className="text-[10px] text-text-tertiary">{invoice.client.email}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-sm font-mono font-bold text-accent tracking-tighter">
                                                {formatCurrency(invoice.total, invoice.currency)}
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                    <Calendar size={14} className="text-text-tertiary" />
                                                    {formatDate(invoice.dueDate)}
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <Badge variant={invoice.status.toLowerCase() as any} className="px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                                                    {invoice.status}
                                                </Badge>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <ActionsDropdown
                                                    invoiceId={invoice.id}
                                                    onAction={(action) => action === 'refresh' && fetchInvoices()}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
