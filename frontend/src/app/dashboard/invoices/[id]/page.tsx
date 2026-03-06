"use client";

import { use } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Download, Send, Edit, CheckCircle2, ChevronLeft, MoreVertical, Printer, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export default function InvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <DashboardHeader title={`Invoice ${id}`} />

            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Action Bar */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/invoices" className="p-2 hover:bg-surface border border-border-default rounded-md text-text-secondary transition-colors">
                                <ChevronLeft size={20} />
                            </Link>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold">{id}</h1>
                                    <Badge variant="paid">Paid</Badge>
                                </div>
                                <p className="text-sm text-text-secondary mt-1">Sent to <span className="text-foreground font-medium">Acme Corp</span> on Mar 12, 2026</p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Edit size={16} /> Edit
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Download size={16} /> Download
                            </Button>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Printer size={16} /> Print
                            </Button>
                            <Button size="sm" className="gap-2">
                                <Send size={16} /> Send Again
                            </Button>
                            <Button variant="ghost" size="sm">
                                <MoreVertical size={16} />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Invoice Preview Container */}
                        <div className="lg:col-span-2 bg-surface/50 border border-border-default rounded-xl p-10 flex justify-center overflow-hidden">
                            {/* Virtual PDF Preview - reuse the logic from builder or create a component */}
                            <div className="w-full aspect-[1/1.414] bg-white shadow-lg rounded-sm p-12 text-slate-800 max-w-[800px]">
                                <div className="flex justify-between items-start mb-16">
                                    <div>
                                        <div className="w-16 h-16 bg-slate-900 rounded-sm mb-6" />
                                        <h3 className="text-lg font-bold">Rounak K. Design</h3>
                                        <p className="text-xs text-slate-500 mt-1">Bangalore, KA 560103</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-4xl font-bold text-slate-900 uppercase tracking-tighter mb-2">Invoice</h2>
                                        <p className="font-mono text-slate-400">{id}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-12 mb-16">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Billed To</p>
                                        <p className="text-base font-bold">Acme Corporation</p>
                                        <p className="text-xs text-slate-500 mt-1">123 Business Way, San Francisco</p>
                                        <p className="text-xs text-slate-500">accounts@acme.corp</p>
                                    </div>
                                    <div className="text-right grid grid-cols-2 gap-y-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issue Date</p>
                                            <p className="text-xs font-medium">Mar 12, 2026</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Due Date</p>
                                            <p className="text-xs font-medium">Mar 27, 2026</p>
                                        </div>
                                    </div>
                                </div>

                                <table className="w-full mb-12">
                                    <thead>
                                        <tr className="border-b-2 border-slate-900">
                                            <th className="py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Item</th>
                                            <th className="py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price</th>
                                            <th className="py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">Qty</th>
                                            <th className="py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-slate-100">
                                            <td className="py-6">
                                                <p className="text-sm font-bold">Landing Page Redesign</p>
                                                <p className="text-[10px] text-slate-400 mt-1">Full redesign of company homepage</p>
                                            </td>
                                            <td className="py-6 text-center text-sm">$2,500.00</td>
                                            <td className="py-6 text-center text-sm">1</td>
                                            <td className="py-6 text-right text-sm font-bold">$2,500.00</td>
                                        </tr>
                                        <tr className="border-b border-slate-100">
                                            <td className="py-6">
                                                <p className="text-sm font-bold">Custom Icon Library</p>
                                                <p className="text-[10px] text-slate-400 mt-1">24 bespoke icons for marketing</p>
                                            </td>
                                            <td className="py-6 text-center text-sm">$30.00</td>
                                            <td className="py-6 text-center text-sm">24</td>
                                            <td className="py-6 text-right text-sm font-bold">$720.00</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className="flex justify-end pt-12">
                                    <div className="w-64 space-y-4">
                                        <div className="flex justify-between text-slate-500">
                                            <span className="text-xs uppercase font-bold tracking-widest">Subtotal</span>
                                            <span className="text-sm font-bold font-mono">$3,220.00</span>
                                        </div>
                                        <div className="flex justify-between text-slate-900 border-t-2 border-slate-900 pt-4">
                                            <span className="text-sm uppercase font-black tracking-tighter">Total Amount</span>
                                            <span className="text-lg font-black font-mono">$3,220.00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-8">
                            <section className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-text-tertiary">Invoice Status</h4>
                                <Card className="bg-success/5 border-success/20">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">Fully Paid</p>
                                                <p className="text-xs text-text-secondary">Mar 15, 2026 · Stripe</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="w-full text-xs text-success border-success/20 h-10">Record another payment</Button>
                                    </CardContent>
                                </Card>
                            </section>

                            <section className="space-y-4">
                                <h4 className="text-sm font-bold uppercase tracking-widest text-text-tertiary">Activity Log</h4>
                                <div className="space-y-6">
                                    {[
                                        { icon: CheckCircle2, label: "Payment received", time: "Mar 15, 09:42 AM", color: "text-success" },
                                        { icon: Eye, label: "Invoice viewed", time: "Mar 14, 02:15 PM", color: "text-accent" },
                                        { icon: Send, label: "Invoice sent", time: "Mar 12, 11:30 AM", color: "text-info" },
                                        { icon: Plus, label: "Invoice created", time: "Mar 12, 11:15 AM", color: "text-text-tertiary" },
                                    ].map((activity, i) => (
                                        <div key={i} className="flex gap-4 relative">
                                            {i !== 3 && <div className="absolute left-2.5 top-8 bottom-[-24px] w-px bg-border-default" />}
                                            <div className={cn("w-5 h-5 rounded-full bg-surface border border-border-default flex items-center justify-center shrink-0 relative z-10", activity.color)}>
                                                <activity.icon size={12} />
                                            </div>
                                            <div className="pb-8">
                                                <p className="text-sm font-medium">{activity.label}</p>
                                                <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1">{activity.time}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}