"use client";

import { use, useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Download, Send, Edit, CheckCircle2, ChevronLeft, MoreVertical, Printer, Eye, Plus, Loader2, Calendar, FileText, XCircle, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useBusiness } from "@/context/BusinessContext";
import { useRouter } from "next/navigation";
import { ActionsDropdown } from "@/components/dashboard/ActionsDropdown";

interface InvoiceItem {
    description: string;
    quantity: number;
    unitPrice: number;
    taxPercent: number;
}

interface Invoice {
    id: string;
    number: string;
    status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
    total: number;
    subtotal: number;
    taxAmount: number;
    discount: number;
    currency: string;
    dueDate: string;
    createdAt: string;
    notes?: string;
    terms?: string;
    client: {
        name: string;
        email: string;
        company?: string;
    };
    items: InvoiceItem[];
}

export default function InvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { activeBusiness } = useBusiness();

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchInvoice = async () => {
        setIsLoading(true);
        try {
            const data = await api.get<Invoice>(`/v1/invoices/${id}`);
            setInvoice(data);
        } catch (error) {
            console.error("Failed to fetch invoice:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchInvoice();
    }, [id]);

    const handleStatusAction = async (action: 'send' | 'paid' | 'cancel') => {
        setIsActionLoading(true);
        try {
            await api.post(`/v1/invoices/${id}/${action}`, {});
            await fetchInvoice();
        } catch (error) {
            console.error(`Failed to ${action} invoice:`, error);
            alert(`Could not ${action} invoice.`);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleDownload = async () => {
        setIsActionLoading(true);
        try {
            const data = await api.get<{ url: string }>(`/v1/invoices/${id}/pdf`);
            window.open(data.url, '_blank');
        } catch (error) {
            console.error("Failed to download PDF:", error);
            alert("Could not generate PDF. Please try again.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        if (!invoice) return amount.toString();
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: invoice.currency,
        }).format(amount);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-[calc(100vh-64px)] bg-background animate-pulse">
                {/* Skeleton Header */}
                <div className="h-24 bg-surface/30 border-b border-border-default/50 flex items-center px-8">
                    <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                        <div className="flex items-center gap-6">
                            <div className="h-11 w-11 rounded-full bg-surface/50" />
                            <div className="space-y-2">
                                <div className="h-6 w-32 bg-surface/50 rounded" />
                                <div className="h-3 w-48 bg-surface/30 rounded" />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <div className="h-11 w-32 bg-surface/50 rounded-lg" />
                            <div className="h-11 w-40 bg-surface/50 rounded-lg" />
                        </div>
                    </div>
                </div>

                {/* Skeleton Main Content */}
                <div className="flex-1 p-8 lg:p-12">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            <div className="aspect-[1/1.4] bg-surface/20 rounded-2xl border border-border-default shadow-2xl" />
                        </div>
                        <div className="space-y-10">
                            <div className="space-y-4">
                                <div className="h-4 w-24 bg-surface/40 rounded" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-20 bg-surface/30 rounded-xl" />
                                    <div className="h-20 bg-surface/30 rounded-xl" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-4 w-32 bg-surface/40 rounded" />
                                <div className="h-48 bg-surface/30 rounded-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!invoice) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-background px-6">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center text-error mx-auto border border-error/20">
                        <XCircle size={40} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Invoice Not Found</h1>
                        <p className="text-text-tertiary mt-2">The invoice you're looking for doesn't exist or you don't have permission to view it.</p>
                    </div>
                    <Link href="/dashboard/invoices">
                        <Button className="bg-accent text-black font-bold uppercase tracking-widest h-12 px-8 shadow-glow">
                            Back to Invoices
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-background">
            <div className="sticky top-0 z-[50] bg-background/80 backdrop-blur-xl border-b border-border-default/50 px-8 py-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard/invoices">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-surface border border-border-default h-11 w-11 shadow-sm">
                                <ChevronLeft size={20} />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-4">
                                <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">{invoice.number}</h1>
                                <Badge variant={invoice.status.toLowerCase() as any} className="px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm">
                                    {invoice.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1.5">
                                <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                                    <Clock size={14} />
                                    <span>Created {formatDate(invoice.createdAt)}</span>
                                </div>
                                <span className="w-1 h-1 rounded-full bg-border-default" />
                                <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
                                    <Calendar size={14} />
                                    <span>Due {formatDate(invoice.dueDate)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button
                            variant="secondary"
                            className="font-bold text-[10px] uppercase tracking-widest h-11 px-6 border border-border-default hover:bg-surface transition-all gap-2"
                            onClick={handleDownload}
                            disabled={isActionLoading}
                        >
                            {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                            Download PDF
                        </Button>

                        {invoice.status === 'DRAFT' && (
                            <Button
                                className="bg-accent text-black hover:bg-accent/90 gap-2 h-11 px-8 shadow-glow font-bold text-[10px] uppercase tracking-widest"
                                onClick={() => handleStatusAction('send')}
                                disabled={isActionLoading}
                            >
                                {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                                Send to Client
                            </Button>
                        )}

                        {(invoice.status === 'SENT' || invoice.status === 'OVERDUE') && (
                            <Button
                                className="bg-success text-white hover:bg-success/90 gap-2 h-11 px-8 font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-success/10 border-none"
                                onClick={() => handleStatusAction('paid')}
                                disabled={isActionLoading}
                            >
                                {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                                Mark as Paid
                            </Button>
                        )}

                        <ActionsDropdown
                            invoiceId={id}
                            onAction={(action: string) => action === 'refresh' && fetchInvoice()}
                            align="right"
                        />
                    </div>
                </div>
            </div>

            <main className="flex-1 p-8 lg:p-12 overflow-y-auto bg-surface/5 custom-scrollbar">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Invoice Preview Container */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-elevated/30 border border-border-default/50 rounded-2xl p-4 lg:p-12 flex justify-center backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                            {/* Decorative background glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

                            {/* Virtual PDF Paper */}
                            <div className="w-full aspect-[1/1.414] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.4)] rounded-sm p-14 text-slate-800 max-w-[800px] flex flex-col relative z-10 transition-transform duration-500 group-hover:scale-[1.01]">

                                {/* Header */}
                                <div className="flex justify-between items-start mb-12">
                                    <div className="logo">
                                        {activeBusiness?.logoUrl ? (
                                            <img src={activeBusiness.logoUrl} alt={activeBusiness.name} className="h-12 object-contain" />
                                        ) : (
                                            <div className="text-2xl font-bold text-slate-900 leading-none">{activeBusiness?.name || "Your Business"}</div>
                                        )}
                                        <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest leading-none">Verified Merchant</p>
                                    </div>
                                    <div className="text-right">
                                        <h1 className="text-3xl font-bold text-slate-900 uppercase tracking-tighter mb-1">Invoice</h1>
                                        <div className="text-sm font-medium text-slate-400">#{invoice.number}</div>
                                        <div className="mt-2">
                                            <Badge variant={invoice.status.toLowerCase() as any} className="px-3 py-1 bg-slate-100 text-slate-500 border-none text-[10px] font-bold uppercase tracking-widest rounded">
                                                {invoice.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Parties */}
                                <div className="flex gap-8 mb-10 text-xs">
                                    <div className="flex-1">
                                        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">From</div>
                                        <div className="font-bold text-slate-900 text-sm mb-1">{activeBusiness?.name || "Your Business"}</div>
                                        <div className="text-slate-500 space-y-0.5 font-medium">
                                            <p>{activeBusiness?.email}</p>
                                            {activeBusiness?.phone && <p>{activeBusiness.phone}</p>}
                                            {activeBusiness?.address && <p>{activeBusiness.address}</p>}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-2">Bill To</div>
                                        <div className="font-bold text-slate-900 text-sm mb-1">{invoice.client.name}</div>
                                        <div className="text-slate-500 space-y-0.5 font-medium">
                                            {invoice.client.company && <p>{invoice.client.company}</p>}
                                            <p>{invoice.client.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dates Row */}
                                <div className="flex gap-8 bg-slate-50/50 border border-slate-100 rounded-lg p-5 mb-10">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Issue Date</span>
                                        <span className="text-xs font-bold text-slate-900">{formatDate(invoice.createdAt)}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Due Date</span>
                                        <span className="text-xs font-bold text-slate-900">{formatDate(invoice.dueDate)}</span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Currency</span>
                                        <span className="text-xs font-bold text-slate-900">{invoice.currency}</span>
                                    </div>
                                </div>

                                {/* Line Items */}
                                <div className="flex-1">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-900 text-white">
                                                <th className="py-2.5 px-4 text-left text-[9px] font-bold uppercase tracking-widest rounded-l-md">Description</th>
                                                <th className="py-2.5 px-4 text-center text-[9px] font-bold uppercase tracking-widest">Qty</th>
                                                <th className="py-2.5 px-4 text-right text-[9px] font-bold uppercase tracking-widest">Price</th>
                                                <th className="py-2.5 px-4 text-right text-[9px] font-bold uppercase tracking-widest rounded-r-md">Amount</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {invoice.items.map((item, i) => (
                                                <tr key={i}>
                                                    <td className="py-5 px-4">
                                                        <p className="text-xs font-bold text-slate-900 leading-snug">{item.description}</p>
                                                    </td>
                                                    <td className="py-5 px-4 text-center text-xs font-mono font-medium text-slate-500">{item.quantity}</td>
                                                    <td className="py-5 px-4 text-right text-xs font-mono font-medium text-slate-500">{formatCurrency(item.unitPrice)}</td>
                                                    <td className="py-5 px-4 text-right text-xs font-bold text-slate-900 font-mono">{formatCurrency(item.quantity * item.unitPrice)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Totals */}
                                <div className="mt-8 flex justify-end">
                                    <div className="w-64 space-y-2 text-xs">
                                        <div className="flex justify-between font-medium text-slate-400">
                                            <span className="uppercase tracking-widest text-[9px]">Subtotal</span>
                                            <span className="text-slate-900 font-mono">{formatCurrency(invoice.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between font-medium text-slate-400">
                                            <span className="uppercase tracking-widest text-[9px]">Tax (10%)</span>
                                            <span className="text-slate-900 font-mono">{formatCurrency(invoice.taxAmount)}</span>
                                        </div>
                                        {invoice.discount > 0 && (
                                            <div className="flex justify-between font-bold text-green-500">
                                                <span className="uppercase tracking-widest text-[9px]">Discount</span>
                                                <span className="font-mono">-{formatCurrency(invoice.discount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-end pt-4 border-t-2 border-slate-900">
                                            <span className="text-[10px] font-bold uppercase text-slate-900 tracking-tighter leading-none mb-1">Total Due</span>
                                            <span className="text-3xl font-bold font-mono text-slate-900 tracking-tighter leading-none">{formatCurrency(invoice.total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Notes */}
                                {(invoice.notes || invoice.terms) && (
                                    <div className="mt-12 flex gap-8 border-t border-slate-100 pt-8">
                                        {invoice.notes && (
                                            <div className="flex-1">
                                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 leading-none">Notes</p>
                                                <p className="text-[11px] leading-relaxed text-slate-500 font-medium italic">{invoice.notes}</p>
                                            </div>
                                        )}
                                        {invoice.terms && (
                                            <div className="flex-1">
                                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1.5 leading-none">Terms</p>
                                                <p className="text-[11px] leading-relaxed text-slate-500 font-medium italic">{invoice.terms}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Bottom Footer */}
                                <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-center text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    <span>{activeBusiness?.name} · {activeBusiness?.email}</span>
                                    <span>Generated by Invoxa</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        <section className="space-y-5">
                            <div className="flex items-center gap-2">
                                <FileText size={16} className="text-text-tertiary" />
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">Quick Links</h4>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-surface/30 border-border-default hover:border-accent/40 transition-colors cursor-pointer group">
                                    <CardContent className="p-4 flex flex-col items-center gap-2">
                                        <Printer size={18} className="text-text-tertiary group-hover:text-accent transition-colors" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Print</span>
                                    </CardContent>
                                </Card>
                                <Card className="bg-surface/30 border-border-default hover:border-accent/40 transition-colors cursor-pointer group" onClick={() => router.push(`/dashboard/invoices/new?duplicate=${id}`)}>
                                    <CardContent className="p-4 flex flex-col items-center gap-2">
                                        <ExternalLink size={18} className="text-text-tertiary group-hover:text-accent transition-colors" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Duplicate</span>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        <section className="space-y-5">
                            <div className="flex items-center gap-2">
                                <Clock size={16} className="text-text-tertiary" />
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-text-tertiary">Recent Activity</h4>
                            </div>
                            <div className="bg-surface/20 border border-border-default/50 rounded-2xl p-6 space-y-8 relative overflow-hidden">
                                <div className="absolute left-[39px] top-12 bottom-12 w-px bg-border-active/30" />

                                {([
                                    { icon: CheckCircle2, label: "Invoice Paid", status: "PAID", time: "Auto-detected Mar 15", color: "text-success", bg: "bg-success/10" },
                                    { icon: Send, label: "Sent Email", status: "SENT", time: "via Invox Mail Mar 12", color: "text-info", bg: "bg-info/10" },
                                    { icon: Eye, label: "Client Viewed", status: "VIEWED", time: "IP: 192.168.1.1 Mar 12", color: "text-accent", bg: "bg-accent/10" },
                                    { icon: FileText, label: "Created Draft", status: "CREATED", time: "User: Admin Mar 12", color: "text-text-tertiary", bg: "bg-surface" },
                                ].slice(0, invoice.status === 'PAID' ? 4 : invoice.status === 'SENT' ? 3 : 1)).map((activity, i) => (
                                    <div key={i} className="flex gap-4 relative z-10">
                                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-border-default shadow-sm", activity.bg, activity.color)}>
                                            <activity.icon size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white tracking-tight">{activity.label}</p>
                                            <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mt-1">{activity.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-5">
                            <div className="flex items-center gap-3 bg-accent/5 border border-accent/20 p-6 rounded-2xl">
                                <div className="p-3 bg-accent/10 rounded-xl text-accent">
                                    <ExternalLink size={20} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white">Client Portal Link</p>
                                    <p className="text-[10px] text-text-tertiary uppercase tracking-widest mt-1 font-bold">Share this with your client</p>
                                    <button className="text-[10px] text-accent font-black uppercase tracking-widest mt-3 hover:underline">Copy Payment Link →</button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}