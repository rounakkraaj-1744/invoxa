"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Trash2, Plus, Download, Send, Copy, Eye, Loader2, ArrowLeft, CheckCircle2, AlertCircle, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { useBusiness } from "@/context/BusinessContext";
import { ClientSelector, type Client } from "@/components/dashboard/ClientSelector";
import { cn } from "@/lib/utils";

function InvoiceBuilderContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const invoiceId = searchParams.get('id');
    const { activeBusiness } = useBusiness();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingInvoice, setIsLoadingInvoice] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const [invoice, setInvoice] = useState({
        clientId: "",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        currency: "USD",
        notes: "",
        terms: "",
        discount: 0,
        items: [{ id: Math.random().toString(), description: "", quantity: 1, unitPrice: 0 }]
    });

    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    useEffect(() => {
        if (invoiceId) {
            fetchInvoiceForEdit();
        }
    }, [invoiceId]);

    const fetchInvoiceForEdit = async () => {
        setIsLoadingInvoice(true);
        try {
            const data = await api.get<any>(`/v1/invoices/${invoiceId}`);
            setInvoice({
                clientId: data.clientId,
                dueDate: data.dueDate.split('T')[0],
                currency: data.currency,
                notes: data.notes || "",
                terms: data.terms || "",
                discount: data.discount || 0,
                items: data.items.map((item: any) => ({
                    id: Math.random().toString(),
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                }))
            });
            setSelectedClient(data.client);
        } catch (error: any) {
            console.error("Failed to fetch invoice for edit:", error);
            setErrorMessage(error.message || "Failed to load invoice for editing.");
            setStatus('error');
        } finally {
            setIsLoadingInvoice(false);
        }
    };

    const addItem = () => {
        setInvoice({
            ...invoice,
            items: [...invoice.items, { id: Math.random().toString(), description: "", quantity: 1, unitPrice: 0 }]
        });
    };

    const removeItem = (id: string) => {
        if (invoice.items.length === 1) return;
        setInvoice({
            ...invoice,
            items: invoice.items.filter(item => item.id !== id)
        });
    };

    const updateItem = (id: string, field: string, value: any) => {
        setInvoice({
            ...invoice,
            items: invoice.items.map(item => item.id === id ? { ...item, [field]: value } : item)
        });
    };

    const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const taxAmount = subtotal * 0.1; // Placeholder 10% tax for default
    const total = subtotal + taxAmount - invoice.discount;

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!activeBusiness) return;
        if (!invoice.clientId) {
            setStatus('error');
            setErrorMessage("Please select a client first.");
            return;
        }

        setIsSubmitting(true);
        setStatus('idle');

        try {
            const payload = {
                clientId: invoice.clientId,
                dueDate: new Date(invoice.dueDate).toISOString(),
                currency: invoice.currency,
                subtotal: subtotal,
                taxAmount: taxAmount,
                discount: invoice.discount,
                total: total,
                notes: invoice.notes,
                terms: invoice.terms,
                items: invoice.items.map(({ id, ...rest }) => rest)
            };

            if (invoiceId) {
                await api.put(`/v1/invoices/${invoiceId}`, payload, {
                    headers: { 'x-business-id': activeBusiness.id }
                });
            } else {
                await api.post("/v1/invoices", payload, {
                    headers: { 'x-business-id': activeBusiness.id }
                });
            }

            setStatus('success');
            router.push("/dashboard/invoices");
        } catch (error: any) {
            console.error("Failed to save invoice:", error);
            setStatus('error');
            setErrorMessage(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: invoice.currency,
        }).format(amount);
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-64px)] bg-background overflow-hidden relative">
            {/* Sticky Header */}
            <div className="sticky top-0 z-[60] bg-background/80 backdrop-blur-xl border-b border-border-default/50 px-8 py-5">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard/invoices">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-surface border border-border-default h-11 w-11 shadow-sm transition-all hover:scale-110 active:scale-95">
                                <ArrowLeft size={20} />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-widest uppercase italic leading-none">{invoiceId ? 'Edit' : 'New'} Invoice</h1>
                            <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                Draft Mode <span className="w-1 h-1 rounded-full bg-border-active" /> Auto-saving enabled
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link href="/dashboard/invoices">
                            <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-text-tertiary hover:text-white h-11 px-6">Cancel</Button>
                        </Link>
                        <Button
                            onClick={() => handleSubmit()}
                            disabled={isSubmitting || isLoadingInvoice}
                            className="bg-accent text-black hover:bg-accent/90 gap-2 h-11 px-8 shadow-glow font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (status === 'success' ? <CheckCircle2 size={16} /> : <Download size={16} />)}
                            {status === 'success' ? 'Saved' : (invoiceId ? 'Update' : 'Generate') + ' Invoice'}
                        </Button>
                    </div>
                </div>
            </div>

            {isLoadingInvoice && (
                <div className="absolute inset-0 z-[100] bg-background/40 backdrop-blur-[4px] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4 bg-elevated border border-border-default p-10 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="relative">
                            <Loader2 className="w-12 h-12 animate-spin text-accent" />
                            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Synchronizing Data...</p>
                    </div>
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* Left Pane - Form Editor */}
                <div className="w-1/2 overflow-y-auto px-12 py-10 custom-scrollbar border-r border-border-default/50 bg-surface/5">
                    <form className="max-w-xl mx-auto space-y-12 pb-20">
                        {/* Client & Date Section */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3 border-l-4 border-accent pl-4">
                                <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Billing Information</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2 col-span-2">
                                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">Client Selection</label>
                                    <ClientSelector
                                        onClientData={(client) => {
                                            setSelectedClient(client);
                                        }}
                                        onChange={(clientId) => {
                                            setInvoice({ ...invoice, clientId });
                                        }}
                                        value={invoice.clientId}
                                    />
                                    <AnimatePresence>
                                        {selectedClient && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="mt-3 p-4 bg-accent/5 border border-accent/20 rounded-2xl flex items-center gap-4"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shadow-inner">
                                                    <UserIcon size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-white uppercase tracking-tight">{selectedClient.name}</p>
                                                    <p className="text-[9px] text-text-tertiary font-bold uppercase tracking-widest">{selectedClient.email}</p>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">Due Date</label>
                                    <Input
                                        type="date"
                                        value={invoice.dueDate}
                                        onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                                        className="bg-elevated/50 border-border-default h-12 font-mono text-xs uppercase"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">Currency</label>
                                    <select
                                        value={invoice.currency}
                                        onChange={(e) => setInvoice({ ...invoice, currency: e.target.value })}
                                        className="w-full bg-elevated/50 border border-border-default rounded-xl h-12 px-4 text-xs font-mono uppercase focus:border-accent outline-none transition-all hover:bg-elevated/80"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="INR">INR (₹)</option>
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Items Section */}
                        <section className="space-y-8">
                            <div className="flex items-center justify-between border-l-4 border-info pl-4">
                                <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Line Items</h2>
                                <Badge variant="accent" className="font-mono">{invoice.items.length} {invoice.items.length === 1 ? 'Item' : 'Items'}</Badge>
                            </div>

                            <div className="space-y-4">
                                {invoice.items.map((item) => (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.98 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        key={item.id}
                                        className="group relative bg-elevated/30 border border-border-default/50 rounded-[2rem] p-6 transition-all hover:bg-elevated/50 hover:border-border-active shadow-sm"
                                    >
                                        <div className="grid grid-cols-12 gap-5 items-end">
                                            <div className="col-span-12 md:col-span-6 space-y-2">
                                                <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest ml-1">Description</label>
                                                <Input
                                                    placeholder="E.g. Branding Consultation"
                                                    value={item.description}
                                                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                                    className="bg-surface/50 border-none h-11 text-xs font-black placeholder:font-bold placeholder:opacity-30"
                                                />
                                            </div>
                                            <div className="col-span-4 md:col-span-2 space-y-2">
                                                <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest ml-1 text-center block">Qty</label>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                                                    className="bg-surface/50 border-none h-11 text-xs text-center font-mono font-bold"
                                                />
                                            </div>
                                            <div className="col-span-6 md:col-span-3 space-y-2">
                                                <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest ml-1 text-right block">Price</label>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        value={item.unitPrice}
                                                        onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                                                        className="bg-surface/50 border-none h-11 text-xs font-mono text-right pr-4 pl-8 font-bold"
                                                    />
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-black text-text-tertiary font-mono">{invoice.currency === 'USD' ? '$' : invoice.currency}</span>
                                                </div>
                                            </div>
                                            <div className="col-span-2 md:col-span-1 flex justify-end pb-1">
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(item.id)}
                                                    className="p-3 text-text-tertiary hover:text-error transition-all hover:bg-error/10 rounded-2xl"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={addItem}
                                className="w-full h-16 border-2 border-dashed border-border-default/50 hover:border-accent/40 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] gap-3 text-text-tertiary hover:text-accent transition-all hover:bg-accent/5 mt-4"
                            >
                                <Plus size={16} />
                                Add Line Item
                            </Button>
                        </section>

                        {/* Additional Info Section */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-3 border-l-4 border-accent pl-4">
                                <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] italic">Terms & Notes</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">Payment Notes</label>
                                    <textarea
                                        className="w-full bg-elevated/50 border border-border-default rounded-[2rem] p-6 text-xs min-h-[120px] outline-none focus:border-accent transition-all resize-none font-bold text-text-secondary placeholder:opacity-20 custom-scrollbar"
                                        placeholder="Add any specific payment instructions or internal notes..."
                                        value={invoice.notes}
                                        onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-widest ml-1">Contractual Terms</label>
                                    <textarea
                                        className="w-full bg-elevated/50 border border-border-default rounded-[2rem] p-6 text-xs min-h-[120px] outline-none focus:border-accent transition-all resize-none font-bold text-text-secondary placeholder:opacity-20 custom-scrollbar"
                                        placeholder="Add terms and conditions (e.g., Net 30, Late fees apply...)"
                                        value={invoice.terms}
                                        onChange={(e) => setInvoice({ ...invoice, terms: e.target.value })}
                                    />
                                </div>
                            </div>
                        </section>
                    </form>
                </div>

                {/* Right Pane - Preview */}
                <div className="w-1/2 bg-elevated/5 p-12 overflow-y-auto custom-scrollbar flex justify-center items-start shadow-inner relative">
                    <div className="w-full max-w-[800px] bg-white shadow-[0_40px_100px_rgba(0,0,0,0.4)] rounded-sm p-14 text-slate-800 flex flex-col aspect-[1/1.414] animate-in fade-in zoom-in-98 duration-700 relative overflow-hidden">

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
                                <div className="text-sm font-medium text-slate-400">#{invoiceId ? 'REF-' + invoiceId.substring(0, 4).toUpperCase() : 'DRAFT_GEN'}</div>
                                <div className="mt-2">
                                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase tracking-widest">
                                        {invoiceId ? 'Pending' : 'Draft'}
                                    </span>
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
                                {selectedClient ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <div className="font-bold text-slate-900 text-sm mb-1">{selectedClient.name}</div>
                                        <div className="text-slate-500 space-y-0.5 font-medium">
                                            {selectedClient.company && <p>{selectedClient.company}</p>}
                                            <p>{selectedClient.email}</p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="space-y-2 opacity-20">
                                        <div className="h-4 w-3/4 bg-slate-200 rounded" />
                                        <div className="h-3 w-1/2 bg-slate-200 rounded" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Dates Row */}
                        <div className="flex gap-8 bg-slate-50/50 border border-slate-100 rounded-lg p-5 mb-10">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Issue Date</span>
                                <span className="text-xs font-bold text-slate-900">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Due Date</span>
                                <span className="text-xs font-bold text-slate-900">{new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
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
                                    {invoice.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="py-5 px-4">
                                                <p className="text-xs font-bold text-slate-900 leading-snug">{item.description || "Unspecified Service"}</p>
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
                                    <span className="text-slate-900 font-mono">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between font-medium text-slate-400">
                                    <span className="uppercase tracking-widest text-[9px]">Tax (10%)</span>
                                    <span className="text-slate-900 font-mono">{formatCurrency(taxAmount)}</span>
                                </div>
                                {invoice.discount > 0 && (
                                    <div className="flex justify-between font-bold text-green-500">
                                        <span className="uppercase tracking-widest text-[9px]">Discount</span>
                                        <span className="font-mono">-{formatCurrency(invoice.discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between items-end pt-4 border-t-2 border-slate-900">
                                    <span className="text-[10px] font-bold uppercase text-slate-900 tracking-tighter leading-none mb-1">Total Due</span>
                                    <span className="text-3xl font-bold font-mono text-slate-900 tracking-tighter leading-none">{formatCurrency(total)}</span>
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

            {/* Error Overlay */}
            <AnimatePresence>
                {status === 'error' && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] bg-error border border-white/20 text-white p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(239,68,68,0.3)] flex items-center gap-4 max-w-md w-[calc(100%-40px)]"
                    >
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shadow-inner">
                            <AlertCircle size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70 mb-1 text-white">System Validation Error</p>
                            <p className="text-sm font-black tracking-tight">{errorMessage}</p>
                        </div>
                        <button onClick={() => setStatus('idle')} className="text-white/50 hover:text-white transition-all hover:rotate-90 p-2">
                            <Plus className="rotate-45" size={24} />
                        </button>
                    </motion.div>
                )}

                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-2xl flex items-center justify-center p-6"
                    >
                        <div className="bg-elevated border border-border-default/50 p-16 rounded-[4rem] text-center max-w-xl shadow-[0_60px_120px_rgba(0,0,0,0.9)] border-b-[12px] border-b-accent relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-accent to-transparent animate-pulse" />
                            <div className="w-28 h-28 bg-accent/20 rounded-full flex items-center justify-center text-accent mx-auto mb-10 shadow-[0_0_40px_rgba(var(--accent-rgb),0.2)] animate-success-pop">
                                <CheckCircle2 size={56} className="animate-in zoom-in-50 duration-500" />
                            </div>
                            <h2 className="text-5xl font-black text-white uppercase tracking-tighter italic mb-6">Invoice Securely {invoiceId ? 'Updated' : 'Generated'}</h2>
                            <p className="text-text-tertiary mb-12 text-xl font-bold leading-relaxed max-w-sm mx-auto opacity-80 uppercase tracking-widest">Your records have been updated successfully. Finalizing workspace sync...</p>
                            <div className="flex items-center justify-center gap-4">
                                <Loader2 size={28} className="animate-spin text-accent opacity-50" />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Redirecting</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function InvoiceBuilder() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-background">
                <Loader2 className="w-10 h-10 animate-spin text-accent" />
            </div>
        }>
            <InvoiceBuilderContent />
        </Suspense>
    );
}
