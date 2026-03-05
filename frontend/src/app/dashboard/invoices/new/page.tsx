"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trash2, Plus, Download, Send, Copy, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";


export default function InvoiceBuilder() {
    const [invoice, setInvoice] = useState({
        number: "INV-1043",
        date: new Date().toISOString().split('T')[0],
        dueDate: "",
        clientName: "",
        clientEmail: "",
        items: [{ id: 1, description: "", qty: 1, rate: 0 }],
        notes: "",
        currency: "USD"
    });

    const addItem = () => {
        setInvoice({
            ...invoice,
            items: [...invoice.items, { id: Date.now(), description: "", qty: 1, rate: 0 }]
        });
    };

    const removeItem = (id: number) => {
        if (invoice.items.length === 1) return;
        setInvoice({
            ...invoice,
            items: invoice.items.filter(item => item.id !== id)
        });
    };

    const updateItem = (id: number, field: string, value: any) => {
        setInvoice({
            ...invoice,
            items: invoice.items.map(item => item.id === id ? { ...item, [field]: value } : item)
        });
    };

    const subtotal = invoice.items.reduce((acc, item) => acc + (item.qty * item.rate), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return (
        <div className="flex h-[calc(100vh-64px)]">
            {/* Left Pane - Form Editor */}
            <div className="flex-1 overflow-y-auto p-6 border-r border-border-default space-y-12 bg-background/30">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-2xl font-bold">New Invoice</h1>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Save Draft</Button>
                        <Button size="sm">Send Invoice</Button>
                    </div>
                </div>

                {/* Invoice Meta */}
                <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Invoice Number</label>
                        <Input value={invoice.number} onChange={(e) => setInvoice({ ...invoice, number: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Issue Date</label>
                        <Input type="date" value={invoice.date} onChange={(e) => setInvoice({ ...invoice, date: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Due Date</label>
                        <Input type="date" value={invoice.dueDate} onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })} />
                    </div>
                </div>

                {/* Client Info */}
                <section className="space-y-6">
                    <h2 className="text-sm font-bold text-foreground border-b border-border-default pb-2">Bill To (Client)</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Client Name</label>
                            <Input placeholder="Acme Corp" value={invoice.clientName} onChange={(e) => setInvoice({ ...invoice, clientName: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Client Email</label>
                            <Input placeholder="billing@acme.com" value={invoice.clientEmail} onChange={(e) => setInvoice({ ...invoice, clientEmail: e.target.value })} />
                        </div>
                    </div>
                </section>

                {/* Line Items */}
                <section className="space-y-6">
                    <h2 className="text-sm font-bold text-foreground border-b border-border-default pb-2">Line Items</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-12 gap-4 px-2 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">
                            <div className="col-span-6">Description</div>
                            <div className="col-span-2">Qty</div>
                            <div className="col-span-3">Rate</div>
                            <div className="col-span-1"></div>
                        </div>

                        <AnimatePresence>
                            {invoice.items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="grid grid-cols-12 gap-4 items-start"
                                >
                                    <div className="col-span-6">
                                        <Input placeholder="Description of service..." value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} />
                                    </div>
                                    <div className="col-span-2">
                                        <Input type="number" value={item.qty} onChange={(e) => updateItem(item.id, 'qty', parseFloat(e.target.value))} />
                                    </div>
                                    <div className="col-span-3">
                                        <div className="relative">
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary text-xs">$</div>
                                            <Input className="pl-6" type="number" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value))} />
                                        </div>
                                    </div>
                                    <div className="col-span-1 pt-1">
                                        <button onClick={() => removeItem(item.id)} className="p-2 text-text-tertiary hover:text-error transition-colors hover:bg-error/10 rounded-md">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        <Button variant="ghost" className="w-full border-dashed gap-2" onClick={addItem}>
                            <Plus size={16} />
                            <span>Add Line Item</span>
                        </Button>
                    </div>
                </section>

                <section className="flex justify-end pr-12">
                    <div className="w-64 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Subtotal</span>
                            <span className="font-mono">${subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-text-secondary">Tax (10%)</span>
                            <span className="font-mono">${tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t border-border-default pt-3">
                            <span>Total</span>
                            <span className="text-accent font-mono">${total.toLocaleString()}</span>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <label className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Notes / Terms</label>
                    <textarea
                        className="w-full bg-surface border border-border-default rounded-md p-4 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
                        placeholder="Thank you for your business..."
                        value={invoice.notes}
                        onChange={(e) => setInvoice({ ...invoice, notes: e.target.value })}
                    />
                </section>
            </div>

            {/* Right Pane - Live Preview */}
            <div className="w-[450px] xl:w-[500px] bg-elevated flex flex-col items-center p-6 overflow-y-auto hidden lg:flex">
                <div className="w-full mb-6 flex items-center justify-between">
                    <Badge variant="accent" className="gap-2">
                        <Eye size={12} />
                        <span>Live Preview</span>
                    </Badge>
                    <div className="flex gap-2">
                        <button className="p-2 hover:bg-surface rounded-md text-text-secondary transition-colors" title="Download PDF"><Download size={18} /></button>
                        <button className="p-2 hover:bg-surface rounded-md text-text-secondary transition-colors" title="Copy Link"><Copy size={18} /></button>
                    </div>
                </div>

                {/* Virtual Paper */}
                <div className="w-full aspect-[1/1.414] bg-white shadow-2xl rounded-sm p-10 text-slate-800 flex flex-col space-y-8 select-none">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="w-12 h-12 bg-slate-900 rounded-sm mb-4" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">From</p>
                            <p className="text-sm font-bold">Rounak K. Design</p>
                            <p className="text-[10px] text-slate-500">Bangalore, India</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold text-slate-900 uppercase tracking-tighter">Invoice</h2>
                            <p className="text-xs font-mono text-slate-500 mt-1">{invoice.number}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2">Bill To</p>
                            <p className="text-sm font-bold">{invoice.clientName || 'Client Name'}</p>
                            <p className="text-[10px] text-slate-500">{invoice.clientEmail || 'client@example.com'}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Issue Date</p>
                            <p className="text-xs">{invoice.date}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-3 mb-1">Due Date</p>
                            <p className="text-xs">{invoice.dueDate || 'Upon receipt'}</p>
                        </div>
                    </div>

                    <table className="w-full mt-8 border-t border-slate-100">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Description</th>
                                <th className="py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Amt</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items.map((item, i) => (
                                <tr key={i} className="border-b border-slate-50">
                                    <td className="py-4">
                                        <p className="text-xs font-bold text-slate-800">{item.description || 'Service Description'}</p>
                                        <p className="text-[9px] text-slate-400">{item.qty} x ${item.rate.toLocaleString()}</p>
                                    </td>
                                    <td className="py-4 text-right text-xs font-bold text-slate-800">
                                        ${(item.qty * item.rate).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-auto space-y-2 pt-8">
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Tax (10%)</span>
                            <span>${tax.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-100 pt-4">
                            <span>Total {invoice.currency}</span>
                            <span>${total.toLocaleString()}</span>
                        </div>
                    </div>

                    {invoice.notes && (
                        <div className="mt-8 pt-8 border-t border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2">Notes</p>
                            <p className="text-[10px] text-slate-500 leading-relaxed italic">{invoice.notes}</p>
                        </div>
                    )}
                </div>

                <div className="mt-8 p-4 bg-accent/10 border border-accent/20 rounded-lg w-full">
                    <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1 flex items-center gap-2">
                        <span>💡</span> Developer Tip
                    </p>
                    <p className="text-xs text-text-secondary leading-normal">
                        You can generate this invoice programmatically via <code className="text-accent font-mono bg-accent/5 px-1">POST /v1/invoices</code>.
                        <Link href="/docs" className="underline ml-1">View API docs →</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
