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
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-accent" />
                    <p className="text-sm text-text-tertiary font-bold uppercase tracking-widest">Loading invoice data...</p>
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
                            <div className="w-full aspect-[1/1.414] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.5)] rounded-sm p-12 text-slate-800 max-w-[800px] flex flex-col relative z-10 transition-transform duration-500 group-hover:scale-[1.01]">
                                <div className="flex justify-between items-start mb-16">
                                    <div>
                                        <div className="w-16 h-16 bg-slate-900 rounded-xl mb-6 shadow-xl flex items-center justify-center text-white font-black text-2xl">
                                            {activeBusiness?.name?.substring(0, 1) || "I"}
                                        </div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">From</p>
                                        <p className="text-xl font-black text-slate-900 leading-tight">{activeBusiness?.name || "Your Business"}</p>
                                        <p className="text-[10px] text-slate-500 font-medium">Verified Merchant via Invox</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none mb-3">Invoice</h2>
                                        <div className="inline-flex border-b-4 border-slate-900 pb-1">
                                            <p className="text-sm font-mono font-black text-slate-400">#</p>
                                            <p className="text-sm font-mono font-black text-slate-900 ml-1">{invoice.number}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-16 border-y-2 border-slate-100 py-10 mb-12">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4">Billed To</p>
                                        <p className="text-lg font-black text-slate-900 leading-tight">{invoice.client.name}</p>
                                        <p className="text-xs text-slate-500 font-medium mt-1">{invoice.client.email}</p>
                                        {invoice.client.company && (
                                            <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest leading-none bg-slate-50 inline-block px-2 py-1 rounded">
                                                {invoice.client.company}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right flex flex-col justify-between items-end">
                                        <div className="grid grid-cols-2 gap-x-8 gap-y-6 w-full max-w-[200px]">
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Issue Date</p>
                                                <p className="text-xs font-black text-slate-900">{formatDate(invoice.createdAt)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Due Date</p>
                                                <p className="text-xs font-black text-slate-900">{formatDate(invoice.dueDate)}</p>
                                            </div>
                                        </div>
                                        <div className="mt-8">
                                            <Badge variant={invoice.status.toLowerCase() as any} className="px-3 py-1 bg-slate-900 text-white border-none text-[10px] font-black uppercase tracking-widest">
                                                Status: {invoice.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b-4 border-slate-900">
                                                <th className="py-5 text-left text-[10px] font-black text-slate-300 uppercase tracking-widest">Description</th>
                                                <th className="py-5 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">Quantity</th>
                                                <th className="py-5 text-right text-[10px] font-black text-slate-300 uppercase tracking-widest">Unit Price</th>
                                                <th className="py-5 text-right text-[10px] font-black text-slate-300 uppercase tracking-widest">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {invoice.items.map((item, i) => (
                                                <tr key={i}>
                                                    <td className="py-6 pr-8">
                                                        <p className="text-xs font-black text-slate-900 leading-snug">{item.description}</p>
                                                        {item.taxPercent > 0 && <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Tax: {item.taxPercent}% Included</p>}
                                                    </td>
                                                    <td className="py-6 text-center text-xs font-mono font-bold text-slate-500">{item.quantity}</td>
                                                    <td className="py-6 text-right text-xs font-mono font-bold text-slate-500">{formatCurrency(item.unitPrice)}</td>
                                                    <td className="py-6 text-right text-xs font-black text-slate-900 font-mono tracking-tighter">{formatCurrency(item.quantity * item.unitPrice)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-auto pt-10 border-t-8 border-slate-900 flex justify-between items-end">
                                    <div className="max-w-[300px] text-[9px] text-slate-400 space-y-4">
                                        {invoice.notes && (
                                            <div>
                                                <p className="font-black text-slate-300 uppercase tracking-widest mb-1.5">Internal Notes</p>
                                                <p className="leading-relaxed font-medium italic">{invoice.notes}</p>
                                            </div>
                                        )}
                                        {invoice.terms && (
                                            <div>
                                                <p className="font-black text-slate-300 uppercase tracking-widest mb-1.5">Payment Terms</p>
                                                <p className="leading-relaxed font-medium italic">{invoice.terms}</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="w-64 space-y-3">
                                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <span>Subtotal</span>
                                            <span className="text-slate-900 font-mono">{formatCurrency(invoice.subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            <span>Tax (10%)</span>
                                            <span className="text-slate-900 font-mono">{formatCurrency(invoice.taxAmount)}</span>
                                        </div>
                                        {invoice.discount > 0 && (
                                            <div className="flex justify-between text-xs font-bold text-red-500 uppercase tracking-widest">
                                                <span>Discount</span>
                                                <span className="font-mono">-{formatCurrency(invoice.discount)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-end pt-6 border-t-2 border-slate-100">
                                            <span className="text-[10px] font-black uppercase text-slate-900 tracking-tighter leading-none mb-1">Final Amount Due</span>
                                            <span className="text-4xl font-black font-mono text-slate-900 tracking-tighter leading-none">{formatCurrency(invoice.total)}</span>
                                        </div>
                                    </div>
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