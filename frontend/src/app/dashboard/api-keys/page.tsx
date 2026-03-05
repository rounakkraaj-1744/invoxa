"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Key, Copy, Trash2, Plus, Terminal, ExternalLink, Activity } from "lucide-react";

export default function APIKeys() {
    const keys = [
        { name: "Production Key", key: "sk_live_••••••••••••3f9a", created: "Jan 12, 2026", used: "2 mins ago", requests: "12,402" },
        { name: "Staging Key", key: "sk_test_••••••••••••9a2b", created: "Feb 05, 2026", used: "5 hours ago", requests: "850" },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <DashboardHeader title="API Keys" />

            <main className="flex-1 p-8 space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">API Keys</h1>
                        <p className="text-sm text-text-secondary mt-1">Manage your keys and integrate Invoxa into your tech stack.</p>
                    </div>
                    <Button className="gap-2 shadow-glow">
                        <Plus size={18} />
                        <span>Create New Key</span>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="bg-surface/30">
                            <CardContent className="p-0">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-surface border-b border-border-default">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Name</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Key</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Last Used</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">30d Requests</th>
                                            <th className="px-6 py-4"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border-default/50">
                                        {keys.map((k, i) => (
                                            <tr key={i} className="hover:bg-surface transition-colors group">
                                                <td className="px-6 py-4 text-sm font-medium">{k.name}</td>
                                                <td className="px-6 py-4 text-sm font-mono text-text-secondary">
                                                    <div className="flex items-center gap-2">
                                                        {k.key}
                                                        <button className="p-1 hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity"><Copy size={12} /></button>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-text-tertiary">{k.used}</td>
                                                <td className="px-6 py-4 text-sm font-mono">{k.requests}</td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="p-2 text-text-tertiary hover:text-error hover:bg-error/10 rounded-md transition-all">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </CardContent>
                        </Card>

                        {/* Usage Stats (Placeholder for chart) */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <Activity size={18} className="text-accent" />
                                    <span>API Traffic (Last 30 Days)</span>
                                </h2>
                            </div>
                            <Card className="h-64 bg-surface/10 border-dashed border-2 flex items-center justify-center">
                                <div className="text-center text-text-tertiary">
                                    <p className="text-sm italic">Detailed traffic analytics will appear here as your integration grows.</p>
                                    <Button variant="ghost" className="mt-4 text-xs h-8">View Detailed Report</Button>
                                </div>
                            </Card>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="bg-surface/50 border-accent/20">
                            <CardContent className="p-6 space-y-6">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                                    <Terminal size={16} />
                                    <span>Quick Implementation</span>
                                </h3>

                                <div className="space-y-4">
                                    <div className="bg-black/40 rounded-md p-4 font-mono text-xs border border-white/5 space-y-2">
                                        <p className="text-text-tertiary">// Initialise client</p>
                                        <p className="text-emerald-400">const <span className="text-foreground">invoxa</span> = <span className="text-sky-400">new</span> <span className="text-yellow-400">Invoxa</span>('<span className="text-orange-400">sk_live_...</span>');</p>
                                        <br />
                                        <p className="text-text-tertiary">// Create invoice</p>
                                        <p className="text-emerald-400"><span className="text-sky-400">await</span> <span className="text-foreground">invoxa</span>.invoices.<span className="text-sky-400">create</span>({`{`}</p>
                                        <p className="pl-4 text-emerald-400">amount: <span className="text-orange-400">320000</span>,</p>
                                        <p className="pl-4 text-emerald-400">currency: '<span className="text-orange-400">USD</span>'</p>
                                        <p className="text-emerald-400">{`}`});</p>
                                    </div>

                                    <Button variant="ghost" className="w-full justify-between h-10 text-xs gap-2">
                                        <span>View Full Documentation</span>
                                        <ExternalLink size={14} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <h4 className="text-sm font-bold mb-4">Webhooks</h4>
                                <p className="text-xs text-text-secondary leading-relaxed mb-6">Receive real-time notifications for payment and invoice events.</p>
                                <Button variant="ghost" className="w-full border-dashed h-12 gap-2">
                                    <Plus size={14} /> Add Endpoint
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
