"use client";

import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
    ArrowUpRight,
    Plus,
    Users,
    DollarSign,
    AlertCircle,
    CheckCircle2,
    UserPlus,
    FileUp
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    AreaChart
} from "recharts";
import { ActionsDropdown } from "@/components/dashboard/ActionsDropdown";

const stats = [
    {
        label: "Total Revenue",
        value: "$45,231.89",
        trend: "+20.1% from last month",
        isPositive: true,
        icon: DollarSign,
        iconColor: "text-amber-500"
    },
    {
        label: "Outstanding",
        value: "$12,234.00",
        trend: "5 invoices overdue",
        isPositive: false,
        icon: AlertCircle,
        iconColor: "text-amber-500"
    },
    {
        label: "Paid Invoices",
        value: "573",
        trend: "+12% from last month",
        isPositive: true,
        icon: CheckCircle2,
        iconColor: "text-emerald-500"
    },
    {
        label: "Active Clients",
        value: "24",
        trend: "+2 new this month",
        isPositive: true,
        icon: Users,
        iconColor: "text-violet-500"
    },
];

const recentInvoices = [
    { id: "INV-1042", client: "Acme Corp", amount: "$3,200.00", date: "Oct 24, 2023", status: "paid" as const },
    { id: "INV-1041", client: "Globex Inc", amount: "$1,500.00", date: "Oct 22, 2023", status: "sent" as const },
    { id: "INV-1040", client: "Soylent Corp", amount: "$4,800.00", date: "Oct 20, 2023", status: "overdue" as const },
    { id: "INV-1039", client: "Initech", amount: "$2,100.00", date: "Oct 18, 2023", status: "draft" as const },
    { id: "INV-1038", client: "Umbrella Corp", amount: "$9,500.00", date: "Oct 15, 2023", status: "paid" as const },
];

const data = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4500 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 5500 },
];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background border border-border-default p-3 rounded-lg shadow-2xl">
                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mb-1">{payload[0].payload.month}</p>
                <p className="text-sm font-bold text-white">${payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

export default function DashboardHome() {
    return (
        <div className="flex flex-col min-h-screen">
            <DashboardHeader title="Dashboard" />
            <main className="p-6 space-y-8 bg-background">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <Card key={i} className="bg-surface/20 border-border-default hover:border-border-active transition-all cursor-default relative overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-medium text-text-tertiary">{stat.label}</span>
                                    <stat.icon size={16} className={stat.iconColor} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">{stat.value}</h3>
                                <div className="flex items-center gap-1">
                                    {stat.isPositive && (i === 0 || i === 2) && (
                                        <ArrowUpRight size={12} className="text-success" />
                                    )}
                                    <p className={cn(
                                        "text-[11px] font-medium",
                                        stat.isPositive || (i === 3) ? "text-success" : "text-text-tertiary"
                                    )}>
                                        {stat.trend}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Overview Chart */}
                    <Card className="lg:col-span-2 bg-surface/20 border-border-default">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-lg font-bold text-white">Revenue Overview</h2>
                            </div>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="4 4" stroke="rgba(63, 63, 70, 0.2)" vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#71717A', fontSize: 10 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#71717A', fontSize: 10, fontFamily: 'var(--font-dm-mono)' }}
                                            tickFormatter={(value) => `$${value}`}
                                            domain={[0, 6000]}
                                            ticks={[0, 1500, 3000, 4500, 6000]}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#F59E0B"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorRev)"
                                            dot={{ fill: '#F59E0B', r: 4, strokeWidth: 2, stroke: '#0A0A0B' }}
                                            activeDot={{ r: 6, strokeWidth: 1, stroke: '#F59E0B' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Side Panels */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <Card className="bg-surface/20 border-border-default">
                            <CardContent className="p-6 space-y-6">
                                <h2 className="text-sm font-bold text-text-tertiary uppercase tracking-widest">Quick Actions</h2>
                                <div className="space-y-3">
                                    <Link href="/dashboard/invoices/new" className="w-full">
                                        <Button className="w-full bg-accent text-black hover:bg-accent/90 h-12 justify-center gap-2 font-bold shadow-glow-sm">
                                            <Plus size={18} />
                                            <span>New Invoice</span>
                                        </Button>
                                    </Link>
                                    <Link href="/dashboard/clients" className="w-full">
                                        <Button variant="ghost" className="w-full h-12 justify-center gap-2 border-border-default text-text-secondary hover:text-white">
                                            <UserPlus size={18} />
                                            <span>Add Client</span>
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" className="w-full h-12 justify-center gap-2 border-border-default text-text-secondary hover:text-white">
                                        <FileUp size={18} />
                                        <span>Import CSV</span>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Activity */}
                        <Card className="bg-surface/20 border-border-default">
                            <CardContent className="p-6">
                                <h2 className="text-sm font-bold text-text-tertiary uppercase tracking-widest mb-6">Recent Activity</h2>
                                <div className="space-y-6">
                                    {[
                                        "Invoice #1041 sent to Acme Corp",
                                        "Invoice #1042 sent to Acme Corp",
                                        "Invoice #1043 sent to Acme Corp",
                                    ].map((text, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                            <div>
                                                <p className="text-sm text-text-secondary">{text}</p>
                                                <p className="text-[10px] text-text-tertiary font-bold tracking-widest uppercase mt-1">2 hours ago</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Invoices Table */}
                <Card className="bg-surface/20 border-border-default">
                    <CardContent className="p-0">
                        <div className="p-6 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">Recent Invoices</h2>
                            <Link href="/dashboard/invoices">
                                <button className="cursor-pointer text-xs text-text-tertiary hover:text-white transition-colors">View All</button>
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="border-b border-border-default">
                                    <tr>
                                        <th className="px-8 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Invoice</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Client</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Amount</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Date</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-4 text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-default/50">
                                    {recentInvoices.map((invoice) => (
                                        <tr key={invoice.id} className="hover:bg-surface/20 transition-colors group">
                                            <td className="px-8 py-5 text-sm font-mono font-bold text-white">{invoice.id}</td>
                                            <td className="px-8 py-5 text-sm text-text-secondary">{invoice.client}</td>
                                            <td className="px-8 py-5 text-sm font-mono font-bold text-white">{invoice.amount}</td>
                                            <td className="px-8 py-5 text-sm text-text-tertiary">{invoice.date}</td>
                                            <td className="px-8 py-5 text-sm">
                                                <Badge variant={invoice.status}>{invoice.status}</Badge>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <ActionsDropdown invoiceId={invoice.id} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
